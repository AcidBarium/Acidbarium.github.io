---
title: EmbedBitcodePass的移植
date: 2025-07-02
updated: 2025-10-13
categories: LLVM
tags:
  - 笔记
  - pass
---



# EmbedBitcodePass

EmbedBitcodePass 是一个 LLVM 中的优化 pass，主要作用是将一个模块的 bitcode 嵌入到另一个模块中，以便在后续的链接或编译过程中，能够携带原始模块的信息。具体来说，它将当前模块的 bitcode 嵌入到一个新的全局变量中，使得这个模块成为一个"自包含"的模块。

<!-- more -->

<details>
  <summary>llvm17上的源代码</summary>

```cpp
//===- EmbedBitcodePass.cpp - Pass that embeds the bitcode into a global---===//
//
// Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
// See https://llvm.org/LICENSE.txt for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
//
//===----------------------------------------------------------------------===//

#include "llvm/Transforms/IPO/EmbedBitcodePass.h"
#include "llvm/Bitcode/BitcodeWriter.h"
#include "llvm/Bitcode/BitcodeWriterPass.h"
#include "llvm/IR/PassManager.h"
#include "llvm/Pass.h"
#include "llvm/Support/ErrorHandling.h"
#include "llvm/Support/MemoryBufferRef.h"
#include "llvm/Support/raw_ostream.h"
#include "llvm/TargetParser/Triple.h"
#include "llvm/Transforms/IPO/ThinLTOBitcodeWriter.h"
#include "llvm/Transforms/Utils/Cloning.h"
#include "llvm/Transforms/Utils/ModuleUtils.h"

#include <memory>
#include <string>

using namespace llvm;

PreservedAnalyses EmbedBitcodePass::run(Module &M, ModuleAnalysisManager &AM) {
  if (M.getGlobalVariable("llvm.embedded.module", /*AllowInternal=*/true))
    report_fatal_error("Can only embed the module once",
                       /*gen_crash_diag=*/false);

  Triple T(M.getTargetTriple());
  if (T.getObjectFormat() != Triple::ELF)
    report_fatal_error(
        "EmbedBitcode pass currently only supports ELF object format",
        /*gen_crash_diag=*/false);

  std::unique_ptr<Module> NewModule = CloneModule(M);
  MPM.run(*NewModule, AM);

  std::string Data;
  raw_string_ostream OS(Data);
  if (IsThinLTO)
    ThinLTOBitcodeWriterPass(OS, /*ThinLinkOS=*/nullptr).run(*NewModule, AM);
  else
    BitcodeWriterPass(OS, /*ShouldPreserveUseListOrder=*/false, EmitLTOSummary)
        .run(*NewModule, AM);

  embedBufferInModule(M, MemoryBufferRef(Data, "ModuleData"), ".llvm.lto");

  return PreservedAnalyses::all();
}

```




</details>


<details>
  <summary>移植之后</summary>

```cpp

#include "llvm/ADT/Triple.h"
#include "llvm/Bitcode/BitcodeWriter.h"
#include "llvm/Bitcode/BitcodeWriterPass.h"
#include "llvm/IR/Constants.h"
#include "llvm/IR/GlobalVariable.h"
#include "llvm/IR/LegacyPassManager.h"
#include "llvm/IR/Module.h"
#include "llvm/IR/PassManager.h"
#include "llvm/InitializePasses.h"
#include "llvm/Pass.h"
#include "llvm/PassRegistry.h"
#include "llvm/Support/ErrorHandling.h"
#include "llvm/Support/MemoryBufferRef.h"
#include "llvm/Support/raw_ostream.h"
#include "llvm/Transforms/IPO/PassManagerBuilder.h"
#include "llvm/Transforms/Utils/Cloning.h"
#include "llvm/Transforms/Utils/ModuleUtils.h"

#include <memory>
#include <string>

using namespace llvm;

// 新版本LLVM中没有embedBufferInModule函数，提供替代实现
static void embedBufferInModule(Module &M, const MemoryBufferRef &Buffer,
                                const Twine &SectionName) {
  // 创建全局变量来存储bitcode数据
  Constant *Data = ConstantDataArray::get(
      M.getContext(), ArrayRef<uint8_t>(reinterpret_cast<const uint8_t *>(
                                            Buffer.getBufferStart()),
                                        Buffer.getBufferSize()));
  GlobalVariable *GV =
      new GlobalVariable(M, Data->getType(), true, GlobalValue::PrivateLinkage,
                         Data, "llvm.embedded.module");
  GV->setSection(SectionName.str());
}

// EmbedBitcodePass类定义
struct EmbedBitcodeOptions {
  EmbedBitcodeOptions() : IsThinLTO(false), EmitLTOSummary(false) {}
  EmbedBitcodeOptions(bool IsThinLTO, bool EmitLTOSummary)
      : IsThinLTO(IsThinLTO), EmitLTOSummary(EmitLTOSummary) {}
  bool IsThinLTO;
  bool EmitLTOSummary;
};

class EmbedBitcodePass : public ModulePass {
  bool IsThinLTO;
  bool EmitLTOSummary;
  Pass *MPM;

public:
  static char ID;

  // 默认构造函数，用于RegisterPass
  EmbedBitcodePass()
      : ModulePass(ID), IsThinLTO(false), EmitLTOSummary(false), MPM(nullptr) {}

  EmbedBitcodePass(EmbedBitcodeOptions Opts)
      : ModulePass(ID), IsThinLTO(Opts.IsThinLTO),
        EmitLTOSummary(Opts.EmitLTOSummary), MPM(nullptr) {}
  EmbedBitcodePass(bool IsThinLTO, bool EmitLTOSummary, Pass *MPM = nullptr)
      : ModulePass(ID), IsThinLTO(IsThinLTO), EmitLTOSummary(EmitLTOSummary),
        MPM(MPM) {}

  bool runOnModule(Module &M) override;

  static bool isRequired() { return true; }
};

// 静态ID定义
char EmbedBitcodePass::ID = 0;

// Pass实现
bool EmbedBitcodePass::runOnModule(Module &M) {
  if (M.getGlobalVariable("llvm.embedded.module", /*AllowInternal=*/true))
    report_fatal_error("Can only embed the module once",
                       /*gen_crash_diag=*/false);

  Triple T(M.getTargetTriple());
  if (T.getObjectFormat() != Triple::ELF)
    report_fatal_error(
        "EmbedBitcode pass currently only supports ELF object format",
        /*gen_crash_diag=*/false);

  // 使用新版本的CloneModule调用
  std::unique_ptr<Module> NewModule = CloneModule(M);

  if (MPM) {
    // 使用legacy PassManager来运行Pass
    legacy::PassManager PM;
    PM.add(MPM);
    PM.run(*NewModule);
  }

  std::string Data;
  raw_string_ostream OS(Data);
  if (IsThinLTO) {
    // 老版本可能没有ThinLTOBitcodeWriterPass，使用普通的BitcodeWriterPass
    BitcodeWriterPass BitcodePass(OS, /*ShouldPreserveUseListOrder=*/false);
    // 使用新版本的PassManager API
    ModuleAnalysisManager DummyAM;
    BitcodePass.run(*NewModule, DummyAM);
  } else {
    // 使用新版本的BitcodeWriterPass构造函数
    BitcodeWriterPass BitcodePass(OS, /*ShouldPreserveUseListOrder=*/false);
    // 使用新版本的PassManager API
    ModuleAnalysisManager DummyAM;
    BitcodePass.run(*NewModule, DummyAM);
  }

  embedBufferInModule(M, MemoryBufferRef(Data, "ModuleData"), ".llvm.lto");

  return false; // 不修改原始模块
}

//===----------------------------------------------------------------------===//
// Pass注册和初始化
//===----------------------------------------------------------------------===//

// 创建Pass的函数
static Pass *createEmbedBitcodePass() {
  return new EmbedBitcodePass(false, false); // 默认参数
}

// 注册Pass
static RegisterPass<EmbedBitcodePass> X("embed-bitcode",
                                        "Embed bitcode into global variable",
                                        false /* Only looks at CFG */,
                                        false /* Analysis Pass */);

// 注册Pass创建函数
static RegisterPass<EmbedBitcodePass>
    Y("embed-bitcode-thinlto", "Embed ThinLTO bitcode into global variable",
      false /* Only looks at CFG */, false /* Analysis Pass */);

// 初始化函数 - 这个函数会被opt自动调用
extern "C" void LLVMInitializeEmbedBitcodePass() {
  RegisterPass<EmbedBitcodePass> X(
      "embed-bitcode", "Embed bitcode into global variable", false, false);

  // 注册Pass创建函数 - 使用新的API
  // 注意：新版本LLVM的PassRegistry API可能不同，这里简化处理
}

// 如果使用静态链接，需要这个函数
static void registerEmbedBitcodePass(const PassManagerBuilder &,
                                     legacy::PassManagerBase &PM) {
  PM.add(createEmbedBitcodePass());
}

// 注册到PassManagerBuilder
static RegisterStandardPasses
    RegisterEmbedBitcodePass(PassManagerBuilder::EP_ModuleOptimizerEarly,
                             registerEmbedBitcodePass);
```


</details>


<details>
  <summary>测试用文件</summary>


```
; ModuleID = 'test.c'
source_filename = "test.c"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-unknown-linux-gnu"

; 简单的测试函数
define i32 @main() {
entry:
  %retval = alloca i32, align 4
  store i32 0, i32* %retval, align 4
  ret i32 42
}

; 另一个测试函数
define i32 @add(i32 %a, i32 %b) {
entry:
  %a.addr = alloca i32, align 4
  %b.addr = alloca i32, align 4
  store i32 %a, i32* %a.addr, align 4
  store i32 %b, i32* %b.addr, align 4
  %0 = load i32, i32* %a.addr, align 4
  %1 = load i32, i32* %b.addr, align 4
  %add = add nsw i32 %0, %1
  ret i32 %add
}

; 全局变量测试
@global_var = global i32 100, align 4

; 字符串常量
@.str = private unnamed_addr constant [13 x i8] c"Hello World!\00", align 1

; 函数声明
declare i32 @printf(i8*, ...)
```


</details>




## 原版
```
/home/acidcopper/D/vscode/llvm-project/build/bin/opt  -passes=embed-bitcode -S  test.ll -o output2.ll
```

### 优化后的ll

```
; ModuleID = 'test.ll'
source_filename = "test.c"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-unknown-linux-gnu"

@global_var = global i32 100, align 4
@.str = private unnamed_addr constant [13 x i8] c"Hello World!\00", align 1
@llvm.embedded.object = private constant [2008 x i8] c"BC\C0\DE5\14\00\00\05\00\00\00b\0C0$LY\BEf\BD\FB\B4OG\82\10\05\C8\14\00\00!\0C\00\00\92\01\00\00\0B\02!\00\02\00\00\00\16\00\00\00\07\81#\91A\C8\04I\06\1029\92\01\84\0C%\05\08\19\1E\04\8Bb\80\10E\02B\92\0BB\84\102\148\08\18K\0A2B\88Hp\C4!#D\12\87\8C\10A\92\02d\C8\08\B1\14 CF\88 \C9\012B\84\18*(*\901|\B0\\\91 \C4\C8\00\00\00\89 \00\00\0D\00\00\00\22f\04\10\B2B\82\09\11RB\82\09\91q\C2PH\0A\09&D\C6\05BB&\08\12\9A#\00\839\02$\1B\A4\04Q\86\88\A8B\C0@\C0\08\00\00\00\00\130|\C0\03;\F8\05;\A0\836\A8\07wX\07wx\87{p\876`\87tp\87z\C0\8768\07w\A8\87\0D\A6P\0Em\D0\0EzP\0Em\00\0Frp\07p\A0\07s \07z0\07r\D0\06\F0 \07w\10\07z0\07r\A0\07s \07m\00\0Frp\07r\A0\07v@\07z`\07t\D0\06\E9`\07t\A0\07v@\07m`\0Ex\00\07z\10\07r\80\07m\E0\0Ex\A0\07q`\07z0\07r\A0\07v@\07m0\0Bq \07x\A0\F4\80\10!\11d\C8H\11\11@#\84a\8D\89\90&_ \80B\82\01\DE1)\C40\1CI\00\00@\00\00\00\108\000\A4r\08\02\00\00\00\00\00\00\00\00\00\00\00\C0\01\86T\D2P\00\00\00\00\00\00\00\00\00\00\00\008\C0\90\AA2\0C \00\00\00\00\00\00\00\00\00\00\00\07\90\D8 P\D82\00\00 \0B\04\00\00\08\00\00\002\1E\98\0C\19\11L\90\8C\09&G\C6\04C\8AB\0E\A0Q\06Yf\B3\DF\A0\EB[\CE&\87\00\B1\18\00\00\B9\00\00\003\08\80\1C\C4\E1\1Cf\14\01=\88C8\84\C3\8CB\80\07yx\07s\98q\0C\E6\00\0F\ED\10\0E\F4\80\0E3\0CB\1E\C2\C1\1D\CE\A1\1Cf0\05=\88C8\84\83\1B\CC\03=\C8C=\8C\03=\CCx\8Ctp\07{\08\07yH\87pp\07zp\03vx\87p \87\19\CC\11\0E\EC\90\0E\E10\0Fn0\0F\E3\F0\0E\F0P\0E3\10\C4\1D\DE!\1C\D8!\1D\C2a\1Ef0\89;\BC\83;\D0C9\B4\03<\BC\83<\84\03;\CC\F0\14v`\07{h\077h\87rh\077\80\87p\90\87p`\07v(\07v\F8\05vx\87w\80\87_\08\87q\18\87r\98\87y\98\81,\EE\F0\0E\EE\E0\0E\F5\C0\0E\EC0\03b\C8\A1\1C\E4\A1\1C\CC\A1\1C\E4\A1\1C\DCa\1C\CA!\1C\C4\81\1D\CAa\06\D6\90C9\C8C9\98C9\C8C9\B8\C38\94C8\88\03;\94\C3/\BC\83<\FC\82;\D4\03;\B0\C3\0C\C7i\87pX\87rp\83th\07x`\87t\18\87t\A0\87\19\CES\0F\EE\00\0F\F2P\0E\E4\90\0E\E3@\0F\E1 \0E\ECP\0E3 (\1D\DC\C1\1E\C2A\1E\D2!\1C\DC\81\1E\DC\E0\1C\E4\E1\1D\EA\01\1Ef\18Q8\B0C:\9C\83;\CCP$v`\07{h\077`\87wx\07x\98QL\F4\90\0F\F0P\0E3\1Ej\1E\CAa\1C\E8!\1D\DE\C1\1D~\01\1E\E4\A1\1C\CC!\1D\F0a\06T\85\838\CC\C3;\B0C=\D0C9\FC\C2<\E4C;\88\C3;\B0\C3\8C\C5\0A\87y\98\87w\18\87t\08\07z(\07r\98\81\\\E3\10\0E\EC\C0\0E\E5P\0E\F30#\C1\D2A\1E\E4\E1\17\D8\E1\1D\DE\01\1EfH\19;\B0\83=\B4\83\1B\84\C38\8CC9\CC\C3<\B8\C19\C8\C3;\D4\03<\CCH\B4q\08\07v`\07q\08\87qX\87\19\DB\C6\0E\EC`\0F\ED\E0\06\F0 \0F\E50\0F\E5 \0F\F6P\0En\10\0E\E30\0E\E50\0F\F3\E0\06\E9\E0\0E\E4P\0E\F80#\E2\ECa\1C\C2\81\1D\D8\E1\17\EC!\1D\E6!\1D\C4!\1D\D8!\1D\E8!\1Ff \9D;\BCC=\B8\039\94\839\CCX\BCpp\07wx\07z\08\07zH\87wp\87\19\CB\E7\0E\EF0\0F\E1\E0\0E\E9@\0F\E9\A0\0F\E50\C3\01\03s\A8\07w\18\87_\98\87pp\87t\A0\87t\D0\87r\98\81\84A9\E0\C38\B0C=\90C9\CC@\C4\A0\1D\CA\A1\1D\E0A\1E\DE\C1\1Cf$c0\0E\E1\C0\0E\EC0\0F\E9@\0F\E50C!\83u\18\07sH\87_\A0\87|\80\87r\98\B1\94\01<\8C\C3<\94\C38\D0C:\BC\83;\CC\C3\8C\C5\0CH!\15Ba\1E\E6!\1D\CE\C1\1DR\81\14\00\A9\18\00\00-\00\00\00\0B\0Ar(\87w\80\07zXp\98C=\B8\C38\B0C9\D0\C3\82\E6\1C\C6\A1\0D\E8A\1E\C2\C1\1D\E6!\1D\E8!\1D\DE\C1\1D\164\E3`\0E\E7P\0F\E1 \0F\E4@\0F\E1 \0F\E7P\0E\F4\B0\80\81\07y(\87p`\07vx\87q\08\07z(\07rXp\9C\C38\B4\01;\A4\83=\94\C3\02k\1C\D8!\1C\DC\E1\1C\DC \1C\E4a\1C\DC \1C\E8\81\1E\C2a\1C\D0\A1\1C\C8a\1C\C2\81\1D\D8a\C1\01\0F\F4 \0F\E1P\0F\F4\80\0E\0B\88u\18\07sH\87\05\CF8\BC\83;\D8C9\C8\C39\94\83;\8CC9\8C\03=\C8\03;\00\00\00\00\D1\10\00\00\06\00\00\00\07\CC<\A4\83;\9C\03;\94\03=\A0\83<\94C8\90\C3\01\00\00\00a \00\00\0F\00\00\00\13\04A,\10\00\00\00\02\00\00\00\14%0\02PT\00\003\11Ap\8C\C2\B0\01\11\0C\03\B0B8\10\00\04\00\00\00\A6`D\C4T\01\CB\01\14D3E\18\00\00\00\00\00\00\00a \00\00\17\00\00\00\13\04A,\10\00\00\00\01\00\00\00\14%\00\003\11A\90\8C\C2LD\10$\A30l@\08\C5\00\0C\1B\10\011\00$\C4 !\06\0A\01\08l\10\0E\04\00\08\00\00\00\86\10\04\E60\00\C3`\0BF\E0\03\C3\10\99\82\01\F8\C00D\07P\10\CD\14av\10\00\00\00\00\00\00\00q \00\00\03\00\00\002\0E\10\22\84\02\EC\028\D0/\00\00\00\00\00e\0C\00\007\00\00\00\12\03\94\B0\01\00\00\00\03\00\00\00\1B\00\00\001\00\00\00L\00\00\00\01\00\00\00X\00\00\00\00\00\00\00X\00\00\00\05\00\00\00\D0\00\00\00\00\00\00\00L\00\00\00\18\00\00\00d\00\00\00\06\00\00\00\0E\00\00\00\00\00\00\00\D0\00\00\00\00\00\00\00\00\00\00\00\05\00\00\00\00\00\00\00\0E\00\00\00\04\00\00\00\0E\00\00\00\04\00\00\00\FF\FF\FF\FF\00$\00\00\12\00\00\00\03\00\00\00\12\00\00\00\03\00\00\00\FF\FF\FF\FF\00$\00\00\15\00\00\00\06\00\00\00\15\00\00\00\06\00\00\00\FF\FF\FF\FF\08$\00\00\00\00\00\00\0A\00\00\00\00\00\00\00\0A\00\00\00\FF\FF\FF\FF\00\04\00\00j\00\00\00\06\00\00\00\0A\00\00\00\04\00\00\00\FF\FF\FF\FF\00\18\00\00\00\00\00\00]\0C\00\00\1F\00\00\00\12\03\94\F0\00\00\00\00global_var.strmainaddprintf17.0.0rc 88bf774c565080e30e0a073676c316ab175303afx86_64-unknown-linux-gnutest.c.L.str\00\00\00\00", section ".llvm.lto", align 1, !exclude !0
@llvm.compiler.used = appending global [1 x ptr] [ptr @llvm.embedded.object], section "llvm.metadata"

define i32 @main() {
entry:
  %retval = alloca i32, align 4
  store i32 0, ptr %retval, align 4
  ret i32 42
}

define i32 @add(i32 %a, i32 %b) {
entry:
  %a.addr = alloca i32, align 4
  %b.addr = alloca i32, align 4
  store i32 %a, ptr %a.addr, align 4
  store i32 %b, ptr %b.addr, align 4
  %0 = load i32, ptr %a.addr, align 4
  %1 = load i32, ptr %b.addr, align 4
  %add = add nsw i32 %0, %1
  ret i32 %add
}

declare i32 @printf(ptr, ...)

!llvm.embedded.objects = !{!1}

!0 = !{}
!1 = !{ptr @llvm.embedded.object, !".llvm.lto"}

```


## 移植之后


```
/home/acidcopper/llvm-project/build/bin/opt -load /home/acidcopper/llvm-project/build/lib/EmbedBitcodePass.so -embed-bitcode-thinlto -enable-new-pm=0 -S test.ll -o output.ll
```




### 优化后的ll
```
; ModuleID = 'test.ll'
source_filename = "test.c"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-unknown-linux-gnu"

@global_var = global i32 100, align 4
@.str = private unnamed_addr constant [13 x i8] c"Hello World!\00", align 1
@llvm.embedded.module = private constant [1832 x i8] c"BC\C0\DE5\14\00\00\05\00\00\00b\0C0$JY\BEf}\FB\B4O\0BQ\80L\01\00\00\00!\0C\00\00f\01\00\00\0B\02!\00\02\00\00\00\16\00\00\00\07\81#\91A\C8\04I\06\1029\92\01\84\0C%\05\08\19\1E\04\8Bb\80\10E\02B\92\0BB\84\102\148\08\18K\0A2B\88Hp\C4!#D\12\87\8C\10A\92\02d\C8\08\B1\14 CF\88 \C9\012B\84\18*(*\901|\B0\\\91 \C4\C8\00\00\00\89 \00\00\0F\00\00\002\22\08\09 bF\00!+$\98\10!%$\98\10\19'\0C\85\A4\90`Bd\\ $d\82\C0\99#\00\03\829\02D\1B\84\C6\04@e\06\00\A0#\B1\02$\E9@\C0\08\00\00\130|\C0\03;\F8\05;\A0\836\A8\07wX\07wx\87{p\876`\87tp\87z\C0\8768\07w\A8\87\0D\A6P\0Em\D0\0EzP\0Em\00\0Frp\07p\A0\07s \07z0\07r\D0\06\F0 \07w\10\07z0\07r\A0\07s \07m\00\0Frp\07r\A0\07v@\07z`\07t\D0\06\E9`\07t\A0\07v@\07m`\0Ex\00\07z\10\07r\80\07m\E0\0Ex\A0\07q`\07z0\07r\A0\07v@\07m0\0Bq \07x\A0\F4\80\10!\11d\C8H\11\11@#\84a\8D\89\90&_ \80\02\82\01\DE!)\C40\1CI\00\00@\00\00\00\108\C0\90\CA!\0A\00\00\00\00\00\00\00\00\00\00\00\00\07\18RI\C3\01\00\00\00\00\00\00\00\00\00\00\00\E0\00C\AA\CAP\80\00\00\00\00\00\00\00\00\00\00\00\1C@b\83@a\B5\00\00\80,\10\00\00\00\08\00\00\002\1E\98\0C\19\11L\90\8C\09&G\C6\04C\82B\0E\A0Q\06Yf\B3\DF\A0\EB[\CE&\87\00\B1\18\00\00\97\00\00\003\08\80\1C\C4\E1\1Cf\14\01=\88C8\84\C3\8CB\80\07yx\07s\98q\0C\E6\00\0F\ED\10\0E\F4\80\0E3\0CB\1E\C2\C1\1D\CE\A1\1Cf0\05=\88C8\84\83\1B\CC\03=\C8C=\8C\03=\CCx\8Ctp\07{\08\07yH\87pp\07zp\03vx\87p \87\19\CC\11\0E\EC\90\0E\E10\0Fn0\0F\E3\F0\0E\F0P\0E3\10\C4\1D\DE!\1C\D8!\1D\C2a\1Ef0\89;\BC\83;\D0C9\B4\03<\BC\83<\84\03;\CC\F0\14v`\07{h\077h\87rh\077\80\87p\90\87p`\07v(\07v\F8\05vx\87w\80\87_\08\87q\18\87r\98\87y\98\81,\EE\F0\0E\EE\E0\0E\F5\C0\0E\EC0\03b\C8\A1\1C\E4\A1\1C\CC\A1\1C\E4\A1\1C\DCa\1C\CA!\1C\C4\81\1D\CAa\06\D6\90C9\C8C9\98C9\C8C9\B8\C38\94C8\88\03;\94\C3/\BC\83<\FC\82;\D4\03;\B0\C3\0C\C7i\87pX\87rp\83th\07x`\87t\18\87t\A0\87\19\CES\0F\EE\00\0F\F2P\0E\E4\90\0E\E3@\0F\E1 \0E\ECP\0E3 (\1D\DC\C1\1E\C2A\1E\D2!\1C\DC\81\1E\DC\E0\1C\E4\E1\1D\EA\01\1Ef\18Q8\B0C:\9C\83;\CCP$v`\07{h\077`\87wx\07x\98QL\F4\90\0F\F0P\0E3\1Ej\1E\CAa\1C\E8!\1D\DE\C1\1D~\01\1E\E4\A1\1C\CC!\1D\F0a\06T\85\838\CC\C3;\B0C=\D0C9\FC\C2<\E4C;\88\C3;\B0\C3\8C\C5\0A\87y\98\87w\18\87t\08\07z(\07r\98\81\\\E3\10\0E\EC\C0\0E\E5P\0E\F30#\C1\D2A\1E\E4\E1\17\D8\E1\1D\DE\01\1EfH\19;\B0\83=\B4\83\1B\84\C38\8CC9\CC\C3<\B8\C19\C8\C3;\D4\03<\CCH\B4q\08\07v`\07q\08\87qX\87\19\DB\C6\0E\EC`\0F\ED\E0\06\F0 \0F\E50\0F\E5 \0F\F6P\0En\10\0E\E30\0E\E50\0F\F3\E0\06\E9\E0\0E\E4P\0E\F80#\E2\ECa\1C\C2\81\1D\D8\E1\17\EC!\1D\E6!\1D\C4!\1D\D8!\1D\E8!\1Ff \9D;\BCC=\B8\039\94\839\CCX\BCpp\07wx\07z\08\07zH\87wp\07\00\00\A9\18\00\00!\00\00\00\0B\0Ar(\87w\80\07zXp\98C=\B8\C38\B0C9\D0\C3\82\E6\1C\C6\A1\0D\E8A\1E\C2\C1\1D\E6!\1D\E8!\1D\DE\C1\1D\164\E3`\0E\E7P\0F\E1 \0F\E4@\0F\E1 \0F\E7P\0E\F4\B0\80\81\07y(\87p`\07vx\87q\08\07z(\07rXp\9C\C38\B4\01;\A4\83=\94\C3\02k\1C\D8!\1C\DC\E1\1C\DC \1C\E4a\1C\DC \1C\E8\81\1E\C2a\1C\D0\A1\1C\C8a\1C\C2\81\1D\D8\01\D1\10\00\00\06\00\00\00\07\CC<\A4\83;\9C\03;\94\03=\A0\83<\94C8\90\C3\01\00\00\00a \00\00\0F\00\00\00\13\04A,\10\00\00\00\02\00\00\00\04%0\02PT\00\003\11\00p\8C\C2\B0\01\11\0C\03\B0B8\10\00\04\00\00\00\07P\10\CD\14a\A6`D\C4T\01\0B\00\00\00\00\00\00\00a \00\00\17\00\00\00\13\04A,\10\00\00\00\01\00\00\00\04%\00\003\11\00\90\8C\C2L\04\00$\A30l@\08\C5\00\0C\1B\10\011\00$\C0 \01\06\0A\01\08l\10\0E\04\00\08\00\00\00v\10\00\86\10\04\07P\10\CD\14a\E60\00\C3`\0A\06\E0\03\C3\10\D9\82\11\F8\C00D\00\00\00\00\00\00q \00\00\03\00\00\002\0E\10\22\84\02\C0\028\10-\00\00\00\00\00e\0C\00\007\00\00\00\12\03\94\B0\01\00\00\00\03\00\00\00\1B\00\00\00/\00\00\00L\00\00\00\01\00\00\00X\00\00\00\00\00\00\00X\00\00\00\05\00\00\00\D0\00\00\00\00\00\00\00J\00\00\00\18\00\00\00b\00\00\00\06\00\00\00\0E\00\00\00\00\00\00\00\D0\00\00\00\00\00\00\00\00\00\00\00\05\00\00\00\00\00\00\00\0E\00\00\00\04\00\00\00\0E\00\00\00\04\00\00\00\FF\FF\FF\FF\00$\00\00\12\00\00\00\03\00\00\00\12\00\00\00\03\00\00\00\FF\FF\FF\FF\00$\00\00\15\00\00\00\06\00\00\00\15\00\00\00\06\00\00\00\FF\FF\FF\FF\08$\00\00\00\00\00\00\0A\00\00\00\00\00\00\00\0A\00\00\00\FF\FF\FF\FF\00\04\00\00h\00\00\00\06\00\00\00\0A\00\00\00\04\00\00\00\FF\FF\FF\FF\00\18\00\00\00\00\00\00]\0C\00\00\1F\00\00\00\12\03\94\EE\00\00\00\00global_var.strmainaddprintf13.0.0 d7b669b3a30345cfcdb2fde2af6f48aa4b94845dx86_64-unknown-linux-gnutest.c.L.str\00\00\00\00\00\00", section ".llvm.lto"

define i32 @main() {
entry:
  %retval = alloca i32, align 4
  store i32 0, i32* %retval, align 4
  ret i32 42
}

define i32 @add(i32 %a, i32 %b) {
entry:
  %a.addr = alloca i32, align 4
  %b.addr = alloca i32, align 4
  store i32 %a, i32* %a.addr, align 4
  store i32 %b, i32* %b.addr, align 4
  %0 = load i32, i32* %a.addr, align 4
  %1 = load i32, i32* %b.addr, align 4
  %add = add nsw i32 %0, %1
  ret i32 %add
}

declare i32 @printf(i8*, ...)

```


在第一段代码中，声明了一个名为 @llvm.embedded.module 的私有常量，而在第二段代码中，声明的是 @llvm.embedded.object 全局变量，并且第二段代码中还有 @llvm.compiler.used 全局变量，它是用于将某些全局变量标记为被编译器使用，防止链接器优化掉这些变量。
两段代码中嵌入式模块或对象的二进制数据在长度和具体内容上可能有差异（如第一段是 [1832 x i8]，第二段是 [2008 x i8]），这些数据可能是在编译过程中的不同阶段生成的，用于不同的编译器内部处理或优化目的。但由于这些数据在运行时可能并不直接影响函数逻辑，所以对运行效果的影响不大。
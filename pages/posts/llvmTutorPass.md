---
title: LLVM-Tutor Pass 开发与实践
date: 2025-06-20
updated: 2025-10-13
categories: LLVM
tags:
  - 笔记
  - pass
---


## 📖 今日学习总结：LLVM-Tutor Pass 开发与实践

---

## 🎯 背景：

LLVM 是一个现代化、模块化、可扩展的编译框架。
**Pass** 是 LLVM 中用来分析或改写 IR (中间表示) 的功能单元。
**LLVM-Tutor** 是一个专门给新手练习 LLVM Pass 开发的开源项目，基于 LLVM 19。

---

## 📦 工具 & 命令行程序总结

| 工具 / 命令 | 作用                               |
| :------ | :------------------------------- |
| `cmake` | 配置 CMake 项目，生成 Makefile 编译配置文件   |
| `make`  | 根据 Makefile 编译生成动态库（.so 插件）      |
| `clang` | 编译 C 源码生成 LLVM IR（.ll 或 .bc）文件   |
| `opt`   | LLVM 的优化器/Pass 管理工具，执行分析或转换 Pass |
| `lli`   | LLVM 的 IR 解释器，直接运行 .bc 文件（带插桩的）  |

---

## 📄 文件后缀与用途总结

| 后缀名                | 类型               | 作用                                     | 示例                    |
| :----------------- | :--------------- | :------------------------------------- | :-------------------- |
| `.c`               | C 源代码            | 你写的普通 C 程序，供 clang 编译                  | `input_for_hello.c`   |
| `.ll`              | LLVM IR（文本格式）    | 用 clang `-emit-llvm -S` 生成，便于阅读和调试     | `input_for_hello.ll`  |
| `.bc`              | LLVM IR（Bitcode） | clang `-emit-llvm -c` 生成，opt/lli 能直接操作 | `input_for_hello.bc`  |
| `.so`              | 动态链接库（插件）        | 编译好的 Pass 插件，opt 加载执行                  | `libHelloWorld.so`    |
| `.dylib`           | Mac 上的动态库        | 和 .so 类似，只是 Mac 平台下的动态库格式              | `libHelloWorld.dylib` |
| `instrumented.bin` | 插桩后的 bitcode     | InjectFuncCall Pass 输出的插桩 IR，lli 能直接跑  | `instrumented.bin`    |


---

## 📊 文件生命周期：

1️⃣ `.c` 源代码
↓（clang 编译）
2️⃣ `.bc` 或 `.ll`
↓（opt 加载 pass 分析或转换）
3️⃣ 插桩后 `.bc` 或 `.bin`
↓（lli 执行）





## 📖 Pass 实战总结：

---

### 📌 HelloWorld Pass

* **类型**：分析 Pass
* **作用**：遍历模块中所有函数，打印函数名和参数个数
* **命令**：


```cpp

//=============================================================================
// FILE:
//    HelloWorld.cpp
//
// DESCRIPTION:
//    Visits all functions in a module, prints their names and the number of
//    arguments via stderr. Strictly speaking, this is an analysis pass (i.e.
//    the functions are not modified). However, in order to keep things simple
//    there's no 'print' method here (every analysis pass should implement it).
//
// USAGE:
//    New PM
//      opt -load-pass-plugin=libHelloWorld.dylib -passes="hello-world" `\`
//        -disable-output <input-llvm-file>
//
//
// License: MIT
//=============================================================================
#include "llvm/IR/LegacyPassManager.h"
#include "llvm/Passes/PassBuilder.h"
#include "llvm/Passes/PassPlugin.h"
#include "llvm/Support/raw_ostream.h"

using namespace llvm;

//-----------------------------------------------------------------------------
// HelloWorld implementation
//-----------------------------------------------------------------------------
// No need to expose the internals of the pass to the outside world - keep
// everything in an anonymous namespace.
namespace {

// This method implements what the pass does
void visitor(Function &F) {
    errs() << "(llvm-tutor) Hello from: "<< F.getName() << "\n";
    errs() << "(llvm-tutor)   number of arguments: " << F.arg_size() << "\n";
}

// New PM implementation
struct HelloWorld : PassInfoMixin<HelloWorld> {
  // Main entry point, takes IR unit to run the pass on (&F) and the
  // corresponding pass manager (to be queried if need be)
  PreservedAnalyses run(Function &F, FunctionAnalysisManager &) {
    visitor(F);
    return PreservedAnalyses::all();
  }

  // Without isRequired returning true, this pass will be skipped for functions
  // decorated with the optnone LLVM attribute. Note that clang -O0 decorates
  // all functions with optnone.
  static bool isRequired() { return true; }
};
} // namespace

//-----------------------------------------------------------------------------
// New PM Registration
//-----------------------------------------------------------------------------
llvm::PassPluginLibraryInfo getHelloWorldPluginInfo() {
  return {LLVM_PLUGIN_API_VERSION, "HelloWorld", LLVM_VERSION_STRING,
          [](PassBuilder &PB) {
            PB.registerPipelineParsingCallback(
                [](StringRef Name, FunctionPassManager &FPM,
                   ArrayRef<PassBuilder::PipelineElement>) {
                  if (Name == "hello-world") {
                    FPM.addPass(HelloWorld());
                    return true;
                  }
                  return false;
                });
          }};
}

// This is the core interface for pass plugins. It guarantees that 'opt' will
// be able to recognize HelloWorld when added to the pass pipeline on the
// command line, i.e. via '-passes=hello-world'
extern "C" LLVM_ATTRIBUTE_WEAK ::llvm::PassPluginLibraryInfo
llvmGetPassPluginInfo() {
  return getHelloWorldPluginInfo();
}


```


input_for_hello.c
```cpp
int foo(int a) {
  return a * 2;
}

int bar(int a, int b) {
  return (a + foo(b) * 2);
}

int fez(int a, int b, int c) {
  return (a + bar(a, b) * 2 + c * 3);
}

int main(int argc, char *argv[]) {
  int a = 123;
  int ret = 0;

  ret += foo(a);
  ret += bar(a, ret);
  ret += fez(a, ret, 123);

  return ret;
}
```


```bash
$LLVM_DIR/bin/opt -load-pass-plugin ./libHelloWorld.so -passes=hello-world -disable-output input.ll
```

输出

```bash
acidcopper@Acidbarium:~/llvm-tutor/build$ /usr/lib/llvm-19/bin/opt -load-pass-plugin ./libHelloWorld.so -passes=hello-world -disable-output ~/llvm-tutor/input_for_hello.ll
(llvm-tutor) Hello from: foo
(llvm-tutor)   number of arguments: 1
(llvm-tutor) Hello from: bar
(llvm-tutor)   number of arguments: 2
(llvm-tutor) Hello from: fez
(llvm-tutor)   number of arguments: 3
(llvm-tutor) Hello from: main
(llvm-tutor)   number of arguments: 2


```



**收获**：
👉 熟悉 Pass 基本结构和注册方式，了解如何读取 IR 中函数信息。







---

### 📌 OpcodeCounter Pass

* **类型**：分析 Pass
* **作用**：统计每个函数中各类 LLVM 指令 (Opcode) 使用次数，打印统计摘要
* **命令**：

```bash
$LLVM_DIR/bin/opt -load-pass-plugin ./libOpcodeCounter.so --passes="print<opcode-counter>" -disable-output input.bc
```

**收获**：
👉 理解 IR 中不同指令类型，掌握遍历 IR 指令的方式。

---

### 📌 StaticCallCounter Pass

* **类型**：静态分析 Pass
* **作用**：统计静态直接函数调用次数（不算运行时调用次数，for循环内多次执行算 1 次）
* **命令**：

```bash
$LLVM_DIR/bin/opt -load-pass-plugin ./libStaticCallCounter.so -passes="print<static-cc>" -disable-output input.bc
```

**重点理解**：
👉 **静态分析** 是“数代码里写了几次 call”，不是运行时执行次数。



```cpp
void foo() { }
void bar() {foo(); }
void fez() {bar(); }

int main() {
  foo();
  bar();
  fez();

  int ii = 0;
  for (ii = 0; ii < 10; ii++)
    foo();

  return 0;
}


```





```bash

acidcopper@Acidbarium:~/llvm-tutor/build$ $LLVM_DIR/bin/opt -load-pass-plugin ~/llvm-tutor/build/lib/libOpcodeCounter.so --passes="print<opcode-counter>" -disable-output input_for_cc.bc
Printing analysis 'OpcodeCounter Pass' for function 'foo':
=================================================
LLVM-TUTOR: OpcodeCounter results
=================================================
OPCODE               #TIMES USED
-------------------------------------------------
ret                  1         
-------------------------------------------------

Printing analysis 'OpcodeCounter Pass' for function 'bar':
=================================================
LLVM-TUTOR: OpcodeCounter results
=================================================
OPCODE               #TIMES USED
-------------------------------------------------
call                 1         
ret                  1         
-------------------------------------------------

Printing analysis 'OpcodeCounter Pass' for function 'fez':
=================================================
LLVM-TUTOR: OpcodeCounter results
=================================================
OPCODE               #TIMES USED
-------------------------------------------------
call                 1         
ret                  1         
-------------------------------------------------

Printing analysis 'OpcodeCounter Pass' for function 'main':
=================================================
LLVM-TUTOR: OpcodeCounter results
=================================================
OPCODE               #TIMES USED
-------------------------------------------------
add                  1         
call                 4         
ret                  1         
load                 2         
br                   4         
alloca               2         
store                4         
icmp                 1         
-------------------------------------------------

```

---

### 📌 InjectFuncCall Pass

* **类型**：转换（插桩） Pass
* **作用**：在每个函数开头插入 `printf`，运行时打印当前进入哪个函数。
* **命令**：

```bash
$LLVM_DIR/bin/opt -load-pass-plugin ./libInjectFuncCall.so --passes="inject-func-call" input.bc -o instrumented.bin
$LLVM_DIR/bin/lli instrumented.bin
```



```cpp

int foo(int a) {
  return a * 2;
}

int bar(int a, int b) {
  return (a + foo(b) * 2);
}

int fez(int a, int b, int c) {
  return (a + bar(a, b) * 2 + c * 3);
}

int main(int argc, char *argv[]) {
  int a = 123;
  int ret = 0;

  ret += foo(a);
  ret += bar(a, ret);
  ret += fez(a, ret, 123);

  return ret;
}


```



```bash

acidcopper@Acidbarium:~/llvm-tutor/build$ $LLVM_DIR/bin/lli instrumented.bin
(llvm-tutor) Hello from: main
(llvm-tutor)   number of arguments: 2
(llvm-tutor) Hello from: foo
(llvm-tutor)   number of arguments: 1
(llvm-tutor) Hello from: bar
(llvm-tutor)   number of arguments: 2
(llvm-tutor) Hello from: foo
(llvm-tutor)   number of arguments: 1
(llvm-tutor) Hello from: fez
(llvm-tutor)   number of arguments: 3
(llvm-tutor) Hello from: bar
(llvm-tutor)   number of arguments: 2
(llvm-tutor) Hello from: foo
(llvm-tutor)   number of arguments: 1

```




input_for_cc.c
```cpp

void foo() { }
void bar() {foo(); }
void fez() {bar(); }

int main() {
  foo();
  bar();
  fez();

  int ii = 0;
  for (ii = 0; ii < 10; ii++)
    foo();

  return 0;
}

```


```bash

acidcopper@Acidbarium:~/llvm-tutor/build$ lli instrumented2.bin 
(llvm-tutor) Hello from: main
(llvm-tutor)   number of arguments: 0
(llvm-tutor) Hello from: foo
(llvm-tutor)   number of arguments: 0
(llvm-tutor) Hello from: bar
(llvm-tutor)   number of arguments: 0
(llvm-tutor) Hello from: foo
(llvm-tutor)   number of arguments: 0
(llvm-tutor) Hello from: fez
(llvm-tutor)   number of arguments: 0
(llvm-tutor) Hello from: bar
(llvm-tutor)   number of arguments: 0
(llvm-tutor) Hello from: foo
(llvm-tutor)   number of arguments: 0
(llvm-tutor) Hello from: foo
(llvm-tutor)   number of arguments: 0
(llvm-tutor) Hello from: foo
(llvm-tutor)   number of arguments: 0
(llvm-tutor) Hello from: foo
(llvm-tutor)   number of arguments: 0
(llvm-tutor) Hello from: foo
(llvm-tutor)   number of arguments: 0
(llvm-tutor) Hello from: foo
(llvm-tutor)   number of arguments: 0
(llvm-tutor) Hello from: foo
(llvm-tutor)   number of arguments: 0
(llvm-tutor) Hello from: foo
(llvm-tutor)   number of arguments: 0
(llvm-tutor) Hello from: foo
(llvm-tutor)   number of arguments: 0
(llvm-tutor) Hello from: foo
(llvm-tutor)   number of arguments: 0
(llvm-tutor) Hello from: foo
(llvm-tutor)   number of arguments: 0


```


**收获**：
👉 掌握 IR 中插入新指令、实现动态插桩的方法。









---

## 📚 Pass 分类小结：

| Pass 类型          | 作用                     | 示例                       |
| :--------------- | :--------------------- | :----------------------- |
| **分析 Pass**      | 读取 IR 信息，不修改 IR        | HelloWorld、OpcodeCounter |
| **转换 Pass**      | 改写 IR                  | InjectFuncCall           |
| **静态分析 vs 动态分析** | 静态 → 数代码本身，动态 → 数运行时行为 | StaticCallCounter 静态     |

---

## ✅ 今日收获：

* 搭建和配置 LLVM + CMake 外部插件编译环境
* 理解 LLVM Pass 基础结构、注册机制和分类
* 编写并运行分析/转换 Pass，掌握 IR 遍历和修改方法
* 理解静态分析 vs 动态分析的本质区别
* 熟悉 opt/lli 工具链用法，完成 LLVM-Tutor 中的一些 Pass 实践




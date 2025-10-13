---
title: LLVM常见Pass
date: 2025-06-22
updated: 2025-10-13
categories: LLVM
tags:
  - 笔记
  - pass
---




 `llvm/lib/Transforms/Scalar/` 这个目录，它是 LLVM 源码里**最重要**的 Pass 实现目录之一，放的都是**基于标量级优化（Scalar Optimization）** 的 Pass —— 也就是不涉及复杂循环嵌套、多维数组、矢量化的高级优化，而是针对单个值、单个变量、单个基本块、单个循环的**局部优化**。


##  Pass 注册和调用

这些 Pass 都是通过 `PassBuilder` 或 `legacy PassManager` 注册的。
在 `llvm/lib/Passes/PassRegistry.def` 或 `llvm/lib/Passes/PassBuilder.cpp` 里能找到它们的别名和调用方式。




### Mem2Reg.cpp

llvm-project-release-13.x\llvm-project-release-13.x\llvm\lib\Transforms\Utils\Mem2Reg.cpp

Mem2Reg 是 LLVM 中最常用、最基础、性能收益最大的 Pass，把 IR 从“命令式内存模型”转成“SSA 寄存器模型”，便于后续做所有高级优化（比如 GVN、LICM、DCE 等）。




<details>
  <summary>Mem2Reg.cpp</summary>

 ```cpp
//===- Mem2Reg.cpp - The -mem2reg pass, a wrapper around the Utils lib ----===//
//
// Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
// See https://llvm.org/LICENSE.txt for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
//
//===----------------------------------------------------------------------===//
//
// This pass is a simple pass wrapper around the PromoteMemToReg function call
// exposed by the Utils library.
//
//===----------------------------------------------------------------------===//

#include "llvm/Transforms/Utils/Mem2Reg.h"
#include "llvm/ADT/Statistic.h"
#include "llvm/Analysis/AssumptionCache.h"
#include "llvm/IR/BasicBlock.h"
#include "llvm/IR/Dominators.h"
#include "llvm/IR/Function.h"
#include "llvm/IR/Instructions.h"
#include "llvm/IR/PassManager.h"
#include "llvm/InitializePasses.h"
#include "llvm/Pass.h"
#include "llvm/Support/Casting.h"
#include "llvm/Transforms/Utils.h"
#include "llvm/Transforms/Utils/PromoteMemToReg.h"
#include <vector>

using namespace llvm;

#define DEBUG_TYPE "mem2reg"

STATISTIC(NumPromoted, "Number of alloca's promoted");

static bool promoteMemoryToRegister(Function &F, DominatorTree &DT,
                                    AssumptionCache &AC) {
  std::vector<AllocaInst *> Allocas;
  BasicBlock &BB = F.getEntryBlock(); // Get the entry node for the function
  bool Changed = false;

  while (true) {
    Allocas.clear();

    // Find allocas that are safe to promote, by looking at all instructions in
    // the entry node
    for (BasicBlock::iterator I = BB.begin(), E = --BB.end(); I != E; ++I)
      if (AllocaInst *AI = dyn_cast<AllocaInst>(I)) // Is it an alloca?
        if (isAllocaPromotable(AI))
          Allocas.push_back(AI);

    if (Allocas.empty())
      break;

    PromoteMemToReg(Allocas, DT, &AC);
    NumPromoted += Allocas.size();
    Changed = true;
  }
  return Changed;
}

PreservedAnalyses PromotePass::run(Function &F, FunctionAnalysisManager &AM) {
  auto &DT = AM.getResult<DominatorTreeAnalysis>(F);
  auto &AC = AM.getResult<AssumptionAnalysis>(F);
  if (!promoteMemoryToRegister(F, DT, AC))
    return PreservedAnalyses::all();

  PreservedAnalyses PA;
  PA.preserveSet<CFGAnalyses>();
  return PA;
}

namespace {

struct PromoteLegacyPass : public FunctionPass {
  // Pass identification, replacement for typeid
  static char ID;

  PromoteLegacyPass() : FunctionPass(ID) {
    initializePromoteLegacyPassPass(*PassRegistry::getPassRegistry());
  }

  // runOnFunction - To run this pass, first we calculate the alloca
  // instructions that are safe for promotion, then we promote each one.
  bool runOnFunction(Function &F) override {
    if (skipFunction(F))
      return false;

    DominatorTree &DT = getAnalysis<DominatorTreeWrapperPass>().getDomTree();
    AssumptionCache &AC =
        getAnalysis<AssumptionCacheTracker>().getAssumptionCache(F);
    return promoteMemoryToRegister(F, DT, AC);
  }

  void getAnalysisUsage(AnalysisUsage &AU) const override {
    AU.addRequired<AssumptionCacheTracker>();
    AU.addRequired<DominatorTreeWrapperPass>();
    AU.setPreservesCFG();
  }
};

} // end anonymous namespace

char PromoteLegacyPass::ID = 0;

INITIALIZE_PASS_BEGIN(PromoteLegacyPass, "mem2reg", "Promote Memory to "
                                                    "Register",
                      false, false)
INITIALIZE_PASS_DEPENDENCY(AssumptionCacheTracker)
INITIALIZE_PASS_DEPENDENCY(DominatorTreeWrapperPass)
INITIALIZE_PASS_END(PromoteLegacyPass, "mem2reg", "Promote Memory to Register",
                    false, false)

// createPromoteMemoryToRegister - Provide an entry point to create this pass.
FunctionPass *llvm::createPromoteMemoryToRegisterPass() {
  return new PromoteLegacyPass();
}

 ```


</details>














<details>
  <summary>具体做法</summary>
    
    

###  功能总结一句：

 **这是一个封装好的 Pass，调用 `PromoteMemToReg` 工具函数，来把 `alloca` 局部变量优化成 SSA 寄存器值。**


##  逐段解读

###   1. 导入头文件

导入需要用到的 IR 数据结构、分析器（DominatorTree、AssumptionCache）以及工具库 `PromoteMemToReg.h`。


###   2. `promoteMemoryToRegister()` 函数

 功能：

* 遍历 `Function` 的 `entry block`
* 找到所有 `alloca` 指令
* 判断它是否是**可提升的**（`isAllocaPromotable`）
* 调用 `PromoteMemToReg()` 进行寄存器化替换

 核心：

```cpp
PromoteMemToReg(Allocas, DT, &AC);
```

⚙️ 注意：**PromoteMemToReg** 真正做了：

* SSA 重命名
* Dominator Tree 分析
* Phi 节点插入
* 替换 load/store 成 SSA 值


这个文件就是把核心逻辑 `PromoteMemToReg` 包装成一个 LLVM Pass，供 PassManager 调度调用。





</details>






### GVN.cpp

"D:\TZB\study\day2\llvm-project-release-13.x\llvm-project-release-13.x\llvm\lib\Transforms\Scalar\GVN.cpp"


 `GVN.cpp` 是 LLVM 优化器里非常经典、核心的一个**公共子表达式消除（CSE）+ 死载入删除（Dead Load Elimination）** Pass。





<details>
  <summary>详细内容</summary>




  ##  原英文注释

  ```cpp
  //===- GVN.cpp - Eliminate redundant values and loads ---------------------===//
  //
  // This pass performs global value numbering to eliminate fully redundant
  // instructions.  It also performs simple dead load elimination.
  //
  // Note that this pass does the value numbering itself; it does not use the
  // ValueNumbering analysis passes.
  //
  //===----------------------------------------------------------------------===//
  ```


  ##  中文翻译 + 逐句解读

  ###  这个 Pass 实现了：

  **全局值编号 (GVN, Global Value Numbering)**

  > GVN 是一种常见的优化方法，通过给表达式赋予“值号”来识别等价表达式，再消除重复计算。

  简单说：
   如果程序里有多个表达式计算结果相同，GVN 可以**保留第一个计算结果，后续复用，不再重复计算。**



  ###  注意：

  > 这个 Pass 自己做了值编号（value numbering），**不依赖 `ValueNumbering` 分析器 Pass**。
  >  换句话说，它是一个**自包含的 GVN 实现**。



  ### 优化前：

  ```llvm
  %a = add i32 %x, %y
  %b = add i32 %x, %y
  %r = add i32 %a, %b
  ```

  ### GVN 优化后：

  ```llvm
  %a = add i32 %x, %y
  %r = add i32 %a, %a

```


   **GVN.cpp 实现了全局值编号 (GVN)，用于消除冗余计算和死载入。**
  是 LLVM IR 中经典的 CSE 优化手段，比 DCE、ADCE 覆盖面更广、作用更强。




</details>










### DCE.cpp


**Dead Code Elimination (DCE)** 是编译器中常见的一种优化技术，旨在删除程序中**不会影响最终执行结果的无用指令**。它通过分析程序的**值使用情况和副作用**，识别出既没有被其他指令使用，也不会对程序状态产生影响（如内存写入、函数调用副作用等）的计算和操作，将这些冗余代码安全移除，从而减少程序体积、提升运行效率。DCE 通常作为中后期优化流程中的基础 Pass，为后续优化提供更简洁的中间表示 (IR)。



<details>
  <summary>代码上的原注释</summary>

```cpp
//===- DCE.cpp - Code to perform dead code elimination --------------------===//
//
// Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
// See https://llvm.org/LICENSE.txt for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
//
//===----------------------------------------------------------------------===//
//
// This file implements dead inst elimination and dead code elimination.
//
// Dead Inst Elimination performs a single pass over the function removing
// instructions that are obviously dead.  Dead Code Elimination is similar, but
// it rechecks instructions that were used by removed instructions to see if
// they are newly dead.
//
//===----------------------------------------------------------------------===//

```



</details>







### ADCE.cpp


**Aggressive Dead Code Elimination (ADCE)** 是一种比传统 DCE 更激进的死代码删除优化方法。它通过**乐观地假设所有指令都是无用的**，然后从程序中必须执行、有副作用或影响控制流的指令出发，反向分析依赖关系，标记出真正“活跃”的指令，最终删除所有未被标记的死代码。ADCE 能清除一些常规 DCE 无法识别的冗余计算，尤其擅长消除**循环内部或复杂控制流中无影响的计算指令**，有效简化中间表示 (IR)，提高后续优化与生成代码的质量。


<details>
  <summary>代码上的原注释</summary>

```cpp
//===- ADCE.cpp - Code to perform dead code elimination -------------------===//
//
// Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
// See https://llvm.org/LICENSE.txt for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
//
//===----------------------------------------------------------------------===//
//
// This file implements the Aggressive Dead Code Elimination pass.  This pass
// optimistically assumes that all instructions are dead until proven otherwise,
// allowing it to eliminate dead computations that other DCE passes do not
// catch, particularly involving loop computations.
//
//===----------------------------------------------------------------------===//

```



</details>









### LICM.cpp


LICM (Loop Invariant Code Motion) 是 LLVM 中用于循环优化的重要 Pass，主要功能是将循环内每次执行结果相同、且不依赖循环变量的指令移出循环体（hoisting 到 preheader）或延后到循环退出后（sinking 到 exit block），以减少循环内重复计算，提升执行效率。同时，LICM 还能利用别名分析，将在循环内始终访问同一内存地址且无别名冲突的变量提升为寄存器变量，进一步降低内存访问开销。这一优化不仅提升运行时性能，也为后续中端优化简化 IR 结构，提供便利。



<details>
  <summary>代码上的原注释</summary>

```cpp

//===-- LICM.cpp - Loop Invariant Code Motion Pass ------------------------===//
//
// Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
// See https://llvm.org/LICENSE.txt for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
//
//===----------------------------------------------------------------------===//
//
// This pass performs loop invariant code motion, attempting to remove as much
// code from the body of a loop as possible.  It does this by either hoisting
// code into the preheader block, or by sinking code to the exit blocks if it is
// safe.  This pass also promotes must-aliased memory locations in the loop to
// live in registers, thus hoisting and sinking "invariant" loads and stores.
//
// Hoisting operations out of loops is a canonicalization transform.  It
// enables and simplifies subsequent optimizations in the middle-end.
// Rematerialization of hoisted instructions to reduce register pressure is the
// responsibility of the back-end, which has more accurate information about
// register pressure and also handles other optimizations than LICM that
// increase live-ranges.
//
// This pass uses alias analysis for two purposes:
//
//  1. Moving loop invariant loads and calls out of loops.  If we can determine
//     that a load or call inside of a loop never aliases anything stored to,
//     we can hoist it or sink it like any other instruction.
//  2. Scalar Promotion of Memory - If there is a store instruction inside of
//     the loop, we try to move the store to happen AFTER the loop instead of
//     inside of the loop.  This can only happen if a few conditions are true:
//       A. The pointer stored through is loop invariant
//       B. There are no stores or loads in the loop which _may_ alias the
//          pointer.  There are no calls in the loop which mod/ref the pointer.
//     If these conditions are true, we can promote the loads and stores in the
//     loop of the pointer to use a temporary alloca'd variable.  We then use
//     the SSAUpdater to construct the appropriate SSA form for the value.
//
//===----------------------------------------------------------------------===//

```


</details>




<details>
  <summary>原理简单概括</summary>


###  这个 Pass 实现了：

 **循环不变代码外提（Loop Invariant Code Motion, LICM）**


###  它做什么？

**把循环里不依赖循环变量、每次执行结果一样的指令**：

* **提到循环前**（preheader block）执行，称为 **hoisting**
* 或者**延后到循环退出后执行**，称为 **sinking**

这样可以避免不必要的重复计算，提升性能。


###  还能做：

**内存标量化（Scalar Promotion）**

* 如果一个循环内对某个地址（如 `a[i]`）的 `load/store` 没有其他指令会改动或者冲突（alias）
* 那么就可以把它变成寄存器变量，提升效率



###  为什么重要？

* **循环不变代码外提** 是编译器优化的基础手段之一，几乎所有优化器都会做
* 它能简化后续优化过程，比如：

  * 让 GVN、DCE 更容易发现冗余代码
  * 减少循环体内指令数量，提升执行速度


###  用到的分析：

* **别名分析（Alias Analysis）**

  * 判断内存访问是否可能冲突，保证提取/延后不会影响程序语义


##  举个例子：

### 优化前：

```llvm
for (int i = 0; i < N; ++i) {
  y = a + b;  // 每次循环结果一样，没必要放里面
  sum += y * A[i];
}
```

### LICM 优化后：

```llvm
y = a + b;
for (int i = 0; i < N; ++i) {
  sum += y * A[i];
}
```


##  命令行调用：

```bash
opt -licm -S input.ll -o output.ll
```


##  总结一句：

 **LICM 是一种经典的循环优化手段，将循环内不依赖循环变量、结果固定的计算提前或延后执行，从而减少循环体开销，提升性能。**





</details>
















### LoopUnroll.cpp


一种常见优化手段，通过把循环体复制多份，减少循环控制开销（比如 `for` 计数和判断）以及增加指令级并行性，提高执行效率。


<details>
  <summary>代码</summary>

```cpp
//===- LoopUnroll.cpp - Code to perform loop unrolling --------------------===//
//
// Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
// See https://llvm.org/LICENSE.txt for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
//
//===----------------------------------------------------------------------===//
//
// This file implements loop unrolling.
// 本文件实现了循环展开（Loop Unrolling）功能。
//===----------------------------------------------------------------------===//
#include "PassDetail.h"
#include "mlir/Analysis/LoopAnalysis.h"
#include "mlir/Dialect/Affine/IR/AffineOps.h"
#include "mlir/Dialect/Affine/Passes.h"
#include "mlir/IR/AffineExpr.h"
#include "mlir/IR/AffineMap.h"
#include "mlir/IR/Builders.h"
#include "mlir/Transforms/LoopUtils.h"
#include "llvm/ADT/DenseMap.h"
#include "llvm/Support/CommandLine.h"
#include "llvm/Support/Debug.h"

using namespace mlir;

#define DEBUG_TYPE "affine-loop-unroll"

namespace {

// TODO: this is really a test pass and should be moved out of dialect
// transforms.

/// Loop unrolling pass. Unrolls all innermost loops unless full unrolling and a
/// full unroll threshold was specified, in which case, fully unrolls all loops
/// with trip count less than the specified threshold. The latter is for testing
/// purposes, especially for testing outer loop unrolling.
struct LoopUnroll : public AffineLoopUnrollBase<LoopUnroll> {
  // Callback to obtain unroll factors; if this has a callable target, takes
  // precedence over command-line argument or passed argument.
  const std::function<unsigned(AffineForOp)> getUnrollFactor;

  LoopUnroll() : getUnrollFactor(nullptr) {}
  LoopUnroll(const LoopUnroll &other)
      : AffineLoopUnrollBase<LoopUnroll>(other),
        getUnrollFactor(other.getUnrollFactor) {}
  explicit LoopUnroll(
      Optional<unsigned> unrollFactor = None, bool unrollUpToFactor = false,
      bool unrollFull = false,
      const std::function<unsigned(AffineForOp)> &getUnrollFactor = nullptr)
      : getUnrollFactor(getUnrollFactor) {
    if (unrollFactor)
      this->unrollFactor = *unrollFactor;
    this->unrollUpToFactor = unrollUpToFactor;
    this->unrollFull = unrollFull;
  }

  void runOnFunction() override;

  /// Unroll this for op. Returns failure if nothing was done.
  LogicalResult runOnAffineForOp(AffineForOp forOp);
};
} // end anonymous namespace

/// Returns true if no other affine.for ops are nested within.
static bool isInnermostAffineForOp(AffineForOp forOp) {
  // Only for the innermost affine.for op's.
  bool isInnermost = true;
  forOp.walk([&](AffineForOp thisForOp) {
    // Since this is a post order walk, we are able to conclude here.
    isInnermost = (thisForOp == forOp);
    return WalkResult::interrupt();
  });
  return isInnermost;
}

/// Gathers loops that have no affine.for's nested within.
static void gatherInnermostLoops(FuncOp f,
                                 SmallVectorImpl<AffineForOp> &loops) {
  f.walk([&](AffineForOp forOp) {
    if (isInnermostAffineForOp(forOp))
      loops.push_back(forOp);
  });
}

void LoopUnroll::runOnFunction() {
  if (unrollFull && unrollFullThreshold.hasValue()) {
    // Store short loops as we walk.
    SmallVector<AffineForOp, 4> loops;

    // Gathers all loops with trip count <= minTripCount. Do a post order walk
    // so that loops are gathered from innermost to outermost (or else unrolling
    // an outer one may delete gathered inner ones).
    getFunction().walk([&](AffineForOp forOp) {
      Optional<uint64_t> tripCount = getConstantTripCount(forOp);
      if (tripCount.hasValue() && tripCount.getValue() <= unrollFullThreshold)
        loops.push_back(forOp);
    });
    for (auto forOp : loops)
      (void)loopUnrollFull(forOp);
    return;
  }

  // If the call back is provided, we will recurse until no loops are found.
  FuncOp func = getFunction();
  SmallVector<AffineForOp, 4> loops;
  for (unsigned i = 0; i < numRepetitions || getUnrollFactor; i++) {
    loops.clear();
    gatherInnermostLoops(func, loops);
    if (loops.empty())
      break;
    bool unrolled = false;
    for (auto forOp : loops)
      unrolled |= succeeded(runOnAffineForOp(forOp));
    if (!unrolled)
      // Break out if nothing was unrolled.
      break;
  }
}

/// Unrolls a 'affine.for' op. Returns success if the loop was unrolled,
/// failure otherwise. The default unroll factor is 4.
LogicalResult LoopUnroll::runOnAffineForOp(AffineForOp forOp) {
  // Use the function callback if one was provided.
  if (getUnrollFactor)
    return loopUnrollByFactor(forOp, getUnrollFactor(forOp));
  // Unroll completely if full loop unroll was specified.
  if (unrollFull)
    return loopUnrollFull(forOp);
  // Otherwise, unroll by the given unroll factor.
  if (unrollUpToFactor)
    return loopUnrollUpToFactor(forOp, unrollFactor);
  return loopUnrollByFactor(forOp, unrollFactor);
}

std::unique_ptr<OperationPass<FuncOp>> mlir::createLoopUnrollPass(
    int unrollFactor, bool unrollUpToFactor, bool unrollFull,
    const std::function<unsigned(AffineForOp)> &getUnrollFactor) {
  return std::make_unique<LoopUnroll>(
      unrollFactor == -1 ? None : Optional<unsigned>(unrollFactor),
      unrollUpToFactor, unrollFull, getUnrollFactor);
}



```


</details>



<details>
  <summary>原理</summary>


这段是 **MLIR（Multi-Level IR）里的 LoopUnroll.cpp**，它实现了一个**循环展开（Loop Unrolling）Pass**。

###  它是干什么的：

* \*\*循环展开（Loop Unrolling）\*\*是一种常见优化手段，通过把循环体复制多份，减少循环控制开销（比如 `for` 计数和判断）以及增加指令级并行性，提高执行效率。
* 这个 Pass 会：

  * 找出 **AffineForOp**（MLIR 中的 affine 版本 for 循环）
  * 判断是否是**最内层循环**
  * 按设定好的 **展开因子（unroll factor）**，或者直接**完全展开**（full unroll），把循环体复制对应次数
  * 支持用户提供 callback，动态决定不同循环的展开因子

###  它的特点：

* 专门面向 **Affine dialect**，针对 `affine.for` 语句操作
* 可以设定：

  * 固定展开因子（默认 4）
  * “尽量展开到多少倍”
  * 或“完全展开”（当循环次数是常量，且小于给定阈值）
* 支持递归多轮展开
* 用到了 MLIR 的 `walk` 和 `post order walk`，按从内到外的顺序收集、处理循环，避免展开外层导致内层循环消失


### 📖 总结一句：

**LoopUnroll.cpp** 实现了 MLIR 中 affine 循环的展开优化，可以通过设定因子、阈值或回调方式灵活控制展开策略，减少循环开销、提高并行度，是 affine dialect 优化的重要中端 pass。



</details>







### JumpThreading.cpp

是一种中端控制流优化技术，简单说就是：

在编译时，根据条件分支的已知路径，提前将某些跳转直接连起来，消除不必要的中间基本块，优化 CFG（Control Flow Graph），提升执行效率。


<details>
  <summary>注释</summary>

```cpp
//===- JumpThreading.cpp - Thread control through conditional blocks ------===//
//
// Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
// See https://llvm.org/LICENSE.txt for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
//
//===----------------------------------------------------------------------===//
//
// This file implements the Jump Threading pass.
//
//===----------------------------------------------------------------------===//
```



</details>







<details>
  <summary>具体原理</summary>


##  什么是 Jump Threading？

**Jump Threading** 是一种**控制流图（CFG）优化技术**，用于在编译中消除多余的中间分支跳转路径，优化执行路径，提高性能。

它的核心思想是：

* 如果程序中某个**条件分支的结果可以根据已有的信息提前确定**，就直接“穿线”（thread）过去，跳过无用的中间基本块，连通最终目标。


##  举个直观的例子：

假如你有这样一段伪代码：

```c
if (A) {
  if (A) {
    do_something();
  }
}
```

编译成控制流图可能是：

```
Block0
  |
  v
 Block1 (if A)
  |    |
  v    v
 B2   Block3 (if A again)
         |    |
         v    v
      B4     B5
```

你会发现：

* 如果 `Block1` 条件已经判断 `A`，到了 `Block3` 再判断 `A` 是**冗余的**。
* **Jump Threading** 就会“穿线”过去，把 `Block1` 中判断 `A` 为 true 的跳转直接连到 `do_something()`，消除掉 `Block3`。



##  它是怎么做的？

Jump Threading 的常见步骤：

1. **分析条件分支的值传播**

   * 看看能不能根据已有路径上的条件，推断某个分支条件的值。
2. **确定冗余跳转**

   * 找到那些条件判断可以提前确定的路径。
3. **修改控制流图**

   * 重定向跳转，消除中间块，或者直接合并基本块，简化 CFG。
4. **更新 PHI 节点**

   * 由于路径变化，PHI 节点可能要重新调整。



##  举个 LLVM 中的典型应用：

比如 LLVM IR 中：

```llvm
%cmp = icmp eq i32 %a, 0
br i1 %cmp, label %if.then, label %if.else

if.then:
  %cmp2 = icmp eq i32 %a, 0
  br i1 %cmp2, label %foo, label %bar
```

这里 `%cmp2` 判断的和 `%cmp` 完全一样。
**Jump Threading** 会把 `if.then` 中对 `%cmp2` 的判断提前确定成 true，直接跳到 `%foo`。



##  优化效果：

* 减少基本块数量
* 缩短分支预测路径
* 提高分支命中率
* 简化控制流，利好后续像 LICM、ADCE、DCE、GVN 等优化



##  总结一句：

> **Jump Threading = 利用已知条件，提前确定跳转路径，穿线优化控制流**



</details>










### SLPVectorizer.cpp



这是 LLVM 中一个非常重要的矢量化 pass，叫 SLP Vectorizer。

SLP（Superword Level Parallelism） 是一种在单个基本块内，检测可以并行执行的独立操作，然后将它们组合成 SIMD 向量操作的技术。

与 Loop Vectorizer 专门优化循环不同，SLP Vectorizer 主要在基本块范围内（BB-level）做向量化，对例如连续 store、load、加法、乘法等语句，找出它们的数据依赖关系，组建成树，最终把这些操作变成单条 SIMD 指令执行。

<details>
  <summary>注释</summary>


```cpp
//===- SLPVectorizer.cpp - A bottom up SLP Vectorizer ---------------------===//
//
// Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
// See https://llvm.org/LICENSE.txt for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
//
//===----------------------------------------------------------------------===//
//
// This pass implements the Bottom Up SLP vectorizer. It detects consecutive
// stores that can be put together into vector-stores. Next, it attempts to
// construct vectorizable tree using the use-def chains. If a profitable tree
// was found, the SLP vectorizer performs vectorization on the tree.
//
// The pass is inspired by the work described in the paper:
//  "Loop-Aware SLP in GCC" by Ira Rosen, Dorit Nuzman, Ayal Zaks.
//
//===----------------------------------------------------------------------===//



// 这个 pass 实现了**自底向上（Bottom Up）的 SLP（Superword Level Parallelism）矢量化器**。
// 它会检测可以组合成向量化存储操作（vector-store）的连续 store 指令。
// 接着，它尝试基于 use-def 链（使用-定义关系）构建一棵可向量化的运算树。
// 如果发现一棵具有优化价值的运算树，SLP Vectorizer 就会对其进行矢量化转换。


```



</details>




<details>
  <summary>做法</summary>


### 它怎么做？

大致流程：

1. **检测连续 store / load**

   * 找出内存地址连续、类型相同的操作。
2. **通过 use-def 链构建向量化树**

   * 顺着变量的使用-定义关系，向上递归构建一棵运算树，看看有哪些操作可以一起向量化。
3. **计算收益（Cost Model）**

   * 判断向量化后是否性能更优。
4. **如果收益可观，就执行矢量化**

   * 将多个标量操作组合成一条或多条 SIMD 指令。



###  举个例子

比如：

```c
a[i] = b[i] + c[i];
a[i+1] = b[i+1] + c[i+1];
a[i+2] = b[i+2] + c[i+2];
a[i+3] = b[i+3] + c[i+3];
```

原本 4 次加法 + 4 次 store。
SLP Vectorizer 能把 4 次加法拼成一条 `vector_add`，4 次 store 合并成 `vector_store`。











</details>


















### GlobalDCE.cpp






这是 LLVM 中的 **全局死代码删除（Global Dead Code Elimination, GlobalDCE）** pass，
它会删除那些：

* **作用域为 internal（例如 static 或未导出符号）**
* **且不可达**（没有被任何其他可达代码使用到）的全局变量、全局函数、常量等。

它的作用就是清理程序中完全无用的全局定义，减少最终程序体积，提高效率。





<details>
  <summary>注释</summary>

```cpp

//===-- GlobalDCE.cpp - DCE unreachable internal functions ----------------===//
//
// Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
// See https://llvm.org/LICENSE.txt for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
//
//===----------------------------------------------------------------------===//
//
// This transform is designed to eliminate unreachable internal globals from the
// program.  It uses an aggressive algorithm, searching out globals that are
// known to be alive.  After it finds all of the globals which are needed, it
// deletes whatever is left over.  This allows it to delete recursive chunks of
// the program which are unreachable.
//
//===----------------------------------------------------------------------===//


```


```cpp
//===-- GlobalDCE.cpp - 删除不可达的内部全局对象 ----------------===//
//
// 本文件属于 LLVM 项目，遵循 Apache License v2.0 和 LLVM 特别条款。
// 许可证信息见：https://llvm.org/LICENSE.txt
//
//===----------------------------------------------------------------------===//
//
// 这个优化变换（transform）用于**删除程序中不可达的内部全局对象（internal globals）**。  
// 它采用一种激进的策略：首先找出所有“已知存活（alive）”的全局对象，  
// 然后删除所有剩余的未被引用、不可达的全局对象。  
// 这种方法甚至可以删除那些相互递归但整体不可达的程序片段。
//
//===----------------------------------------------------------------------===//
```


</details>


<details>
  <summary>流程</summary>
对每个已知存活的全局对象，检查它引用的其他全局符号，
如果发现新引用的内部全局对象，也标记为存活，继续递归遍历。
</details>







### Inliner.cpp


把一个函数的调用点，替换成该函数的函数体代码，从而消除函数调用开销，增加后续优化空间。


<details>
  <summary>注释</summary>

```cpp

//===- Inliner.cpp - Pass to inline function calls ------------------------===//
//
// Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
// See https://llvm.org/LICENSE.txt for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
//
//===----------------------------------------------------------------------===//
//
// This file implements a basic inlining algorithm that operates bottom up over
// the Strongly Connect Components(SCCs) of the CallGraph. This enables a more
// incremental propagation of inlining decisions from the leafs to the roots of
// the callgraph.
//
//===----------------------------------------------------------------------===//

```

</details>


<details>
  <summary>做法</summary>


* **自底向上遍历调用图的 SCC**：

  * 先处理调用图中没有调用其他函数的叶子函数
  * 再逐渐向上传播内联决策
  * 强连通分量（SCC）指的是调用图中相互递归调用的函数集合，SCC 内联顺序很重要，避免递归死循环

* **增量式传播优化效果**
  内联后的函数可能变得“内联友好”，便于继续向上内联


</details>









### SROA.cpp


SROA 是 LLVM 中一种把结构体/数组内存分配拆成寄存器变量的优化 pass，通过提升局部变量，减少内存访问，优化性能，同时也便于后续 SSA 形式的优化。


<details>
  <summary>注释</summary>

```cpp

//===- SROA.cpp - 聚合类型标量替换（Scalar Replacement Of Aggregates）---===//
//
// 本文件实现了著名的聚合类型标量替换（SROA）优化。
// 它尝试识别一个 aggregate alloca（聚合类型内存分配）中可以被提升（promote）到寄存器的元素，
// 并将它们替换为寄存器中的标量变量。
// 如果合适，它还会尝试将某些元素或元素集合，转换成向量或位域风格的整数标量。
//
// 这个 pass 尽量避免对 alloca 内存区域做无意义的拆分，
// 保持那些仅仅在内存和外部地址间转移的内存块不被拆解成标量代码。
//
// 由于这个 pass 同时也执行 alloca 提升（promote），可以看作是帮助完成






//===- SROA.cpp - Scalar Replacement Of Aggregates ------------------------===//
//
// Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
// See https://llvm.org/LICENSE.txt for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
//
//===----------------------------------------------------------------------===//
/// \file
/// This transformation implements the well known scalar replacement of
/// aggregates transformation. It tries to identify promotable elements of an
/// aggregate alloca, and promote them to registers. It will also try to
/// convert uses of an element (or set of elements) of an alloca into a vector
/// or bitfield-style integer scalar if appropriate.
///
/// It works to do this with minimal slicing of the alloca so that regions
/// which are merely transferred in and out of external memory remain unchanged
/// and are not decomposed to scalar code.
///
/// Because this also performs alloca promotion, it can be thought of as also
/// serving the purpose of SSA formation. The algorithm iterates on the
/// function until all opportunities for promotion have been realized.
///
//===----------------------------------------------------------------------===//



```

</details>







<details>
  <summary>作用</summary>


##  它的作用：

*  把 `alloca` 出来的聚合类型（如 `struct`、`数组`）内存分配中的独立元素，**拆分成单个标量变量**，提升到寄存器，减少内存访问开销
*  有时还会将一组元素打包成向量（vector）或整型位域
*  避免拆解那些只是简单搬运进出内存的内存块，保持内存操作简单高效
*  会多轮迭代，直到所有能提升的元素都完成替换
*  也被视为**辅助构建 SSA 形式**的重要步骤



##  总结一句：

 **SROA 是 LLVM 中一种把结构体/数组内存分配拆成寄存器变量的优化 pass**，通过提升局部变量，减少内存访问，优化性能，同时也便于后续 SSA 形式的优化。

   

</details>









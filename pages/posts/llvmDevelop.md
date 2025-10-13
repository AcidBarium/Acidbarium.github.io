---
title: LLVM-Pass发展随笔
date: 2025-06-24
updated: 2025-10-13
categories: LLVM
tags:
  - 笔记
  - pass
---



# CoroConditionalWrapper

在 LLVM 19 中，`CoroConditionalWrapper` 被引入作为一个新的 **Module‑level Pass 包装器**，它的关键作用是——

1. **减少不必要的开销**
   并非所有模块都使用协程。此包装器先通过简单检查（是否声明有协程 Intrinsic）来决定：

   * 若无协程部分，直接跳过后续所有协程 Pass
   * 若包含协程，再按顺序执行像 `CoroEarly`、`CoroSplit`、`CoroElide`、`CoroCleanup` 的 Pass ([releases.llvm.org][1], [llvm.org][2])

2. **提高编译效率与可维护性**
   避免每次遍历都运行涉及协程分析、修改的代码，提高编译整体性能。



`CoroConditionalWrapper` 内部持有一个 `ModulePassManager PM`，流水线里注册了多个协程优化 Pass：

* **引入时间**：LLVM 19，为稳定支持 C++20 协程
* **目的**：让协程 Pass 更“懒惰”——只在必要时才执行
* **优点**：节省编译时间、提高构建效率、提升代码整洁性




------------------------------------

# HipStdPar

##  这段代码是干嘛的？

这是 LLVM 19 中新增的**HIP stdpar 支持 Pass 定义**，专门服务于 C++ `std::execution::par` 并行算法映射到 AMD GPU 的 **标准并行性实现（stdpar runtime on HIP backend）**。

>  **作用概括**：

* **HipStdParAcceleratorCodeSelectionPass**
  → 剪裁模块，只保留从 GPU kernel 可达的函数，删除其他无用代码（device 代码空间宝贵）

* **HipStdParAllocationInterpositionPass**
  → 将 `malloc` / `free` / `operator new` 这些分配调用替换成 GPU runtime 提供的版本，保证 device kernel 运行时分配的内存是 GPU 端合法、可用的。


## 为什么 LLVM 13 没有，LLVM 19 才有？

### 原因：

**LLVM 13（2021 年）并不支持 C++20 `std::execution::par` 并行算法在 GPU（尤其是 AMD HIP）上的 offloading。**

而**LLVM 18/19 才正式引入完整的 `stdpar` 支持**：

* C++ `std::execution::par`/`par_unseq` 算法通过 **offload 到 GPU kernel**
* LLVM 19 在 HIP backend 上做了这一套 stdpar device offloading 支持，称为 **HIP stdpar runtime**。

>  这个功能实现过程中，需要：

1. 剪枝优化（AcceleratorCodeSelection）
2. 内存分配替换（AllocationInterposition）

→ 就是你看到的这两个 Pass。

---

## 📜 背景演化时间线：

| LLVM 版本   | 状态                                                                         |
| :---------- | :--------------------------------------------------------------------------- |
| LLVM 13     | 没有 stdpar offload 支持，C++ 并行算法执行仍然是纯 CPU 并行                  |
| LLVM 15     | 初步在 NVIDIA CUDA 下探索 stdpar runtime prototype                           |
| LLVM 17     | stdpar runtime 基础设施逐渐向 HIP 和 OpenMP port                             |
| **LLVM 19** | 正式在 HIP backend 实现稳定版 stdpar runtime offloading，加入这两个专门 Pass |

---

##  它们解决的问题：

### ▶ 加速代码裁剪（AcceleratorCodeSelection）

GPU 端 kernel 只需用到极少部分 std 算法和 helper 函数，module 中其他未用函数多余占空间、可能连带其他依赖，导致 device 代码增大。
→ 这个 pass 自动剔除不可达函数。

####  内存分配替换（AllocationInterposition）

GPU kernel 中不能直接用 host 版 `malloc`，否则 runtime error。
→ 这个 pass 将所有 `malloc`/`free` 改写为 HIP runtime 中的 GPU 可访问内存分配函数。


\| LLVM 13 | 没有 GPU stdpar 支持，故无这类 pass |
\| LLVM 19 | 实现了 stdpar on HIP backend，需要这两个 pass 确保 offloading 正确、高效 |


在 LLVM 19 的 `/lib/llvm-19/include/llvm/Transforms/IPO` 目录下，存在多个与 Interprocedural Optimization（IPO，跨过程优化）相关的 Pass 文件。这些 Pass 主要用于模块级别的优化，涉及函数、全局变量、调用约定等方面。以下是对您提到的三个头文件的详细说明：




--------------
# IPO
这些 Pass 可以在 LLVM 的优化阶段被调用，处理跨函数的分析与变换

# EmbedBitcodePass

**功能概述：** 该 Pass 会克隆当前模块，并在克隆上运行指定的 Pass 管道。优化后的模块会被存储到 `.llvm.lto` 节中的全局变量中。主要用于支持 FatLTO（Fat Link Time Optimization）管道，但也可用于在不改变当前模块的情况下，为任何任意的 Pass 管道生成 Bitcode 节。 ([llvm.org][1])

**用途：** 将优化后的模块嵌入到当前模块中，通常用于链接时优化（LTO）过程中，以便在链接阶段进行进一步的优化。



#  ExpandVariadics

**功能概述：** 该 Pass 用于展开变参函数（variadic functions）。通过将变参函数转换为固定参数的函数，可以使其更容易进行优化。

**枚举类型 `ExpandVariadicsMode`：**

* `Unspecified`：使用实现默认值。
* `Disable`：完全禁用此 Pass。
* `Optimize`：在不改变 ABI 的情况下进行优化。
* `Lowering`：改变变参调用约定。&#x20;

**用途：** 优化变参函数的调用约定，使其更适合目标平台的优化工具（如 GlobalISel）。


# ExtractGV

**功能概述：** 该 Pass 用于从模块中提取指定的全局变量（Global Values）。

**构造函数参数：**

* `GVs`：要提取的全局变量列表。
* `deleteS`：如果为 `true`，则删除指定的全局变量；否则，尽可能删除模块中的其他内容，保留指定的全局变量。
* `keepConstInit`：如果为 `true`，则保留常量初始化。 ([llvm.org][3])

**用途：** 将指定的全局变量从模块中提取出来，通常用于生成独立的模块或进行模块拆分。



# FunctionSpecialization

该 Pass 实现了函数特化（Function Specialization）优化。它通过将函数调用中的常量参数传播到被调用函数，从而生成特化版本的函数。此过程是跨过程稀疏条件常量传播（IPSCCP）的一部分。该 Pass 支持多次迭代，以处理递归函数和新的特化机会。



#  MemProfContextDisambiguation


该传递用于内存分配的上下文消歧（Context Disambiguation）。MemProfContextDisambiguation 传递的作用是根据内存分配的上下文信息（如热/冷分配）来优化堆内存的使用。它利用 memprof 元数据来区分不同的内存分配上下文，从而进行更精细的优化。

功能：根据内存分配的上下文信息优化堆内存的使用。
应用：用于配置文件引导的堆优化。



# ModuleInliner

`ModuleInlinerPass` 是 LLVM 新的 Pass 管理器中的一个模块级函数内联优化 Pass。它将内联工具和内联成本分析结合成一个模块级的 Pass，旨在对整个模块中的函数调用进行分析，并在合适的情况下执行内联操作，以提高程序性能。


模块级分析：与 SCC（强连通分量）内联器不同，ModuleInlinerPass 会考虑整个模块中每个函数的每个调用，进行全局内联决策。

启用更多启发式分析：可以在模块级别评估更多的启发式策略，例如 PriorityInlineOrder，以优化内联顺序。

可调节的成本模型：通过参数配置，用户可以控制使用的成本模型和内联决策中的权衡策略。









----------------



# FlattenCFG


FlattenCFG 是 LLVM 中的一个 Control‑Flow Flattening（控制流扁平化） 工具函数，位于 Transforms/Utils/Local.h，用于简化和合并函数中的控制流图（CFG）。它会尝试将 if 结构中的分支并联成单个分支块，并将多个 if 段之间的相似代码合并，从而降低控制流复杂度




# InferAlignment


InferAlignmentPass 是 LLVM 中一个 Scalar IR 级优化通用通道，其目的是根据已知指针底层对象对齐信息（已知最低有效零位数，即 "trailing zero known bits"），推断更大的对齐值，并把它添加到内存操作（load/store、memcpy 等）的 alignment 属性中，以便后端利用对齐提升代码质量和性能

推断对齐可以让后端生成更有效指令：如果确定某个内存访问是 16 字节对齐的，就可使用更高效的aligned 指令序列。

减轻 InstCombine 的压力：先前 InstCombine 已具备部分对齐推断能力，但每次 run 会重复检查对象。此 pass 将其提取出来单独运行，大大减少冗余，提升效率

在 IR 优化流水线上适时运行，确保对齐信息稳定后传递给最终代码生成阶段 。


# PlaceSafepoints

PlaceSafepointsPass 是 LLVM 在 IR 级别用于 插入垃圾回收 (GC) safepoint（安全点） 的 Scalar 优化 Pass，它并不负责实际重写变量或栈帧，而只是 在函数中插入检查点。


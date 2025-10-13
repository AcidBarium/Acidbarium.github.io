---
title: LowerGlobalDtors移植
date: 2025-07-04
updated: 2025-10-13
categories: LLVM
tags:
  - 笔记
  - pass
---



和之前的思路一样，不过学长这次是通过make来编译的，非常顺利，成功移植了LowerGlobalDtors

如下图

![alt text](https://acidbarium.github.io/img/LowerGlobalDtors/image.png)

![alt text](https://acidbarium.github.io/img/LowerGlobalDtors/image-1.png)


<!-- more -->

# 测试 



<details>

<summary>测试脚本</summary>
    

```bash
#!/bin/bash

# 配置路径变量
CSMITH_PATH="/home/oscar/acidbarium/D/cpp/csmith/csmith/build/src/csmith"
LLVM_CLANG_PATH1="/home/oscar/leitaisai/llvm13.0.0-sw1.0.3/build/bin/clang"
OPT_BIN_PATH1="/home/oscar/leitaisai/llvm13.0.0-sw1.0.3/build/bin/opt"
# OPT_PASS_LIB_PATH="/home/oscar/acidbarium/llvm13.0.0-sw1.0.3/build/lib/EmbedBitcodePass.so"
OPT_PASS_LIB_PATH="/home/oscar/acidbarium/llvm13.0.0-sw1.0.3/build2/lib/LowerGlobalDtors.so"
OUTPUT_DIR="./output"

# 清理并创建输出目录
echo "Cleaning up and creating output directory..."
rm -rf $OUTPUT_DIR
mkdir -p $OUTPUT_DIR

# 步骤1: 使用Csmith生成随机C程序
echo "Generating random C program using Csmith..."
$CSMITH_PATH -o test.c
echo "C program saved as test.c"

# 步骤2: 使用clang将C程序编译成LLVM IR
echo "Compiling test.c to LLVM IR (test1.ll) using clang..."
$LLVM_CLANG_PATH1 -O0 -emit-llvm -S test.c -o test1.ll
echo "LLVM IR saved as test1.ll"

# 步骤3: 使用opt进行Pass处理（embed-bitcode-thinlto）
echo "Running LLVM pass (lower global dtors)..."
$OPT_BIN_PATH1 -load $OPT_PASS_LIB_PATH -lower-global-dtors  -enable-new-pm=0 -S test1.ll -o $OUTPUT_DIR/output1.ll
echo "Pass output saved as $OUTPUT_DIR/output1.ll"

# 步骤4: 将处理后的LLVM IR编译成可执行文件
echo "Compiling output1.ll to executable (output1)..."
$LLVM_CLANG_PATH1 -O0 $OUTPUT_DIR/output1.ll -o $OUTPUT_DIR/output1
echo "Executable output1 created"

# 步骤5: 使用GCC编译原始C程序
echo "Compiling test.c with GCC..."
gcc test.c -o $OUTPUT_DIR/gccout
echo "GCC executable created as $OUTPUT_DIR/gccout"

# 步骤6: 运行并捕获输出结果
echo "Running executables and capturing outputs..."

echo "Running GCC executable..."
$OUTPUT_DIR/gccout > $OUTPUT_DIR/gccresult.txt

echo "Running output1..."
$OUTPUT_DIR/output1 > $OUTPUT_DIR/result1.txt

# 步骤7: 比较输出结果
echo "Comparing the outputs..."
diff $OUTPUT_DIR/result1.txt $OUTPUT_DIR/gccresult.txt
DIFF_RESULT1=$?

# 输出比较结果
if [ $DIFF_RESULT1 -ne 0 ]; then
    echo "ERROR: The outputs are different!"
else
    echo "SUCCESS: All outputs are identical."
fi

# 脚本结束
echo "Script completed successfully."

```



</details>



![alt text](https://acidbarium.github.io/img/LowerGlobalDtors/image-2.png)

### 出于好奇看了一下原输出的ir文件和LowerGlobalDtors处理后的ir文件

显示，LowerGlobalDtors 处理后的 IR 文件与原始文件差异极小：diff文件如下
```
1c1
< ; ModuleID = 'test.c'
---
> ; ModuleID = 'test1.ll'

```


为排除处理不当的可能性，我们使用 loopunroll 进行了对照测试，确认了处理结果的可靠性。


<details> 
    <summary>loopunrollDIFF</summary>


```
1c1
< ; ModuleID = 'test.c'
---
> ; ModuleID = 'test1.ll'
1377c1377
<   br i1 %459, label %460, label %585
---
>   br i1 %459, label %460, label %.loopexit2
1543c1543,1546
< 585:                                              ; preds = %579, %456
---
> .loopexit2:                                       ; preds = %456
>   br label %585
> 
> 585:                                              ; preds = %.loopexit2, %579
1715c1718
<   br i1 %705, label %706, label %794
---
>   br i1 %705, label %706, label %.loopexit1
1865c1868,1871
< 794:                                              ; preds = %789, %703
---
> .loopexit1:                                       ; preds = %703
>   br label %794
> 
> 794:                                              ; preds = %.loopexit1, %789
1873c1879
<   br i1 %798, label %799, label %1059
---
>   br i1 %798, label %799, label %.loopexit
1934c1940
< 823:                                              ; preds = %844, %822
---
> 823:                                              ; preds = %822
1971c1977
<   br label %823, !llvm.loop !29
---
>   unreachable
2232c2238
<   br label %1017, !llvm.loop !30
---
>   br label %1017, !llvm.loop !29
2241c2247
<   br label %1013, !llvm.loop !31
---
>   br label %1013, !llvm.loop !30
2250c2256
<   br label %1009, !llvm.loop !32
---
>   br label %1009, !llvm.loop !31
2277c2283,2286
<   br label %795, !llvm.loop !33
---
>   br label %795, !llvm.loop !32
> 
> .loopexit:                                        ; preds = %795
>   br label %1059
2279c2288
< 1059:                                             ; preds = %860, %795
---
> 1059:                                             ; preds = %.loopexit, %860
2288c2297
<   br label %694, !llvm.loop !34
---
>   br label %694, !llvm.loop !33
2299c2308
<   br label %372, !llvm.loop !35
---
>   br label %372, !llvm.loop !34
3643c3652
<   br label %206, !llvm.loop !36
---
>   br label %206, !llvm.loop !35
3665c3674
<   br label %217, !llvm.loop !37
---
>   br label %217, !llvm.loop !36
3733c3742
<   br label %250, !llvm.loop !38
---
>   br label %250, !llvm.loop !37
3766c3775
<   br label %266, !llvm.loop !39
---
>   br label %266, !llvm.loop !38
3777c3786
<   br label %261, !llvm.loop !40
---
>   br label %261, !llvm.loop !39
3929c3938
<   br label %384, !llvm.loop !41
---
>   br label %384, !llvm.loop !40
3938c3947
<   br label %380, !llvm.loop !42
---
>   br label %380, !llvm.loop !41
4482c4491
<   br label %682, !llvm.loop !43
---
>   br label %682, !llvm.loop !42
4491c4500
<   br label %678, !llvm.loop !44
---
>   br label %678, !llvm.loop !43
4994c5003
<   br label %956, !llvm.loop !45
---
>   br label %956, !llvm.loop !44
5033c5042
<   br label %950, !llvm.loop !46
---
>   br label %950, !llvm.loop !45
5103c5112
<   br label %1179, !llvm.loop !47
---
>   br label %1179, !llvm.loop !46
5149c5158
<   br label %1175, !llvm.loop !48
---
>   br label %1175, !llvm.loop !47
5318c5327
<   br label %1331, !llvm.loop !49
---
>   br label %1331, !llvm.loop !48
5865c5874
<   br label %1749, !llvm.loop !50
---
>   br label %1749, !llvm.loop !49
6069c6078
<   br label %1744, !llvm.loop !51
---
>   br label %1744, !llvm.loop !50
6090c6099
<   br label %1342, !llvm.loop !52
---
>   br label %1342, !llvm.loop !51
6123c6132
<   br label %1945, !llvm.loop !53
---
>   br label %1945, !llvm.loop !52
6168c6177
<   br label %1958, !llvm.loop !54
---
>   br label %1958, !llvm.loop !53
6238c6247
<   br label %1984, !llvm.loop !55
---
>   br label %1984, !llvm.loop !54
6247c6256
<   br label %1940, !llvm.loop !56
---
>   br label %1940, !llvm.loop !55
6287c6296
<   br label %2038, !llvm.loop !57
---
>   br label %2038, !llvm.loop !56
6298c6307
<   br label %2030, !llvm.loop !58
---
>   br label %2030, !llvm.loop !57
6309c6318
<   br label %1306, !llvm.loop !59
---
>   br label %1306, !llvm.loop !58
6318c6327
<   br label %243, !llvm.loop !60
---
>   br label %243, !llvm.loop !59
6479c6488
<   br label %109, !llvm.loop !61
---
>   br label %109, !llvm.loop !60
6488c6497
<   br i1 %122, label %123, label %143
---
>   br i1 %122, label %123, label %.loopexit3
6510c6519
<   br label %124, !llvm.loop !62
---
>   br label %124, !llvm.loop !61
6528c6537,6540
<   br label %120, !llvm.loop !63
---
>   br label %120, !llvm.loop !62
> 
> .loopexit3:                                       ; preds = %120
>   br label %143
6530c6542
< 143:                                              ; preds = %138, %120
---
> 143:                                              ; preds = %.loopexit3, %138
6751c6763
<   br i1 %308, label %309, label %446
---
>   br i1 %308, label %309, label %.loopexit2
6776c6788
<   br label %311, !llvm.loop !64
---
>   br label %311, !llvm.loop !63
6798c6810
<   br label %322, !llvm.loop !65
---
>   br label %322, !llvm.loop !64
6820c6832
<   br label %333, !llvm.loop !66
---
>   br label %333, !llvm.loop !65
6826c6838
< 344:                                              ; preds = %362, %343
---
> 344:                                              ; preds = %343
6851c6863
<   br label %349, !llvm.loop !67
---
>   br label %349, !llvm.loop !66
6867c6879
<   br label %344, !llvm.loop !68
---
>   unreachable
6877c6889
<   br i1 %371, label %372, label %380
---
>   br i1 %371, label %372, label %.loopexit1
6894c6906,6909
<   br label %368, !llvm.loop !69
---
>   br label %368, !llvm.loop !67
> 
> .loopexit1:                                       ; preds = %368
>   br label %380
6896c6911
< 380:                                              ; preds = %375, %368
---
> 380:                                              ; preds = %.loopexit1, %375
6977c6992,6995
<   br label %306, !llvm.loop !70
---
>   br label %306, !llvm.loop !68
> 
> .loopexit2:                                       ; preds = %306
>   br label %446
6979c6997
< 446:                                              ; preds = %384, %306
---
> 446:                                              ; preds = %.loopexit2, %384
7048c7066
<   br label %486, !llvm.loop !71
---
>   br label %486, !llvm.loop !69
7147c7165
<   br label %481, !llvm.loop !72
---
>   br label %481, !llvm.loop !70
7156c7174
<   br label %302, !llvm.loop !73
---
>   br label %302, !llvm.loop !71
7206c7224
<   br label %588, !llvm.loop !74
---
>   br label %588, !llvm.loop !72
7519c7537
<   br label %834, !llvm.loop !75
---
>   br label %834, !llvm.loop !73
7544c7562
<   br i1 %856, label %857, label %1058
---
>   br i1 %856, label %857, label %.loopexit
7584c7602
<   br label %866, !llvm.loop !76
---
>   br label %866, !llvm.loop !74
7606c7624
<   br label %877, !llvm.loop !77
---
>   br label %877, !llvm.loop !75
7800c7818
<   br label %862, !llvm.loop !78
---
>   br label %862, !llvm.loop !76
7809c7827,7830
<   br label %854, !llvm.loop !79
---
>   br label %854, !llvm.loop !77
> 
> .loopexit:                                        ; preds = %854
>   br label %1058
7811c7832
< 1058:                                             ; preds = %860, %854
---
> 1058:                                             ; preds = %.loopexit, %860
7823c7844
<   br label %849, !llvm.loop !80
---
>   br label %849, !llvm.loop !78
7834c7855
<   br label %581, !llvm.loop !81
---
>   br label %581, !llvm.loop !79
7875c7896
<   br label %1077, !llvm.loop !82
---
>   br label %1077, !llvm.loop !80
7881c7902
< 1088:                                             ; preds = %1094, %1087
---
> 1088:                                             ; preds = %1087
7896c7917
<   br label %1088, !llvm.loop !83
---
>   unreachable
7910c7931
<   br label %1073, !llvm.loop !84
---
>   br label %1073, !llvm.loop !81
8631c8652
<   br label %398, !llvm.loop !85
---
>   br label %398, !llvm.loop !82
8659c8680
<   br label %388, !llvm.loop !86
---
>   br label %388, !llvm.loop !83
8980c9001
<   br label %517, !llvm.loop !87
---
>   br label %517, !llvm.loop !84
9020c9041
<   br label %657, !llvm.loop !88
---
>   br label %657, !llvm.loop !85
9166c9187
<   br label %650, !llvm.loop !89
---
>   br label %650, !llvm.loop !86
9184c9205
< 797:                                              ; preds = %802, %796
---
> 797:                                              ; preds = %796
9199c9220
<   br label %797, !llvm.loop !90
---
>   unreachable
9332c9353
<   br label %792, !llvm.loop !91
---
>   br label %792, !llvm.loop !87
9513c9534
<   br label %1035, !llvm.loop !92
---
>   br label %1035, !llvm.loop !88
9532c9553
< 1052:                                             ; preds = %1058, %1051
---
> 1052:                                             ; preds = %1051
9547c9568
<   br label %1052, !llvm.loop !93
---
>   unreachable
9559c9580
<   br label %1048, !llvm.loop !94
---
>   br label %1048, !llvm.loop !89
9799c9820
<   br label %96, !llvm.loop !95
---
>   br label %96, !llvm.loop !90
9845c9866
<   br label %112, !llvm.loop !96
---
>   br label %112, !llvm.loop !91
9867c9888
<   br label %123, !llvm.loop !97
---
>   br label %123, !llvm.loop !92
9889c9910
<   br label %134, !llvm.loop !98
---
>   br label %134, !llvm.loop !93
9898c9919
<   br label %107, !llvm.loop !99
---
>   br label %107, !llvm.loop !94
11368,11372d11388
< !95 = distinct !{!95, !4}
< !96 = distinct !{!96, !4}
< !97 = distinct !{!97, !4}
< !98 = distinct !{!98, !4}
< !99 = distinct !{!99, !4}

```


</details>




---------





查看了EmbedBitcodePass.so的处理结果，至少会多一个

![alt text](https://acidbarium.github.io/img/LowerGlobalDtors/153b5337c12add8d938496c040ae1f3.png)

```
@llvm.embedded.module = private constant [39748 x i8] c"BC\C0\DE5\14\00\00\05\00\00\00b\0C0$JY\BEf}\FB\B4O\0BQ\80L\01\00\00\00!\0C\00\00\92\1E\00\00\0B\02!\00\02\00\00\00\16\00\00\00\07\81#\91A\C8\04I\06\1029\92\01\84\0C%\05\08\19\1E\04\8Bb\80 E\02B\92\0BB\04\112\148\08\18K\0A2\82\88Hp\C4!#D\12\87\8C\10A\92\02d\C8\08\B1\14 CF\88 \C9\012\82\84\18*(*\901|\B0\\\91 \C8\C8\00\00\00\89 \00\00\8B\00\00\002\22\08\0A bF\00!+$\98 !%$\98 \19'\0C\85\A4\90`\82d\\ $h\82`=\E6\08\10\15\00\A0\00=\00\A0\01u\00\A0\829\020\A0\03%\00\A0\04\0D8\D0\82\05\15`\A0\06m\00\A0\07\B5\00\A0\08E8\A0\09\158\A0\0AE\00\A0\0B-\00\A0\8C9\02P\A0\8D9\02\88:\D4\00\80>4\A1C\0DB\94@\84F\F4\01\80J4\01\80N\94\E0\84R\94\01\80VT\02\80Z\08@\0F6\14\01\86bT\A1B\13f\88\86\16t`\83nT`C\15rHG\15\00\88G\09\0E\D4\C0G\0D~\08H!\00HH\0B\0E\B4\80H\09\8A\C8\88\88t\80H\0B\92HI\05&T\81\89\9A\14P\E0\80\9E\94\00F\13\A2HJ\07\0E\94\80\8A\AA\10\A1\1A\C4i|\97N\C1\06]\11\16e\11\8C\0Ap(\02\17u\11\07}\11\18\85)\81\18\8D\A9\80\98\1A\94)\82\19\9D\11\02\A5\91\1A\22T\838\8D\EF\D6)\E8 6-h#7-\E8P\058-\88#9-\18P\02:\AA\D3\03,M\B8#\BC#\00\00\90\1Ey\10\9F\1E\1Ch\82\1F\FD\E9@\05\05\AA\C0\8B*\0C\12!\F5\A9@\87\12\1C*\01\22%*\82!-\AA\C2\045\92\1F\AD\E9\00\80&Dj\82$M\1E\A1\E3\83*\95\04\80.\E9\C5\0C\07\07\99\A4i\86\83\97\17\E2\1C\010\81'}\9A`\83B\0D\E1\B9\F1r@\A3V8x\A1R3x\1E\1C\D0\E9\1CA`\0A\CF\97\97\8DTR5\85\E7\0B\C0F*\B1\9A\A1\A3\A3\83\\\CD\B0\B1\B1A\B0f\00\00\00 Y3\00\00\1C\10\AD\1966\0E\C8\D6\0C\07\07\07\84k\86\8E\8E\03\D25\02\00\00\F1\1A\C1s\83|\8D\E0\09@\C0\03\01\949\05@\0C$B!4C9\F4C>TDI\C4DpjpE\D0Z\B0A\D2\A4EmZ\80@\D6j\90F\D8\9A@H\DAdH\DCj\80@\DEJ\90\A6\08\E0\14\AE\03k4\AE\06\95TN\83\84H\87\04\0E\00\00\00Q\18\00\00\DE\00\00\00\1BF#\F8\FF\FF\FF\FF\01p\00\09(\03 \0C\08s\90\87ph\87rh\03xx\87tp\07z(\07y\00\C2\81\1D\D8\01 \DA!\1D\DC\A1\0D\D8\A1\1C\CE!\1C\D8\A1\0D\EC\A1\1C\C6\81\1E\DEA\1E\DA\E0\1E\D2\81\1C\E8\01\1D\008\00\08wx\876\A0\07y\08\07x\80\87tp\87sh\83v\08\07z@\07\80\1E\E4\A1\1E\CA\01 \E6\81\1E\C2a\1C\D6\A1\0D\E0A\1E\DE\81\1E\CAa\1C\E8\E1\1D\E4\A1\0D\C4\A1\1E\CC\C1\1C\CAA\1E\DA`\1E\D2A\1F
```






## 分析那个LowerGlobalDtors。 C++ 全局对象析构机制

在 C++ 里，全局/静态对象在程序结束时要执行析构函数。
在 LLVM IR 中，所有全局析构函数统一记录在一个特殊的全局变量里，叫：

```llvm
@llvm.global_dtors
```

它是个数组，记录着：

* 优先级（int）
* 函数指针
* 关联参数

比如：

```llvm
@llvm.global_dtors = appending global [1 x { i32, void ()*, i8* }] [
  { i32 65535, void ()* @my_global_destructor, i8* null }
]
```


这个 pass 的作用是：

1. **把 `@llvm.global_dtors` 中登记的析构函数，转换成调用 `__cxa_atexit` 或 `atexit` 注册的析构调用**
2. 这样全局析构顺序和 C++ ABI 约定就能保持一致（比如 Itanium ABI）
3. 最后**删除 `@llvm.global_dtors` 全局符号**

换句话说：

> **把全局析构表，转成在 main 开头就注册的 atexit 调用**

###  转换前：

```llvm
@llvm.global_dtors = appending global [1 x { i32, void ()*, i8* }] [
  { i32 65535, void ()* @my_global_destructor, i8* null }
]
```

###  转换后：

在 main 或全局构造函数里加：

```llvm
call i32 @__cxa_atexit(void ()* @my_global_destructor, i8* null, i8* null)
```

然后 `@llvm.global_dtors` 就可以删掉。


* 保证 C++ ABI 兼容性，所有析构函数都通过 `__cxa_atexit` 注册，统一由 `exit()` 触发
* 减少全局符号，便于 LTO 优化
* 有些平台/ABI（特别是 Itanium ABI）就是要求这么干


## csmith的局限

csmith 是一个专门用于​​生成随机 C 程序​​的工具，主要用于测试编译器、静态分析工具或其他处理 C 代码的软件。它的核心功能确实是围绕 ​​C 语言​​的代码生成设计的，并不支持其他语言（如 C++、Java、Python 等）。


## 查了一下生成cpp的库 YARPGen

配置YARPGen环境

```bash
git clone https://github.com/intel/yarpgen.git
cd yarpgen
mkdir build
cd build
cmake ..

/home/acidcopper/D/vscode/YARPgen/yarpgen/build/yarpgen --std=c++ -o ./ --seed=1234
```



生成的代码如下

```cpp
#include <stdio.h>

unsigned long long int seed = 0;
void hash(unsigned long long int *seed, unsigned long long int const v) {
    *seed ^= v + 0x9e3779b9 + ((*seed)<<6) + ((*seed)>>2);
}

signed char var_0 = (signed char)25;
unsigned short var_4 = (unsigned short)49134;
short var_5 = (short)28753;
unsigned int var_7 = 1311085077U;
bool var_9 = (bool)1;
unsigned char var_10 = (unsigned char)8;
signed char var_11 = (signed char)-51;
int zero = 0;
bool var_12 = (bool)1;
unsigned int var_13 = 4293012692U;
bool var_14 = (bool)1;
void init() {
}

void checksum() {
    hash(&seed, var_12);
    hash(&seed, var_13);
    hash(&seed, var_14);
}
void test(signed char var_0, unsigned short var_4, short var_5, unsigned int var_7, bool var_9, unsigned char var_10, signed char var_11, int zero);

int main() {
    init();
    test(var_0, var_4, var_5, var_7, var_9, var_10, var_11, zero);
    checksum();
    printf("%llu\n", seed);
}

/*
yarpgen version 2.0 (build 7dfc181 on 2025:07:04)
Seed: 1238
Invocation: /home/acidcopper/D/vscode/YARPgen/yarpgen/build/yarpgen --std=c++ -o ./ --seed=1238
*/
#include "init.h"
#include <algorithm>
void test(signed char var_0, unsigned short var_4, short var_5, unsigned int var_7, bool var_9, unsigned char var_10, signed char var_11, int zero) {
    var_12 = ((/* implicit */bool) ((((/* implicit */unsigned int) ((((/* implicit */bool) var_5)) ? ((+(((/* implicit */int) var_10)))) : (((/* implicit */int) var_11))))) ^ (((((/* implicit */bool) ((((/* implicit */int) (unsigned char)151)) << (((((/* implicit */int) var_0)) - (21)))))) ? (((((/* implicit */bool) 4039680508U)) ? (((/* implicit */unsigned int) ((/* implicit */int) var_9))) : (var_7))) : (((/* implicit */unsigned int) ((/* implicit */int) var_5)))))));
    var_13 = ((/* implicit */unsigned int) var_11);
    var_14 = (((((~(8727954971826667160ULL))) | (((/* implicit */unsigned long long int) ((/* implicit */int) ((((/* implicit */int) var_10)) <= (((/* implicit */int) var_10)))))))) <= (((/* implicit */unsigned long long int) ((/* implicit */int) var_4))));
}


```

生成的测试代码虽然包含 C++ 语法元素，但仍缺乏全局析构函数等关键特性，无法充分验证 LowerGlobalDtors 功能。

## 后续工作计划
​​寻找更合适的测试工具​​：探索其他能够生成复杂 C++ 特性的代码生成工具
​​手动编写测试用例​​：针对全局析构函数场景设计专门的测试代码
​​深入验证功能实现​​：通过更全面的测试用例验证 LowerGlobalDtors 在各种场景下的正确性
​​性能影响评估​​：分析该优化对程序性能的实际影响

## 结论
LowerGlobalDtors 功能已在申威平台成功实现，初步测试验证了基本功能的正确性。后续需要通过更完善的测试用例进一步验证其完整性和稳定性。
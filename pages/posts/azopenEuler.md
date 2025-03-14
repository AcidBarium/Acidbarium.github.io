---
title: "在 VMware 上安装 openEuler 的完整指南 "
date: 2025-03-08 22:42:43
updated: 2025-03-08 22:42:43
tags:
  - linux
  - 环境配置
categories:
  - 教程
aplayer: true
---


# 在 VMware 上安装 openEuler 的完整指南  

本文记录了在 VMware 虚拟机中安装 openEuler 的详细步骤，方便大家快速上手。 

<!-- more -->

我的电脑配置和VMware版本如下：

![alt text](https://acidbarium.github.io/openEulerImg/bb1.png)

![alt text](https://acidbarium.github.io/openEulerImg/bb2.png)

---

## 下载 openEuler  

### 1.访问下载网站

访问 [Academic Computer Club](https://mirror.accum.se/mirror/openeuler.org/openEuler-22.03-LTS-SP1/ISO/x86_64/)，下载 openEuler 22.03 LTS-SP1 ISO 文件，如下图所示：  

   ![下载界面](https://acidbarium.github.io/openEulerImg/az1.png)  

### 2.选择合适的版本下载 

由于镜像站速度较快，下载过程十分流畅 (╹ڡ╹ )。  

   ![下载速度](https://acidbarium.github.io/openEulerImg/az3.png)  

---

## 在 VMware 中安装 openEuler  

### 1. 创建虚拟机  

1. 下载完成后，打开 VMware（如果尚未安装，可参考 [如何安装 VMware](https://blog.csdn.net/weixin_74195551/article/details/127288338)）。  
2. 点击 **新建虚拟机**，进入创建向导。  

   ![新建虚拟机](https://acidbarium.github.io/openEulerImg/az4.png)  

3. 选择 **典型（推荐）** 模式。  

   ![选择典型模式](https://acidbarium.github.io/openEulerImg/az5.png)  

4. 选择 **稍后安装操作系统**，然后点击 **下一步**。  

   ![稍后安装](https://acidbarium.github.io/openEulerImg/az6.png)  

5. 选择 **Linux** 作为操作系统类型，并指定 **Linux 5.x 内核 64 位**。  

   ![选择 Linux](https://acidbarium.github.io/openEulerImg/az7.png)  

6. 设置虚拟机名称，并选择合适的存储位置。  

   ![命名虚拟机](https://acidbarium.github.io/openEulerImg/az8.png)  

### 2. 设置虚拟机

1. 为虚拟机分配 **32GB** 磁盘空间，并选择 **将磁盘存储为单个文件** 以提高性能。  

   ![磁盘分配](https://acidbarium.github.io/openEulerImg/az9.png)  

2. 进入 **自定义硬件** 选项。  

   ![自定义硬件](https://acidbarium.github.io/openEulerImg/az10.png)  

3. 在 **新 CD/DVD（IDE）** 选项中，选择刚刚下载的 openEuler ISO 镜像（文件名应为 `openEuler-22.03-LTS-SP1-x86_64-dvd`）。  
   
   **⚠ 注意**：截图中截错了，截成 Ubuntu 了，正确的选择应是 openEuler。（当然我觉得ubuntu也很好

   ![选择 ISO 文件](https://acidbarium.github.io/openEulerImg/az11.png)  

4. 分配 **2GB 内存** 以确保流畅运行。  

    ![分配内存](https://acidbarium.github.io/openEulerImg/az12.png)  

5. 设置 **2 个 CPU 内核**，然后点击 **完成**。  

    ![分配 CPU](https://acidbarium.github.io/openEulerImg/az13.png)  

---

## 启动 openEuler 并完成安装  

### 1. 配置openEuler

1. 选择刚刚创建的虚拟机，并点击 **开启**。  

   ![启动虚拟机](https://acidbarium.github.io/openEulerImg/kj1.png)  

2. 在启动菜单中选择 **Install openEuler 22.03-LTS-SP1** 进行安装。  

   ![选择安装选项](https://acidbarium.github.io/openEulerImg/kj2.png)  

3. 选择 **中文** 作为安装语言，便于操作。  

   ![选择语言](https://acidbarium.github.io/openEulerImg/kj3.png)  

4. 确认安装目标磁盘，直接点击 **完成**。  

   ![安装磁盘](https://acidbarium.github.io/openEulerImg/kj4.png)  

5. **启用以太网**，确保网络连接正常。  

   ![启用网络](https://acidbarium.github.io/openEulerImg/kj5.png)  

### 2. 设置虚拟机用户

1. **设置 root 用户密码**（请记住您的密码，安装完成后需要用到）。  

   ![设置 root 密码](https://acidbarium.github.io/openEulerImg/kj6.png)  

2. **创建一个新用户**（例如 `Acidbarium`），作为日常操作账号。  

   ![创建用户](https://acidbarium.github.io/openEulerImg/kj7.png)  

3. 安装完成后，**重启系统**，进入 openEuler。  

   ![完成安装](https://acidbarium.github.io/openEulerImg/kj8.png)  

---

## 测试 openEuler  

### 1. 查看 IP 地址  

使用以下命令检查虚拟机的 IP 地址（IPv4）：  

```bash
ip addr
```  

执行后，你应该能看到如下输出：  

   ![查看 IP 地址](https://acidbarium.github.io/openEulerImg/cs1.png)  

### 2. 连接虚拟机  

在 **FinalShell**（或其他 SSH 客户端）中添加刚创建的 openEuler 虚拟机，并连接到它。  

   ![连接虚拟机](https://acidbarium.github.io/openEulerImg/cs2.png)  

### 3. 编写 C++ 测试程序  

使用 `vi` 创建一个名为 `ciallo.cpp` 的 C++ 文件：  

```bash
vi ciallo.cpp
```  

然后输入以下 C++ 代码：  

```cpp
#include <bits/stdc++.h>
using namespace std;

int main()
{
    cout << "ciallo world!" << endl;
    return 0;
}
```  

   ![编辑 C++ 代码](https://acidbarium.github.io/openEulerImg/cs4.png)  

### 4. 安装 C++ 编译环境  

使用 `yum` 安装 `gcc` 和 `g++`：  

```bash
yum install gcc gcc-c++
```  

   ![安装编译环境](https://acidbarium.github.io/openEulerImg/cs5.png)  

### 5. 编译 C++ 文件  

```bash
g++ ciallo.cpp -o ciallo
```  

   ![编译 C++ 代码](https://acidbarium.github.io/openEulerImg/cs6.png)  

### 6. 运行编译后的程序  

```bash
./ciallo
```  

如果输出如下，说明 openEuler 运行正常：  

   ![运行 C++ 程序](https://acidbarium.github.io/openEulerImg/cs7.png)  

---

## 结论  

至此，我们已成功在 VMware 中安装 openEuler，并完成了基本的系统配置和 C++ 运行测试。如果你在安装过程中遇到任何问题，欢迎交流探讨！
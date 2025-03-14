---
title: L2-002 链表去重
date: 2024-04-11
updated: 2024-04-11
categories: 题解
tags:
  - 算法
  - 笔记
---

# <center>L2-002 链表去重</center>
<center>代码长度限制：16 KB</center>
<center>时间限制：400 ms </center>
<center>内存限制：64 MB</center>

## 题目描述
给定一个带整数键值的链表 **L**，你需要把其中绝对值重复的键值结点删掉。即对每个键值 **K**，只有第一个绝对值等于 **K** 的结点被保留。同时，所有被删除的结点须被保存在另一个链表上。例如给定 **L** 为 21→-15→-15→-7→15，你需要输出去重后的链表 21→-15→-7，还有被删除的链表 -15→15。

<!-- more -->

## 输入格式
输入在第一行给出 **L** 的第一个结点的地址和一个正整数 **N**（≤1e5，为结点总数）。一个结点的**地址是非负的 5 位整数**，空地址 **NULL** 用 **−1** 来表示。

随后 N 行，每行按以下格式描述一个结点：
>地址 键值 下一个结点
>
其中`地址`是该结点的地址，`键值`是绝对值不超过10^4^的整数，下一个结点是下个结点的地址。

##输出格式
首先输出去重后的链表，然后输出被删除的链表。每个结点占一行，按输入的格式输出。

##输入样例：
>00100 5
99999 -7 87654
23854 -15 00000
87654 15 -1
00000 -15 99999
00100 21 23854
>

## 输出样例
>00100 21 23854
23854 -15 99999
99999 -7 -1
00000 -15 87654
87654 15 -1
>
## 笔者观点
* **做之前**：这道题看着还是相当简单的，感觉拿stl就可以把它给秒了
* **做之后**：坏了！有坑！

## 具体思路

首先读入，用地址找键值，用一个map来存太合适不过了。然后建立两个链表，一个存留下的，一个存删除的，把map里面的东西过一遍，这题基本上就过了。估计一下复杂度map有一个log,同时我使用了一个set来判断是否元素是否存重复，也是一个log。所以复杂度为O(nlog）。~~（笔者看着64M的内存限制收敛不住嘴角，于是开了很多容器，把一道简单的题的内存和时间基本都吃满了）~~
同时这个题有一个比较坑的地方，给出的输入并不一定可以从头到尾练成一整条链，当你判断到下一个地址为**NULL**的时候，你就知道你该停下来了。（笔者因为这一点死死卡在测试点一，以泪洗面）

## 关键的地方
**node**为链表的节点的结构体，**ci**为当前地址，**ne**为下一个节点的地址。**q**是用来读入的**map**。**save**和**removee**分别为剩下的和删去的两条链表。（由于remove好像撞关键字了，所以加了一个e）
```cpp
struct node
{
    string ci;
    int v;
    string ne;
};
map<string, pair<int, string>> q;
set<int> s;
list<node> save;
list<node> removee;
int saveNumber = 0;
int removeNumber = 0;
```
这里是两条链表的建立，不断更新start来遍历，用set< int >s来判断键值是否重复出现过，如果没有出现过，则放入save链表，同时放入s；如果出现过则放入removee链表，同时每次操作要更改操作链表的最后一个成员的下一个成员的地址的值
```cpp
 for (int i = 0; i < asd; i++)
    {
        node temp;
        temp.ci = start;
        temp.v = q[start].first;
        temp.ne = q[start].second;

        if (s.count(abs(q[start].first)))  //判断是否出现过
        {
            (*removee.rbegin()).ne = temp.ci;  //改变链表最后元素的下一个地址的值
            removee.push_back(temp);      
            removeNumber++;
        }
        else
        {
            (*save.rbegin()).ne = temp.ci;  //改变链表最后元素的下一个地址的值
            s.insert(abs(q[start].first));
            save.push_back(temp);
            saveNumber++;
        }
        start = q[start].second;
        if (start == "-1")    //敲黑板，非常关键的地方，当读到-1的时候，链表就结束了，该退出了（如果你测试点一挂了，大概也是这里的锅）
            break;
    }
```
链表的输出，以removee链表为例，save链表的输出和它是一样的。注意最后一个成员的输出。
```cpp
cnt = 0;
    for (auto it = removee.begin(); it != removee.end(); it++)
    {
        cnt++;
        if (cnt >= removeNumber)
            break;
        cout << (*it).ci << ' ' << (*it).v << ' ' << (*it).ne << endl;
    }
    if (removeNumber >= 1)
    {
        cout << (*removee.rbegin()).ci << ' ' << (*removee.rbegin()).v << " -1" << endl;
    }
```
## 完整代码
<details>
<summary>点击查看代码</summary>

```
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

struct node
{
    string ci;
    int v;
    string ne;
};
map<string, pair<int, string>> q;
set<int> s;
list<node> save;
list<node> removee;
int saveNumber = 0;
int removeNumber = 0;

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int asd;
    string start;
    cin >> start >> asd;
    for (int i = 0; i < asd; i++)
    {
        string here, there;
        int value;
        cin >> here >> value >> there;
        q[here].first = value;
        q[here].second = there;
    }

    for (int i = 0; i < asd; i++)
    {
        node temp;
        temp.ci = start;
        temp.v = q[start].first;
        temp.ne = q[start].second;

        if (s.count(abs(q[start].first)))
        {
            (*removee.rbegin()).ne = temp.ci;
            removee.push_back(temp);
            removeNumber++;
        }
        else
        {
            (*save.rbegin()).ne = temp.ci;
            s.insert(abs(q[start].first));
            save.push_back(temp);
            saveNumber++;
        }
        start = q[start].second;
        if (start == "-1")
            break;
    }

    int cnt = 0;
    // cout << "save" << endl;

    for (auto it = save.begin(); it != save.end(); it++)
    {
        cnt++;
        if (cnt >= saveNumber)
            break;
        cout << (*it).ci << ' ' << (*it).v << ' ' << (*it).ne << endl;
    }
    if (saveNumber >= 1)
    {
        cout << (*save.rbegin()).ci << ' ' << (*save.rbegin()).v << " -1" << endl;
    }

    // cout << "remove" << endl;
    cnt = 0;
    for (auto it = removee.begin(); it != removee.end(); it++)
    {
        cnt++;
        if (cnt >= removeNumber)
            break;
        cout << (*it).ci << ' ' << (*it).v << ' ' << (*it).ne << endl;
    }
    if (removeNumber >= 1)
    {
        cout << (*removee.rbegin()).ci << ' ' << (*removee.rbegin()).v << " -1" << endl;
    }

    return 0;
}
```
</details>

## 结果

时间消耗并不是很乐观（350ms/400ms),空间剩余还挺多的。用的编译器是C++ (clang++)，~~最开始用的g++好像没过编译~~，而且好像有一点点不稳定？我同一份代码提交了三次，第二次竟然TLE了。总之这个解法似乎并不是很优越。

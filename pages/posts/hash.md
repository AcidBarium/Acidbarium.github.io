---
title: 哈希思想与字符串窥见
date: 2024-05-10
updated: 2024-05-10
tags:
  - 字符串
  - 算法
categories:
  - cpc
aplayer: true
---


前两天听了一个学长讲字符串，**KMP**，**Tire**，**DFA**，**AC自动机**，**马拉车**...叽里呱啦的我这个小蒟蒻也听不明白。虽然但是学长在最后清了清嗓子，敲了敲黑板，拿出了镇场子的家伙——hash算法。听完之后，满座惊呼，醍醐灌顶，恍然大悟。我也这般激动，便趁着这股劲写下这篇窥见，随便纪念这个**赔了我五块钱的学长**。

<!-- more -->

## Hash的优势
* 仅仅$O(n)$的预处理
* 仅仅$O(1)$查询某两个区间是否相同
* $O(logn)$修改 (配合数据结构使用，本文不做过多介绍，主要这个学长也没讲)

## Hash的内涵&做法
**把原空间的数据映射到一个更小的空间。**
本文主要介绍hash在字符串领域的小部分的应用，主要的做法是把任意的一个字符串映射到一个整数，举例子来说就是：
* a  ->  97
* xy  ->  15841
* abc -> 1677554
* cba -> 1711874
这样之后，当我想知道某两个字符串一样的时候，我们只需要知道它们对应的值是否一样就可以了。


<font color=red><font size=5>但是怎么映射呢？</font></font>


先不多说，看公式
$hash(S)=(S[1]\times b^{n-1} +S[2]\times b^{n-2} +\cdot \cdot \cdot +S[n]\times b^{0}) mod P$
虽然公式向来是每个文章里面最为具体但是抽象的东西，但是这里的公式还是很好理解的（类似于快读，但是每一位乘的是$b$，不是$10$),举一个具体的例子来说的话：
假如取$b=233，p=13331$
$hash(dyt)=(d\times 233^{2}+y\times 233^{1}+t\times 233^{0})mod 13331$
`d` `y` `t`都是字符，对应其ASCII码取值:100,121,116。简单拿计算器算一下$hash(dyt)=4830$ 。在计算的过程中，我们可以拿一个数组来记录每一位的结果，就像这样：
```cpp
for (int i = 0; i < (int)ss.size(); i++)
    {
        arr[cnt] = (arr[cnt - 1] * b + ss[i]) % 13331;
        cnt++;
    }
```
这样的好处是，我们不仅知道了一个字符串的hash值，也可以在$O(1)$下查出某个子串的hash值，就上面的例子来说$hash(yt)=(hash(dyt)-hash(d)\times233^{2})mod13331+13331)mod13331=1647$
而且显然，hash预处理的复杂度为$O(n)$，得到任意子串的复杂度为$O(1)$，对于得到的子串我们也可以$O(1)$进行比较（原字符串比较的复杂度为$O(s)$，s为字符串长度）

## 升级
那么这么做对吗？显然不对。因为它企图将一个无限的东西映射到一个简短的数字上，这显然是错误的并且荒谬的，我们完全可以找到两个不一样的字符串但是它们对应的hash值是一样的。那么这么做对吗？也对，借助这么的方法我们真的有几率得到AC，前提是数据测试点数据不够强大，当然在IOI中我们也能差不多骗的盆满钵满了。那么这么做对吗？可以对，假如你稍稍地升级一下...
据学长描述，正确的概率和你选择的$P$有关，不难注意到这个做法正确的概率为$S\over P$，其中S为字符串的长度，而一般字符串题的字符串的长度都在1000左右，最多也大概不会超过$10^{5}$,对于m个询问，这个概率可能要再加一个m次方，总而言之，经过这么多的要求之后我们得到的这个正确的概率并不是很高（一般P的选取也就是在$10^{9}$,下面会介绍为什么）。举个例子：如果P选$10^{9}+7$,字符串长度为1000，询问次数有100000次，那么这个算法得到正确答案的概率就是0.90....
这是hash算法不可避免的问题，但是我们可以想办法去优化它。怎么做呢，相信你只是看正确的概率的表达式也能看出来：把P变得更大，或者用不同的P弄出多组hash值。假如我们分别选择$10^{9}+7 和10^{9}+7$进行hash，比较字符串的时候也是同时比较两个hash值，同样是上一个例子，我们正确的概率就已经来到0.999999900。已经ok了吧...

## 取值
对于b和P的取值，这里也稍微有一些门道，本文并不会做太多详细的介绍~~（主要我也不怎么会）~~,简单说一点就是在字符串问题中b的大小要大于128，还得是个质数，我常用的是233和211。对于P的取值一般在$10^{9}$这个数量级，既可以保证我们的正确率足够高，也能保证我们在开long long的时候不会炸内存。

## 例子 查找最长对称子串
这道题很经典了，可以用马拉车算法来做，但是本文讲的是hash，所以我用hash加二分搜索来做。
**输入格式：**
输入在一行中给出长度不超过1000的非空字符串。

**输出格式：**
在一行中输出最长对称子串的长度。

原理在上文已经讲诉的很详细了，这里只贴一些关键部分吧。


将字符串中插入特殊字符，这么做可以保证二分答案的单调性
```cpp
 getline(cin, s); // 读入原字符串
    ss = '\\';       // 处理字符串
    for (int i = 0; i < (int)(s.size()); i++)
    {
        ss = ss + s[i] + '\\';
    }
```

求两个不同的hash值
```cpp
    int cnt = 1;      // 下标从1开始正hash
    leng = ss.size(); // leng为处理后的字符串的长度
    for (int i = 0; i < leng; i++)
    {
        arr1[cnt] = (arr1[cnt - 1] * pi1 + ss[i]) % mod1;
        arr2[cnt] = (arr2[cnt - 1] * pi2 + ss[i]) % mod2;
        cnt++;
    }
    cnt = leng; // 下标从leng开始的反hash
    for (int i = leng - 1; i >= 0; i--)
    {
        rearr1[cnt] = (rearr1[cnt + 1] * pi1 + ss[i]) % mod1;
        rearr2[cnt] = (rearr2[cnt + 1] * pi2 + ss[i]) % mod2;
        cnt--;
    }
```
二分答案
```cpp
 while (l <= r)
    {
        int mid = (l + r) >> 1;
        if (isok(mid * 2)) // 判断[l,l+mid*2]是否为回文串
        {
            l = mid + 1;
            ans = mid;
        }

        else
            r = mid - 1;
    }
```
判断一段字符串的正反hash值是否相同
```cpp
inline bool hashok1(int l, int r) // 第一个hash值的判断
{
    if ((arr1[r] - (arr1[l - 1] * ksm(pi1, r - l + 1, mod1)) % mod1 + mod1) % mod1 == (rearr1[l] - (rearr1[r + 1] * ksm(pi1, r - l + 1, mod1)) % mod1 + mod1) % mod1)
        return true;
    else
        return false;
}
```
本文用了快速幂来进行幂运算，但是更好的方法是用$o(1)$直接跑出所有可能用到的幂，存放到数组里面
```cpp
long long ksm(long long a, long long b, long long mode)
{
    long long sum = 1;
    a = a % mode;

    while (b > 0)
    {
        if (b % 2 == 1) 
            sum = (sum * a) % mode;
        b /= 2;
        a = (a * a) % mode; 
    }
    return sum;
}
```
## 完整答案
<details>
<summary>点击查看代码</summary>

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
ll mod1 = 1000000007, mod2 = 1000000009; // 双hash  pi1&mod1   pi2&mod2
ll pi1 = 233, pi2 = 211;
ll arr1[10004], arr2[10004]; // arr存正的，rearr存反着的
ll rearr1[10004], rearr2[10004];
string s;  // 原字符串
string ss; // 处理后的字符串
int leng;  // 处理后的字符串长度

long long ksm(long long a, long long b, long long mode)
{
    long long sum = 1;
    a = a % mode;

    while (b > 0)
    {
        if (b % 2 == 1) // 判断是否是奇数，是奇数的话将多出来的数事先乘如sum
            sum = (sum * a) % mode;
        b /= 2;
        a = (a * a) % mode; // 不断的两两合并再取模，减小a和b的规模
    }
    return sum;
}

inline bool hashok1(int l, int r) // 第一个hash值的判断
{
    /*调试用正hash和逆hash*/

    // cout << "l " << l << " r " << r << "  " << endl;
    // cout << "left  " << (arr1[r] - (arr1[l - 1] * ksm(pi1, r - l + 1, mod1)) % mod1 + mod1) % mod1 << endl;
    // cout << "right  " << (rearr1[l] - (rearr1[r + 1] * ksm(pi1, r - l + 1, mod1)) % mod1 + mod1) % mod1 << endl;

    if ((arr1[r] - (arr1[l - 1] * ksm(pi1, r - l + 1, mod1)) % mod1 + mod1) % mod1 == (rearr1[l] - (rearr1[r + 1] * ksm(pi1, r - l + 1, mod1)) % mod1 + mod1) % mod1)
        return true;
    else
        return false;
}

inline bool hashok2(int l, int r) // 第二个hash值的判断
{
    /*调试用正hash和逆hash*/
    // cout << "l " << l << " r " << r << "  " << endl;
    // cout << "left  " << (arr2[r] - (arr2[l - 1] * ksm(pi2, r - l + 1, mod2)) % mod2 + mod2) % mod2 << endl;
    // cout << "right  " << (rearr2[l] - (rearr2[r + 1] * ksm(pi2, r - l + 1, mod2)) % mod2 + mod2) % mod2 << endl;

    if ((arr2[r] - (arr2[l - 1] * ksm(pi2, r - l + 1, mod2)) % mod2 + mod2) % mod2 == (rearr2[l] - (rearr2[r + 1] * ksm(pi2, r - l + 1, mod2)) % mod2 + mod2) % mod2)
        return true;
    else
        return false;
}

inline bool isok(int x) // 判断是否存在长度为x的子串满足回文
{
    for (int i = 1; i + x <= leng; i++)
    {
        if (hashok1(i, i + x) && hashok2(i, i + x)) // 判断两个hash
            return true;
    }
    return false;
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    getline(cin, s); // 读入原字符串
    ss = '\\';       // 处理字符串
    for (int i = 0; i < (int)(s.size()); i++)
    {
        ss = ss + s[i] + '\\';
    }
    // 看看处理对没有（输出处理之后的结果）
    // cout << ss << endl;

    int cnt = 1;      // 下标从1开始正hash
    leng = ss.size(); // leng为处理后的字符串的长度
    for (int i = 0; i < leng; i++)
    {
        arr1[cnt] = (arr1[cnt - 1] * pi1 + ss[i]) % mod1;
        arr2[cnt] = (arr2[cnt - 1] * pi2 + ss[i]) % mod2;
        cnt++;
    }
    cnt = leng; // 下标从leng开始的反hash
    for (int i = leng - 1; i >= 0; i--)
    {
        rearr1[cnt] = (rearr1[cnt + 1] * pi1 + ss[i]) % mod1;
        rearr2[cnt] = (rearr2[cnt + 1] * pi2 + ss[i]) % mod2;
        cnt--;
    }

    int l = 1, r = s.size(); // 祖传的二分答案，r为原子串的长度
    int ans = (l + r) >> 1;

    while (l <= r)
    {
        int mid = (l + r) >> 1;
        if (isok(mid * 2)) // 判断[l,l+mid*2]是否为回文串
        {
            l = mid + 1;
            ans = mid;
        }

        else
            r = mid - 1;
    }

    cout << ans << endl;
    return 0;
}
```
</details>

## 总结
内存也就几百kb，时间复杂度为$o(nlog)$,不超过1000的字符串10ms以内就能跑完。

---
title: 天梯赛-练习集 -L2-001 紧急救援， 一个不是很正常的过题方法
date: 2024-04-10
updated: 2024-04-10
categories: 题解
tags:
  - 算法
  - 笔记
---




## 题目描述
作为一个城市的应急救援队伍的负责人，你有一张特殊的全国地图。在地图上显示有多个分散的城市和一些连接城市的快速道路。每个城市的救援队数量和每一条连接两个城市的快速道路长度都标在地图上。当其他城市有紧急求助电话给你的时候，你的任务是带领你的救援队尽快赶往事发地，同时，一路上召集尽可能多的救援队。

<!-- more -->

## 输入格式
输入第一行给出`4`个正整数`N`、`M`、`S`、`D`，其中**N（2≤N≤500）**是城市的个数，顺便假设城市的编号为**0 ~ (N−1)**；**M**是快速道路的条数；**S**是出发地的城市编号；**D**是目的地的城市编号。第二行给出**N**个正整数，其中第**i**个数是第**i**个城市的救援队的数目，数字间以空格分隔。随后的**M**行中，每行给出一条快速道路的信息，分别是：城市1、城市2、快速道路的长度，中间用空格分开，数字均为整数且不超过**500**。输入保证救援可行且**最优解唯一**。

## 输出格式
第一行输出最短路径的条数和能够召集的最多的救援队数量。第二行输出从**S**到**D**的路径中经过的城市编号。数字间以空格分隔，**输出结尾不能有多余空格**

## 输入样例：
>4 5 0 3
20 30 40 10
0 1 1
1 3 2
0 3 3
0 2 2
2 3 2
>

## 输出样例
>2 60
0 1 3
>

## 笔者观点
1. 显然这是一条最短路问题，而且只需求一条最短路（起点和终点已定），要求的东西也不算很多，所以这是一道dijkstra的板子题啊。（没学过dijkstra的小伙伴可以看洛谷的 [单源最短路径](https://www.luogu.com.cn/problem/P4779)）
1. 虽然这道题的时间很短，但是城市数目非常少，不到500，dijkstra在数据量很大的时候也才跑50ms，所以这道题我们的时间是挺充裕的。
1. 没有具体给出M的大小，由城市个数我们大概可以猜测M的大小并不会很小，我们需要一个很大的容器去存M（笔者最开始因为这个问题RE了QAQ）
1. 很坑的一点就是你要意识到这里给出的路径都是双向路，并不是单向的。
1. 输出结尾不能有多余的空格（~~天梯的题就是这么矫情~~）

## 具体的思路
显然这道题是有两个权重的，一个是普通的路段的长度，另一个是城市中的人数。由于需要同时求出最短路的数量和最短而且召集人数最多的路，笔者愚钝，首先想到的只是跑两边dijkstra？一遍求出最短路的条数，第二边考虑上城市人数求出最优解。结果表明这样做是可以的，并不会超时，当然你完全也可以只跑一遍就求出答案。

## 关键的地方
使用`from`来存储到达该点的最短路的条数，使用`father`来储存到达该点的最短路的上一个节点，`prize`来保存每个城市的人数，`head`,`vis`,`dis`为dijkstra的必备数组。
```cpp
const ll INF = 9223372036854775800;
ll cnt = 0;
ll n, m, s, goal;
ll head[maxn], vis[maxn], dis[maxn];
ll from[maxn];
ll prize[maxn];
ll father[maxn];
```
因为是双向的（无向）的路，所以我们每次要记录两条
```cpp
void add1(ll u, ll v, ll w)
{
    e[++cnt].u = u;    //第一次
    e[cnt].v = v;
    e[cnt].w = w;
    e[cnt].next = head[u];
    head[u] = cnt;

    e[++cnt].u = v;   //第二次
    e[cnt].v = u;
    e[cnt].w = w;
    e[cnt].next = head[v];
    head[v] = cnt;
}

```

在第二次dijkstra中我们需要同时考虑两个权重———路的长度和城市的人的数量，我们可以写一个比较函数，在路的长度不一样的时候选择路更短的那一条路，在路的长度一样的时候选择人数较多的那一条路。另外也可以用我的这种做法，将每一条路的权重设置为路的 长度x100000000-路的终点的人口的数量。这样得到的新的权重最小的便是路长度最小并且得到的人数最多的那条路。
```cpp
void add2()
{
    for (int i = 0; i <= cnt; i++)
    {
        e[i].w = e[i].w * 100000000 - prize[e[i].u];   //改变权重
    }
    for (int i = 0; i <= n; i++)
    {
        vis[i] = 0;     //初始化
    }
}
```

后面的dijkstra算法就简单很多了，这里只贴出关键部分
```cpp
for (ll i = head[u]; i; i = e[i].next)
        {
            ll v = e[i].v;
            if (dis[v] > dis[u] + e[i].w)
            {
                dis[v] = dis[u] + e[i].w;
                q.push((node){dis[v], v});
                from[v] = from[u];    //到达某点的路径数量，如果路径小，则直接赋值
                father[v] = u;    //记录父节点
            }
            else if (dis[v] == dis[u] + e[i].w)
            {
                dis[v] = dis[u] + e[i].w;
                q.push((node){dis[v], v});
                from[v] += from[u];   //到达某点的路径数量，如果路径相等，则路径数量相加
                father[v] = u;   //记录父节点
            }
        }
```

## 完整代码
<details>
<summary>点击查看代码</summary>

```
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int maxn = 1000;
const ll INF = 9223372036854775800;
ll cnt = 0;
ll n, m, s, goal;
ll head[maxn], vis[maxn], dis[maxn];
ll from[maxn];
ll prize[maxn];
ll father[maxn];

struct edge
{
    ll v, u, w, next;
} e[10000007];

struct node
{
    ll w;
    ll now;
    inline bool operator<(const node &a) const  //比较方法
    {
        return w > a.w;
    }
};
priority_queue<node> q;   //大根堆

void add1(ll u, ll v, ll w)
{
    e[++cnt].u = u;
    e[cnt].v = v;
    e[cnt].w = w;
    e[cnt].next = head[u];
    head[u] = cnt;

    e[++cnt].u = v;
    e[cnt].v = u;
    e[cnt].w = w;
    e[cnt].next = head[v];
    head[v] = cnt;
}

void add2()
{
    for (int i = 0; i <= cnt; i++)
    {
        e[i].w = e[i].w * 100000000 - prize[e[i].u];
    }
    for (int i = 0; i <= n; i++)
    {
        vis[i] = 0;
    }
}

void djtestua()
{
    for (int i = 0; i < n; i++)
    {
        father[i] = -1;
        dis[i] = INF;
        from[i] = 1;
    }
    dis[s] = 0;
    q.push((node){0, s});
    while (!q.empty())
    {
        node temp = q.top();
        ll u = temp.now;
        q.pop();
        if (vis[u])
            continue;
        vis[u] = 1;
        for (ll i = head[u]; i; i = e[i].next)
        {
            ll v = e[i].v;
            if (dis[v] > dis[u] + e[i].w)
            {
                dis[v] = dis[u] + e[i].w;
                q.push((node){dis[v], v});
                from[v] = from[u];
                father[v] = u;
            }
            else if (dis[v] == dis[u] + e[i].w)
            {
                dis[v] = dis[u] + e[i].w;
                q.push((node){dis[v], v});
                from[v] += from[u];
                father[v] = u;
            }
        }
    }
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    cin >> n >> m >> s >> goal;

    for (int i = 0; i < n; i++)
    {
        cin >> prize[i];
    }

    for (int i = 0; i < m; i++)
    {
        ll a, b, c;
        cin >> a >> b >> c;
        add1(a, b, c);
    }
    djtestua();
    // cout << "num: ";
    cout << from[goal] << " ";
    // cout << endl;
    // cout << "from " << endl;
    // for (int i = 0; i < 10; i++)
    // {
    //     cout << from[i] << ' '; 
    // }
    // cout << endl;

    add2();
    djtestua();

    // cout << "father  "  << endl;;
    // for (int i = 0; i < 10; i++)
    // {
    //     cout << father[i] << ' ';
    // }
    // cout << endl;

    ll sum = 0;
    stack<ll> sta;
    ll goaltemp = goal;

    while (goaltemp != -1)
    {
        sta.push(goaltemp);
        sum += prize[goaltemp];
        goaltemp = father[goaltemp];
    }

    // cout << "sum : ";
    cout << sum;
    cout << endl;

    //cout << "dian: " << endl;
    cout << sta.top();
    sta.pop();
    while (!sta.empty())
    {
        cout << " ";
        cout << sta.top();
        sta.pop();
    }

    return 0;
}
```
</details>

## 结果
虽然跑了两次dijkstra，但是还是在最慢48ms跑出了答案，还是可以的，这么做的好处我觉得有两个，一是比较好想，还是直接套的dijkstra的板子，只是我们把路径的权重进行的处理。二是代码比较好写，只需重写一个算权重的函数就可以直接再跑一次dijkstra了。
import{_ as c}from"./ValaxyMain.vue_vue_type_style_index_0_lang.B33wPh_m.js";import{f as o,a as g}from"./chunks/vue-router.BLK4Byhi.js";import{A as d,N as y,a3 as i,U as e,S as s,R as m,W as l,u as v,O as f}from"./framework.BOFoIXwn.js";import"./app.CNZpHuZ_.js";import"./chunks/dayjs.DRNXKsfK.js";import"./chunks/vue-i18n.DF1tl79Z.js";import"./chunks/pinia.CvQUKRCU.js";import"./chunks/@vueuse/motion.D-_3lofP.js";import"./chunks/nprogress.Y9-A6VbA.js";import"./YunComment.vue_vue_type_style_index_0_lang.Dl7DO3ne.js";import"./index.C5okkQwF.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang.DD-n1N2V.js";import"./post.YwAyf2y7.js";const F=o("/posts/sosRightNow",async p=>JSON.parse('{"title":"天梯赛-练习集 -L2-001 紧急救援， 一个不是很正常的过题方法","description":"","frontmatter":{"title":"天梯赛-练习集 -L2-001 紧急救援， 一个不是很正常的过题方法","date":"2024-04-10","updated":"2024-04-10","categories":"题解","tags":["算法","笔记"]},"headers":[{"level":2,"title":"题目描述","slug":"题目描述","link":"#题目描述","children":[]},{"level":2,"title":"输入格式","slug":"输入格式","link":"#输入格式","children":[]},{"level":2,"title":"输出格式","slug":"输出格式","link":"#输出格式","children":[]},{"level":2,"title":"输入样例：","slug":"输入样例","link":"#输入样例","children":[]},{"level":2,"title":"输出样例","slug":"输出样例","link":"#输出样例","children":[]},{"level":2,"title":"笔者观点","slug":"笔者观点","link":"#笔者观点","children":[]},{"level":2,"title":"具体的思路","slug":"具体的思路","link":"#具体的思路","children":[]},{"level":2,"title":"关键的地方","slug":"关键的地方","link":"#关键的地方","children":[]},{"level":2,"title":"完整代码","slug":"完整代码","link":"#完整代码","children":[]},{"level":2,"title":"结果","slug":"结果","link":"#结果","children":[]}],"relativePath":"pages/posts/sosRightNow.md","lastUpdated":1767171975000}'),{lazy:(p,h)=>p.name===h.name}),R={__name:"sosRightNow",setup(p,{expose:h}){var E;const{data:k}=F(),r=g(),t=Object.assign(r.meta.frontmatter||{},((E=k.value)==null?void 0:E.frontmatter)||{});return r.meta.frontmatter=t,d("pageData",k.value),d("valaxy:frontmatter",t),globalThis.$frontmatter=t,h({frontmatter:{title:"天梯赛-练习集 -L2-001 紧急救援， 一个不是很正常的过题方法",date:"2024-04-10",updated:"2024-04-10",categories:"题解",tags:["算法","笔记"]}}),(a,n)=>{const u=c;return f(),y(u,{frontmatter:v(t)},{"main-content-md":i(()=>[n[0]||(n[0]=s("h2",{id:"题目描述",tabindex:"-1"},[l("题目描述 "),s("a",{class:"header-anchor",href:"#题目描述","aria-label":'Permalink to "题目描述"'},"​")],-1)),n[1]||(n[1]=s("p",null,"作为一个城市的应急救援队伍的负责人，你有一张特殊的全国地图。在地图上显示有多个分散的城市和一些连接城市的快速道路。每个城市的救援队数量和每一条连接两个城市的快速道路长度都标在地图上。当其他城市有紧急求助电话给你的时候，你的任务是带领你的救援队尽快赶往事发地，同时，一路上召集尽可能多的救援队。",-1)),m(" more "),n[2]||(n[2]=s("h2",{id:"输入格式",tabindex:"-1"},[l("输入格式 "),s("a",{class:"header-anchor",href:"#输入格式","aria-label":'Permalink to "输入格式"'},"​")],-1)),n[3]||(n[3]=s("p",null,[l("输入第一行给出"),s("code",null,"4"),l("个正整数"),s("code",null,"N"),l("、"),s("code",null,"M"),l("、"),s("code",null,"S"),l("、"),s("code",null,"D"),l("，其中"),s("strong",null,[l("N（2≤N≤500）"),s("strong",null,"是城市的个数，顺便假设城市的编号为"),l("0 ~ (N−1)")]),l("；"),s("strong",null,"M"),l("是快速道路的条数；"),s("strong",null,"S"),l("是出发地的城市编号；"),s("strong",null,"D"),l("是目的地的城市编号。第二行给出"),s("strong",null,"N"),l("个正整数，其中第"),s("strong",null,"i"),l("个数是第"),s("strong",null,"i"),l("个城市的救援队的数目，数字间以空格分隔。随后的"),s("strong",null,"M"),l("行中，每行给出一条快速道路的信息，分别是：城市1、城市2、快速道路的长度，中间用空格分开，数字均为整数且不超过"),s("strong",null,"500"),l("。输入保证救援可行且"),s("strong",null,"最优解唯一"),l("。")],-1)),n[4]||(n[4]=s("h2",{id:"输出格式",tabindex:"-1"},[l("输出格式 "),s("a",{class:"header-anchor",href:"#输出格式","aria-label":'Permalink to "输出格式"'},"​")],-1)),n[5]||(n[5]=s("p",null,[l("第一行输出最短路径的条数和能够召集的最多的救援队数量。第二行输出从"),s("strong",null,"S"),l("到"),s("strong",null,"D"),l("的路径中经过的城市编号。数字间以空格分隔，"),s("strong",null,"输出结尾不能有多余空格")],-1)),n[6]||(n[6]=s("h2",{id:"输入样例",tabindex:"-1"},[l("输入样例： "),s("a",{class:"header-anchor",href:"#输入样例","aria-label":'Permalink to "输入样例："'},"​")],-1)),n[7]||(n[7]=s("blockquote",null,[s("p",null,"4 5 0 3 20 30 40 10 0 1 1 1 3 2 0 3 3 0 2 2 2 3 2")],-1)),n[8]||(n[8]=s("h2",{id:"输出样例",tabindex:"-1"},[l("输出样例 "),s("a",{class:"header-anchor",href:"#输出样例","aria-label":'Permalink to "输出样例"'},"​")],-1)),n[9]||(n[9]=s("blockquote",null,[s("p",null,"2 60 0 1 3")],-1)),n[10]||(n[10]=s("h2",{id:"笔者观点",tabindex:"-1"},[l("笔者观点 "),s("a",{class:"header-anchor",href:"#笔者观点","aria-label":'Permalink to "笔者观点"'},"​")],-1)),n[11]||(n[11]=s("ol",null,[s("li",null,[l("显然这是一条最短路问题，而且只需求一条最短路（起点和终点已定），要求的东西也不算很多，所以这是一道dijkstra的板子题啊。（没学过dijkstra的小伙伴可以看洛谷的 "),s("a",{href:"https://www.luogu.com.cn/problem/P4779",target:"_blank",rel:"noreferrer"},"单源最短路径"),l("）")]),s("li",null,"虽然这道题的时间很短，但是城市数目非常少，不到500，dijkstra在数据量很大的时候也才跑50ms，所以这道题我们的时间是挺充裕的。"),s("li",null,"没有具体给出M的大小，由城市个数我们大概可以猜测M的大小并不会很小，我们需要一个很大的容器去存M（笔者最开始因为这个问题RE了QAQ）"),s("li",null,"很坑的一点就是你要意识到这里给出的路径都是双向路，并不是单向的。"),s("li",null,[l("输出结尾不能有多余的空格（"),s("s",null,"天梯的题就是这么矫情"),l("）")])],-1)),n[12]||(n[12]=s("h2",{id:"具体的思路",tabindex:"-1"},[l("具体的思路 "),s("a",{class:"header-anchor",href:"#具体的思路","aria-label":'Permalink to "具体的思路"'},"​")],-1)),n[13]||(n[13]=s("p",null,"显然这道题是有两个权重的，一个是普通的路段的长度，另一个是城市中的人数。由于需要同时求出最短路的数量和最短而且召集人数最多的路，笔者愚钝，首先想到的只是跑两边dijkstra？一遍求出最短路的条数，第二边考虑上城市人数求出最优解。结果表明这样做是可以的，并不会超时，当然你完全也可以只跑一遍就求出答案。",-1)),n[14]||(n[14]=s("h2",{id:"关键的地方",tabindex:"-1"},[l("关键的地方 "),s("a",{class:"header-anchor",href:"#关键的地方","aria-label":'Permalink to "关键的地方"'},"​")],-1)),n[15]||(n[15]=s("p",null,[l("使用"),s("code",null,"from"),l("来存储到达该点的最短路的条数，使用"),s("code",null,"father"),l("来储存到达该点的最短路的上一个节点，"),s("code",null,"prize"),l("来保存每个城市的人数，"),s("code",null,"head"),l(","),s("code",null,"vis"),l(","),s("code",null,"dis"),l("为dijkstra的必备数组。")],-1)),n[16]||(n[16]=s("div",{class:"language-cpp vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"cpp"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"const"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ll INF "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 9223372036854775800"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},";")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"ll cnt "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 0"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},";")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"ll n, m, s, goal;")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"ll head[maxn], vis[maxn], dis[maxn];")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"ll from[maxn];")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"ll prize[maxn];")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"ll father[maxn];")])])]),s("button",{class:"collapse"})],-1)),n[17]||(n[17]=s("p",null,"因为是双向的（无向）的路，所以我们每次要记录两条",-1)),n[18]||(n[18]=s("div",{class:"language-cpp vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"cpp"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"void"),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," add1"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"ll"),s("span",{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"}}," u"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},", "),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"ll"),s("span",{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"}}," v"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},", "),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"ll"),s("span",{style:{"--shiki-light":"#E36209","--shiki-dark":"#FFAB70"}}," w"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"{")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    e["),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"++"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"cnt].u "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," u;"),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"    //第一次")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    e[cnt].v "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," v;")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    e[cnt].w "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," w;")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    e[cnt].next "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," head[u];")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    head[u] "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," cnt;")]),l(`
`),s("span",{class:"line"}),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    e["),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"++"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"cnt].u "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," v;"),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"   //第二次")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    e[cnt].v "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," u;")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    e[cnt].w "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," w;")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    e[cnt].next "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," head[v];")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    head[v] "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," cnt;")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])]),s("button",{class:"collapse"})],-1)),n[19]||(n[19]=s("p",null,"在第二次dijkstra中我们需要同时考虑两个权重———路的长度和城市的人的数量，我们可以写一个比较函数，在路的长度不一样的时候选择路更短的那一条路，在路的长度一样的时候选择人数较多的那一条路。另外也可以用我的这种做法，将每一条路的权重设置为路的 长度x100000000-路的终点的人口的数量。这样得到的新的权重最小的便是路长度最小并且得到的人数最多的那条路。",-1)),n[20]||(n[20]=s("div",{class:"language-cpp vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"cpp"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"void"),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}}," add2"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"()")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"{")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"    for"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ("),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"int"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," i "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 0"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"; i "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"<="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," cnt; i"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"++"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    {")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        e[i].w "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," e[i].w "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"*"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 100000000"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," -"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," prize[e[i].u];"),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"   //改变权重")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    }")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"    for"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ("),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"int"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," i "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 0"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"; i "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"<="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," n; i"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"++"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    {")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        vis[i] "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 0"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},";"),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"     //初始化")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"    }")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"}")])])]),s("button",{class:"collapse"})],-1)),n[21]||(n[21]=s("p",null,"后面的dijkstra算法就简单很多了，这里只贴出关键部分",-1)),n[22]||(n[22]=s("div",{class:"language-cpp vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"cpp"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"for"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," (ll i "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," head[u]; i; i "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," e[i].next)")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        {")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"            ll v "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," e[i].v;")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"            if"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," (dis[v] "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},">"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," dis[u] "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"+"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," e[i].w)")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"            {")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"                dis[v] "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," dis[u] "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"+"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," e[i].w;")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"                q."),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"push"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"((node){dis[v], v});")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"                from[v] "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," from[u];"),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"    //到达某点的路径数量，如果路径小，则直接赋值")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"                father[v] "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," u;"),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"    //记录父节点")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"            }")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"            else"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," if"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," (dis[v] "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"=="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," dis[u] "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"+"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," e[i].w)")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"            {")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"                dis[v] "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," dis[u] "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"+"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," e[i].w;")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"                q."),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"push"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"((node){dis[v], v});")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"                from[v] "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"+="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," from[u];"),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"   //到达某点的路径数量，如果路径相等，则路径数量相加")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"                father[v] "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," u;"),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"   //记录父节点")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"            }")]),l(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        }")])])]),s("button",{class:"collapse"})],-1)),n[23]||(n[23]=s("h2",{id:"完整代码",tabindex:"-1"},[l("完整代码 "),s("a",{class:"header-anchor",href:"#完整代码","aria-label":'Permalink to "完整代码"'},"​")],-1)),n[24]||(n[24]=s("details",null,[s("summary",null,"点击查看代码"),s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"#include <bits/stdc++.h>")]),l(`
`),s("span",{class:"line"},[s("span",null,"using namespace std;")]),l(`
`),s("span",{class:"line"},[s("span",null,"typedef long long ll;")]),l(`
`),s("span",{class:"line"},[s("span",null,"const int maxn = 1000;")]),l(`
`),s("span",{class:"line"},[s("span",null,"const ll INF = 9223372036854775800;")]),l(`
`),s("span",{class:"line"},[s("span",null,"ll cnt = 0;")]),l(`
`),s("span",{class:"line"},[s("span",null,"ll n, m, s, goal;")]),l(`
`),s("span",{class:"line"},[s("span",null,"ll head[maxn], vis[maxn], dis[maxn];")]),l(`
`),s("span",{class:"line"},[s("span",null,"ll from[maxn];")]),l(`
`),s("span",{class:"line"},[s("span",null,"ll prize[maxn];")]),l(`
`),s("span",{class:"line"},[s("span",null,"ll father[maxn];")]),l(`
`),s("span",{class:"line"},[s("span")]),l(`
`),s("span",{class:"line"},[s("span",null,"struct edge")]),l(`
`),s("span",{class:"line"},[s("span",null,"{")]),l(`
`),s("span",{class:"line"},[s("span",null,"    ll v, u, w, next;")]),l(`
`),s("span",{class:"line"},[s("span",null,"} e[10000007];")]),l(`
`),s("span",{class:"line"},[s("span")]),l(`
`),s("span",{class:"line"},[s("span",null,"struct node")]),l(`
`),s("span",{class:"line"},[s("span",null,"{")]),l(`
`),s("span",{class:"line"},[s("span",null,"    ll w;")]),l(`
`),s("span",{class:"line"},[s("span",null,"    ll now;")]),l(`
`),s("span",{class:"line"},[s("span",null,"    inline bool operator<(const node &a) const  //比较方法")]),l(`
`),s("span",{class:"line"},[s("span",null,"    {")]),l(`
`),s("span",{class:"line"},[s("span",null,"        return w > a.w;")]),l(`
`),s("span",{class:"line"},[s("span",null,"    }")]),l(`
`),s("span",{class:"line"},[s("span",null,"};")]),l(`
`),s("span",{class:"line"},[s("span",null,"priority_queue<node> q;   //大根堆")]),l(`
`),s("span",{class:"line"},[s("span")]),l(`
`),s("span",{class:"line"},[s("span",null,"void add1(ll u, ll v, ll w)")]),l(`
`),s("span",{class:"line"},[s("span",null,"{")]),l(`
`),s("span",{class:"line"},[s("span",null,"    e[++cnt].u = u;")]),l(`
`),s("span",{class:"line"},[s("span",null,"    e[cnt].v = v;")]),l(`
`),s("span",{class:"line"},[s("span",null,"    e[cnt].w = w;")]),l(`
`),s("span",{class:"line"},[s("span",null,"    e[cnt].next = head[u];")]),l(`
`),s("span",{class:"line"},[s("span",null,"    head[u] = cnt;")]),l(`
`),s("span",{class:"line"},[s("span")]),l(`
`),s("span",{class:"line"},[s("span",null,"    e[++cnt].u = v;")]),l(`
`),s("span",{class:"line"},[s("span",null,"    e[cnt].v = u;")]),l(`
`),s("span",{class:"line"},[s("span",null,"    e[cnt].w = w;")]),l(`
`),s("span",{class:"line"},[s("span",null,"    e[cnt].next = head[v];")]),l(`
`),s("span",{class:"line"},[s("span",null,"    head[v] = cnt;")]),l(`
`),s("span",{class:"line"},[s("span",null,"}")]),l(`
`),s("span",{class:"line"},[s("span")]),l(`
`),s("span",{class:"line"},[s("span",null,"void add2()")]),l(`
`),s("span",{class:"line"},[s("span",null,"{")]),l(`
`),s("span",{class:"line"},[s("span",null,"    for (int i = 0; i <= cnt; i++)")]),l(`
`),s("span",{class:"line"},[s("span",null,"    {")]),l(`
`),s("span",{class:"line"},[s("span",null,"        e[i].w = e[i].w * 100000000 - prize[e[i].u];")]),l(`
`),s("span",{class:"line"},[s("span",null,"    }")]),l(`
`),s("span",{class:"line"},[s("span",null,"    for (int i = 0; i <= n; i++)")]),l(`
`),s("span",{class:"line"},[s("span",null,"    {")]),l(`
`),s("span",{class:"line"},[s("span",null,"        vis[i] = 0;")]),l(`
`),s("span",{class:"line"},[s("span",null,"    }")]),l(`
`),s("span",{class:"line"},[s("span",null,"}")]),l(`
`),s("span",{class:"line"},[s("span")]),l(`
`),s("span",{class:"line"},[s("span",null,"void djtestua()")]),l(`
`),s("span",{class:"line"},[s("span",null,"{")]),l(`
`),s("span",{class:"line"},[s("span",null,"    for (int i = 0; i < n; i++)")]),l(`
`),s("span",{class:"line"},[s("span",null,"    {")]),l(`
`),s("span",{class:"line"},[s("span",null,"        father[i] = -1;")]),l(`
`),s("span",{class:"line"},[s("span",null,"        dis[i] = INF;")]),l(`
`),s("span",{class:"line"},[s("span",null,"        from[i] = 1;")]),l(`
`),s("span",{class:"line"},[s("span",null,"    }")]),l(`
`),s("span",{class:"line"},[s("span",null,"    dis[s] = 0;")]),l(`
`),s("span",{class:"line"},[s("span",null,"    q.push((node){0, s});")]),l(`
`),s("span",{class:"line"},[s("span",null,"    while (!q.empty())")]),l(`
`),s("span",{class:"line"},[s("span",null,"    {")]),l(`
`),s("span",{class:"line"},[s("span",null,"        node temp = q.top();")]),l(`
`),s("span",{class:"line"},[s("span",null,"        ll u = temp.now;")]),l(`
`),s("span",{class:"line"},[s("span",null,"        q.pop();")]),l(`
`),s("span",{class:"line"},[s("span",null,"        if (vis[u])")]),l(`
`),s("span",{class:"line"},[s("span",null,"            continue;")]),l(`
`),s("span",{class:"line"},[s("span",null,"        vis[u] = 1;")]),l(`
`),s("span",{class:"line"},[s("span",null,"        for (ll i = head[u]; i; i = e[i].next)")]),l(`
`),s("span",{class:"line"},[s("span",null,"        {")]),l(`
`),s("span",{class:"line"},[s("span",null,"            ll v = e[i].v;")]),l(`
`),s("span",{class:"line"},[s("span",null,"            if (dis[v] > dis[u] + e[i].w)")]),l(`
`),s("span",{class:"line"},[s("span",null,"            {")]),l(`
`),s("span",{class:"line"},[s("span",null,"                dis[v] = dis[u] + e[i].w;")]),l(`
`),s("span",{class:"line"},[s("span",null,"                q.push((node){dis[v], v});")]),l(`
`),s("span",{class:"line"},[s("span",null,"                from[v] = from[u];")]),l(`
`),s("span",{class:"line"},[s("span",null,"                father[v] = u;")]),l(`
`),s("span",{class:"line"},[s("span",null,"            }")]),l(`
`),s("span",{class:"line"},[s("span",null,"            else if (dis[v] == dis[u] + e[i].w)")]),l(`
`),s("span",{class:"line"},[s("span",null,"            {")]),l(`
`),s("span",{class:"line"},[s("span",null,"                dis[v] = dis[u] + e[i].w;")]),l(`
`),s("span",{class:"line"},[s("span",null,"                q.push((node){dis[v], v});")]),l(`
`),s("span",{class:"line"},[s("span",null,"                from[v] += from[u];")]),l(`
`),s("span",{class:"line"},[s("span",null,"                father[v] = u;")]),l(`
`),s("span",{class:"line"},[s("span",null,"            }")]),l(`
`),s("span",{class:"line"},[s("span",null,"        }")]),l(`
`),s("span",{class:"line"},[s("span",null,"    }")]),l(`
`),s("span",{class:"line"},[s("span",null,"}")]),l(`
`),s("span",{class:"line"},[s("span")]),l(`
`),s("span",{class:"line"},[s("span",null,"int main()")]),l(`
`),s("span",{class:"line"},[s("span",null,"{")]),l(`
`),s("span",{class:"line"},[s("span",null,"    ios::sync_with_stdio(false);")]),l(`
`),s("span",{class:"line"},[s("span",null,"    cin.tie(0);")]),l(`
`),s("span",{class:"line"},[s("span",null,"    cout.tie(0);")]),l(`
`),s("span",{class:"line"},[s("span")]),l(`
`),s("span",{class:"line"},[s("span",null,"    cin >> n >> m >> s >> goal;")]),l(`
`),s("span",{class:"line"},[s("span")]),l(`
`),s("span",{class:"line"},[s("span",null,"    for (int i = 0; i < n; i++)")]),l(`
`),s("span",{class:"line"},[s("span",null,"    {")]),l(`
`),s("span",{class:"line"},[s("span",null,"        cin >> prize[i];")]),l(`
`),s("span",{class:"line"},[s("span",null,"    }")]),l(`
`),s("span",{class:"line"},[s("span")]),l(`
`),s("span",{class:"line"},[s("span",null,"    for (int i = 0; i < m; i++)")]),l(`
`),s("span",{class:"line"},[s("span",null,"    {")]),l(`
`),s("span",{class:"line"},[s("span",null,"        ll a, b, c;")]),l(`
`),s("span",{class:"line"},[s("span",null,"        cin >> a >> b >> c;")]),l(`
`),s("span",{class:"line"},[s("span",null,"        add1(a, b, c);")]),l(`
`),s("span",{class:"line"},[s("span",null,"    }")]),l(`
`),s("span",{class:"line"},[s("span",null,"    djtestua();")]),l(`
`),s("span",{class:"line"},[s("span",null,'    // cout << "num: ";')]),l(`
`),s("span",{class:"line"},[s("span",null,'    cout << from[goal] << " ";')]),l(`
`),s("span",{class:"line"},[s("span",null,"    // cout << endl;")]),l(`
`),s("span",{class:"line"},[s("span",null,'    // cout << "from " << endl;')]),l(`
`),s("span",{class:"line"},[s("span",null,"    // for (int i = 0; i < 10; i++)")]),l(`
`),s("span",{class:"line"},[s("span",null,"    // {")]),l(`
`),s("span",{class:"line"},[s("span",null,"    //     cout << from[i] << ' '; ")]),l(`
`),s("span",{class:"line"},[s("span",null,"    // }")]),l(`
`),s("span",{class:"line"},[s("span",null,"    // cout << endl;")]),l(`
`),s("span",{class:"line"},[s("span")]),l(`
`),s("span",{class:"line"},[s("span",null,"    add2();")]),l(`
`),s("span",{class:"line"},[s("span",null,"    djtestua();")]),l(`
`),s("span",{class:"line"},[s("span")]),l(`
`),s("span",{class:"line"},[s("span",null,'    // cout << "father  "  << endl;;')]),l(`
`),s("span",{class:"line"},[s("span",null,"    // for (int i = 0; i < 10; i++)")]),l(`
`),s("span",{class:"line"},[s("span",null,"    // {")]),l(`
`),s("span",{class:"line"},[s("span",null,"    //     cout << father[i] << ' ';")]),l(`
`),s("span",{class:"line"},[s("span",null,"    // }")]),l(`
`),s("span",{class:"line"},[s("span",null,"    // cout << endl;")]),l(`
`),s("span",{class:"line"},[s("span")]),l(`
`),s("span",{class:"line"},[s("span",null,"    ll sum = 0;")]),l(`
`),s("span",{class:"line"},[s("span",null,"    stack<ll> sta;")]),l(`
`),s("span",{class:"line"},[s("span",null,"    ll goaltemp = goal;")]),l(`
`),s("span",{class:"line"},[s("span")]),l(`
`),s("span",{class:"line"},[s("span",null,"    while (goaltemp != -1)")]),l(`
`),s("span",{class:"line"},[s("span",null,"    {")]),l(`
`),s("span",{class:"line"},[s("span",null,"        sta.push(goaltemp);")]),l(`
`),s("span",{class:"line"},[s("span",null,"        sum += prize[goaltemp];")]),l(`
`),s("span",{class:"line"},[s("span",null,"        goaltemp = father[goaltemp];")]),l(`
`),s("span",{class:"line"},[s("span",null,"    }")]),l(`
`),s("span",{class:"line"},[s("span")]),l(`
`),s("span",{class:"line"},[s("span",null,'    // cout << "sum : ";')]),l(`
`),s("span",{class:"line"},[s("span",null,"    cout << sum;")]),l(`
`),s("span",{class:"line"},[s("span",null,"    cout << endl;")]),l(`
`),s("span",{class:"line"},[s("span")]),l(`
`),s("span",{class:"line"},[s("span",null,'    //cout << "dian: " << endl;')]),l(`
`),s("span",{class:"line"},[s("span",null,"    cout << sta.top();")]),l(`
`),s("span",{class:"line"},[s("span",null,"    sta.pop();")]),l(`
`),s("span",{class:"line"},[s("span",null,"    while (!sta.empty())")]),l(`
`),s("span",{class:"line"},[s("span",null,"    {")]),l(`
`),s("span",{class:"line"},[s("span",null,'        cout << " ";')]),l(`
`),s("span",{class:"line"},[s("span",null,"        cout << sta.top();")]),l(`
`),s("span",{class:"line"},[s("span",null,"        sta.pop();")]),l(`
`),s("span",{class:"line"},[s("span",null,"    }")]),l(`
`),s("span",{class:"line"},[s("span")]),l(`
`),s("span",{class:"line"},[s("span",null,"    return 0;")]),l(`
`),s("span",{class:"line"},[s("span",null,"}")])])]),s("button",{class:"collapse"})])],-1)),n[25]||(n[25]=s("h2",{id:"结果",tabindex:"-1"},[l("结果 "),s("a",{class:"header-anchor",href:"#结果","aria-label":'Permalink to "结果"'},"​")],-1)),n[26]||(n[26]=s("p",null,"虽然跑了两次dijkstra，但是还是在最慢48ms跑出了答案，还是可以的，这么做的好处我觉得有两个，一是比较好想，还是直接套的dijkstra的板子，只是我们把路径的权重进行的处理。二是代码比较好写，只需重写一个算权重的函数就可以直接再跑一次dijkstra了。",-1))]),"main-header":i(()=>[e(a.$slots,"main-header")]),"main-header-after":i(()=>[e(a.$slots,"main-header-after")]),"main-nav":i(()=>[e(a.$slots,"main-nav")]),"main-content-before":i(()=>[e(a.$slots,"main-content-before")]),"main-content":i(()=>[e(a.$slots,"main-content")]),"main-content-after":i(()=>[e(a.$slots,"main-content-after")]),"main-nav-before":i(()=>[e(a.$slots,"main-nav-before")]),"main-nav-after":i(()=>[e(a.$slots,"main-nav-after")]),comment:i(()=>[e(a.$slots,"comment")]),footer:i(()=>[e(a.$slots,"footer")]),aside:i(()=>[e(a.$slots,"aside")]),"aside-custom":i(()=>[e(a.$slots,"aside-custom")]),default:i(()=>[e(a.$slots,"default")]),_:3},8,["frontmatter"])}}};export{R as default,F as usePageData};

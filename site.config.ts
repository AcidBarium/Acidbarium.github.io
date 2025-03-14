import { defineSiteConfig } from 'valaxy'
// import { addonWaline } from 'valaxy-addon-waline'

export default defineSiteConfig({
  url: 'https://acidbarium.github.io',
  favicon: "https://acidbarium.github.io/img/favicon_acidbarium.svg",
  lang: 'zh-CN',
  title: "-Acidbarium's Eden-",
  subtitle: '愛あるが故に！',
  author: {
    name: 'Acidbarium',
    avatar: "https://acidbarium.github.io/img/tou.png",
    status: {
      emoji: '❤',
      message: 'Waiting for love !',
    },
  },
  description: '',
  social: [
    {
      name: 'RSS',
      link: '/atom.xml',
      icon: 'i-ri-rss-line',
      color: 'orange',
    },
    {
      name: '网易云音乐',
      link: 'https://music.163.com/#/user/home?id=8612986818',
      icon: 'i-ri-netease-cloud-music-line',
      color: '#C10D0C',
    },
    // {
    //   name: '微博',
    //   link: 'https://weibo.com/u/3075122387',
    //   icon: 'i-ri-weibo-line',
    //   color: '#E6162D',
    // },
    {
      name: '哔哩哔哩',
      link: 'https://space.bilibili.com/3494359496394887?spm_id_from=333.1007.0.0',
      icon: 'i-ri-bilibili-line',
      color: '#FF8EB3',
    },
    // {
    //   name: 'Notion',
    //   link: 'https://yuumis.notion.site',
    //   icon: 'i-simple-icons-notion',
    //   color: '#717171',
    // },
    {
      name: 'GitHub',
      link: 'https://github.com/AcidBarium',
      icon: 'i-ri-github-line',
      color: '#9b9b9b',
    },
    {
      name: 'E-Mail',
      link: 'mailto:acidbarium@gmail.com',
      icon: 'i-ri-mail-line',
      color: '#8E71C1',
    },
    {
      name: 'steam',
      link: 'https://steamcommunity.com/profiles/76561199581455323/',
      icon: 'i-ri:steam-fill',
      color: '#191970',
    },
    {
      name: 'codeforces',
      link: 'https://codeforces.com/profile/_Acid_8arium_',
      icon: 'i-simple-icons:codeforces',
      color: '#EEEE00',
    },
    {
      name: '贴吧',
      link: 'https://tieba.baidu.com/home/main?id=tb.1.56a8f3b9.yMsRJa_limLfEhbFCimkHQ?t=1727221816&fr=index',
      icon: 'i-simple-icons:baidu',
      color: '#6A5ACD',
    },
    // {simple-icons:codeforces
    //   name: 'Twitter',
    //   link: 'https://twitter.com/Yuumi12118924',
    //   icon: 'i-ri-twitter-line',
    //   color: '#1da1f2',
    // },
  ],

  search: {
    enable: true,
    type: 'fuse'
  },

  fuse: {
    options: {
      keys: ['title', 'excerpt', 'content'],
      /**
       * @default 0.6
       * @see https://www.fusejs.io/api/options.html#threshold
       * 设置匹配阈值，越低越精确
       */
      threshold: 0,
      /**
       * @default false
       * @see https://www.fusejs.io/api/options.html#ignoreLocation
       * 忽略位置
       * 这对于搜索文档全文内容有用，若无需全文搜索，则无需设置此项
       */
      ignoreLocation: true,
    },
  },

  sponsor: {
    enable: true,
    title: '赞助',
    methods: [
      // {
      //   name: '支付宝',
      //   url: 'https://cdn.yuumi.link/images/settings/alipay.jpg',
      //   color: '#00A3EE',
      //   icon: 'i-ri-alipay-line',
      // },
      {
        name: '微信支付',
        url: 'https://acidbarium.github.io/img/zanzhu.png',
        color: '#2DC100',
        icon: 'i-ri-wechat-pay-line',
      },
      // {
      //   name: 'QQ 支付',
      //   url: 'https://cdn.yuumi.link/images/settings/qqpay.png',
      //   color: '#12B7F5',
      //   icon: 'i-ri-qq-line',
      // },
    ],
  },

  comment: {
    enable: true,
  },

  mediumZoom: {
    enable: true,
  },

  statistics: {
    enable: true,
  },

  // siteConfig: {
  //   // 启用评论
  //   comment: {
  //     enable: true
  //   },
  // },
  // // 设置 valaxy-addon-waline 配置项
  // addons: [
  //   addonWaline({
  //     // Waline 配置项，参考 https://waline.js.org/reference/client/props.html
  //     serverURL: 'https://waline-bi5pk1nfv-acidbariums-projects.vercel.app/',
  //   }),
  // ],
})

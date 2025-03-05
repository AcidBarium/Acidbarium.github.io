import { defineValaxyConfig } from 'valaxy'
// import { defineConfig } from 'valaxy'
import type { UserThemeConfig } from 'valaxy-theme-yun'
import { addonWaline } from "valaxy-addon-waline";
// import { addonComponents } from "valaxy-addon-components";
import { addonLightGallery } from 'valaxy-addon-lightgallery';
import { addonBangumi } from 'valaxy-addon-bangumi'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts

  theme: 'yun',

  themeConfig: {
    banner: {
      enable: true,
      title: ['Acidbarium', '的', '伊', '甸', '园'],
      cloud: {
        enable: true,
      },
    },

    pages: [
      {
        name: '留言板',
        url: '/comment/',
        icon: 'i-ri-clipboard-line',
        color: '#737de5',
      },
      {
        name: '相册',
        url: '/albums/',
        icon: 'i-ri-gallery-line',
        color: '#43abee',
      },
      {
        name: '友链',
        url: '/links/',
        icon: 'i-ri-open-arm-line',
        color: '#4bbea4',
      },
    ],

    menu: {
      custom: {
        title: 'menu.slides',
        url: '/slides/',
        icon: 'i-ri-keynote-line'
      }
    },
    
    bg_image: {
      enable: true,
      url: "https://cdn.yuumi.link/images/settings/background.png",
      dark: "https://cdn.yuumi.link/images/settings/bgdark.jpg",
      opacity: 1
    },

    say: {
      enable: true,
      api: "https://el-bot-api.vercel.app/api/words/young",
      hitokoto: {
        enable: true,
        api: "https://v1.hitokoto.cn/?c=k&c=d&c=i",
      },
    },

    colors: {
      primary: "#D69B54",
    },

    fireworks: {
      enable: true,
      colors: ['#FFE57D', '#FFCD88', '#E6F4AD']
    },

    footer: {
      since: 2021,
      icon: {
        enable: true,
        name: 'i-ri-heart-line',
        animated: true,
        color: '#d69b54',
        url: 'https://yuumi.link',
        title: '回到首页'
      },
      powered: true,
      beian: {
        enable: false,
        icp: 'xxxx',
      },
    },
    
  },

  addons: [
    // addonComponents(),
    addonWaline({
      serverURL: "https://comment.yuumi.link",
      locale: {
        placeholder: "填写qq邮箱或点击登录，可以展示个人头像~详情请见【留言板】板块",
      },
      comment: true,
      pageview: true,
      emoji: [
        "https://jsd.onmicrosoft.cn/gh/walinejs/emojis@latest/bmoji/",
        "https://jsd.onmicrosoft.cn/npm/@waline/emojis@latest/weibo/",
        "https://jsd.onmicrosoft.cn/npm/@waline/emojis@latest/qq/",
        "https://jsd.onmicrosoft.cn/npm/@waline/emojis@latest/tieba/",
      ],
      // recaptchaV3Key: "",
    }),
    addonLightGallery(),
    addonBangumi({
      api: 'https://bilibilibgm.yuumi.link/api',
      bilibiliUid: '7498906',
      bgmUid: 'yuumi',
      bilibiliEnabled: true,
      bgmEnabled: true,
      customCss: `
        :host {
          --bbc-text-base-color: #4c4948;
          --bbc-label-color: #8eab64;
          --bbc-primary-color: #d69b54;
        }
      `,
    }),
  ],
  
  features: {
      katex: true
  },

  unocss: { safelist },

  
})

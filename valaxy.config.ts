import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'
import { addonWaline } from 'valaxy-addon-waline'

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
      title: '酸钡君的伊甸园',
    },

    pages: [
      {
        name: '项目橱窗',
        url: '/projects/',
        icon: 'i-ri-code-s-slash-line',
        // color: 'var',
      },
      {
        name: '我的小伙伴们',
        url: '/links/',
        icon: 'i-ri-genderless-line',
        color: 'dodgerblue',
      },
      {
        name: '喜欢的女孩子',
        url: '/girls/',
        icon: 'i-ri-women-line',
        color: 'hotpink',
      },
    ],

    bg_image: {
      enable: true,
      url: "https://acidbarium.github.io/img/background.png",
      dark: "https://acidbarium.github.io/img/background_dark.jpg",
      opacity: 1
    },

    footer: {
      since: 2025,
      beian: {
        enable: true,
        // icp: '苏ICP备17038157号',
      },
    },

    siteConfig: {
      // 启用评论
      comment: {
        enable: true
      },
    },
    // 设置 valaxy-addon-waline 配置项
    addons: [
      addonWaline({
        // Waline 配置项，参考 https://waline.js.org/reference/client/props.html
        serverURL: 'https://waline-bi5pk1nfv-acidbariums-projects.vercel.app/',
      }),
    ],


  },

  unocss: { safelist },
})

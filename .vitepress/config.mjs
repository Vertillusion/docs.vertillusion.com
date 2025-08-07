import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "",
  head: [["link", { rel: "icon", href: "https://www.vilinko.com/img/Newico.png" }]],
  title: "Vilinko Studio 文档",
  description: "",
  // 多语言配置
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
    },
    en: {
      label: 'English',
      lang: 'en-US',
    },
  },
  themeConfig: {
    logo: {
      light: "https://www.vilinko.com/img/Newico.png",
      dark: "https://www.vilinko.com/img/Newico.png"
    },
    // https://vitepress.dev/reference/default-theme-config
    // 页面导航
    outlineTitle: "文章目录",
    outline: [2, 6],

    // 深色模式
    darkModeSwitchLabel: '深色模式',

    // 返回顶部
    returnToTopLabel: "返回顶部",

    // 搜索框
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "ヾ(≧▽≦*)o",
            buttonAriaLabel: "ヾ(≧▽≦*)o"
          },
          modal: {
            noResultsText: "(ノへ￣、)",
            resetButtonTitle: "重置",
            footer: {
              selectLabel: "选择",
              navigateUpKey: "↑",
              navigateDownKey: "↓",
              closeKey: "Esc",
              submitKey: "Enter"
            },
          },
        },
      },
    },
    
    // 页脚
    footer: {
      copyright: 'Copyright © 2019 - 2025 Vilinko Studio. All Rights Reserved.',
      message: '<a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2025454076号</a>'
    },
    
    // 标题栏
    nav: [
      { text: '首页', link: '/' },
      {
        text: "LINKS",
        items: [
          { text: 'Vilinko Studio', link: 'https://www.vilinko.com' },
          { text: 'LightFrame', link: 'https://lightframe.vilinko.com' },
          { text: 'LFS', link: 'https://lfs.vertillusion.com' }
        ],
      },
      {
        text: "FRIENDS",
        items: [
          { text: 'STARKETTLE', link: 'https://scarefree.cn/' }
        ],
      },
      {
        text: "ABOUT",
        items: [
          { text: '关于 Vilinko Studio', link: '/about/index' },
          { text: '开发者列表', link: '/about/developers' },
        ],
      },
    ],

    // 左侧菜单
    sidebar: [
      {
        text: 'LightFrame',
        collapsed: true,
        items: [
          { text: '基本介绍 / Basic Introduction', link: '/docs/lightframe/index' },
          { text: '使用教程 / User Manual', link: '/docs/lightframe/manual'}
        ]
      },
      {
        text: 'Vui.Parser',
        collapsed: true,
        items: [
          { text: '基本介绍 / Basic Introduction', link: '/docs/vui.parser/index' }
        ]
      },
      {
        text: '链接 / LINKS',
        collapsed: true,
        items: [
          { text: 'Vilinko Studio', link: 'https://www.vilinko.com' },
          { text: 'LightFrame', link: 'https://lightframe.vilinko.com' },
          { text: 'LFS', link: 'https://lfs.vertillusion.com' }
        ]
      },
      {
        text: '关于 / ABOUT',
        collapsed: true,
        items: [
          { text: '关于 Vilinko / About Vilinko', link: '/about/index' },
          { text: '开发者列表 / Developers', link: '/about/developers' }
        ]
      },
      {
        text: '服务协议 / Service Agreement',
        collapsed: true,
        items: [
          { text: '服务条款 / Terms of Service', link: '/agreement/tos' },
          { text: '隐私政策 / Privacy Policy', link: '/agreement/privacy' },
          { text: '未成年人保护条款 / Minor Protection Terms', link: '/agreement/protect_child' },
          { text: '付费服务协议 / Paid Service Agreement', link: '/agreement/pay' },
        ]
      },
    ],

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/VilinkoStudio' },
    ]
  }
})
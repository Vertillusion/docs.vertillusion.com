import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "",
  head: [["link", { rel: "icon", href: "https://www.vertillusion.com/img/Newico.png" }]],
  title: "Vilinko Studio 文档",
  description: "",
  themeConfig: {
    logo: {
      light: "https://www.vertillusion.com/img/Newico.png",
      dark: "https://www.vertillusion.com/img/Newico.png"
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
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档"
          },
          modal: {
            noResultsText: "无法找到结果",
            resetButtonTitle: "清除查询条件",
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
          { text: '官方网站', link: 'https://www.vertillusion.com' },
          { text: 'LightFrame', link: 'https://lightframe.vertillusion.com' },
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
        text: "关于我们",
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
          { text: '基本介绍', link: '/docs/lightframe/index' },
          { text: '使用教程', link: '/docs/lightframe/manual'}
        ]
      },
      {
        text: 'Vui.Parser',
        collapsed: true,
        items: [
          { text: '基本介绍', link: '/docs/vui.parser/index' }
        ]
      },
      {
        text: 'LINKS',
        collapsed: true,
        items: [
          { text: '官方网站', link: 'https://www.vertillusion.com' },
          { text: 'LightFrame', link: 'https://lightframe.vertillusion.com' },
          { text: 'LFS', link: 'https://lfs.vertillusion.com' }
        ]
      },
      {
        text: '关于我们',
        collapsed: true,
        items: [
          { text: '关于 Vilinko Studio', link: '/about/index' },
          { text: '开发者列表', link: '/about/developers' }
        ]
      },
      {
        text: '服务协议',
        collapsed: true,
        items: [
          { text: '服务条款', link: '/agreement/tos' },
          { text: '隐私政策', link: '/agreement/privacy' },
          { text: '未成年人保护条款', link: '/agreement/protect_child' },
          { text: '付费服务协议', link: '/agreement/pay' },
        ]
      },
    ],

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Vertillusion/' }
    ]
  }
})
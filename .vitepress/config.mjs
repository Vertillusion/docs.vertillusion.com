import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "",
  head: [["link", { rel: "icon", href: "https://www.vertillusion.xyz/img/Newico.png" }]],
  title: "Vertillusion Studio Docs",
  description: "",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // 页面导航
    outlineTitle: "文章目录",
    outline: [2, 6],

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
      copyright: '© 版权所有 2019 - 2024, Vertillusion Studio - Meet, Inspire, Create..',
      message: '利用 VitePress 构建'
    },
    
    // 标题栏
    nav: [
      { text: '首页', link: '/' },
      { text: 'LightFrame', link: '/projects/LightFrame' },
    ],

    // 左侧菜单
    sidebar: [
      {
        text: '项目',
        items: [
          { text: 'LightFrame', link: '/projects/LightFrame' }
        ]
      },
    ],

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Vertillusion/docs.vertillusion.com' }
    ]
  }
})

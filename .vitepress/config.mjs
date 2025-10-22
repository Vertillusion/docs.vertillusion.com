import { defineConfig } from 'vitepress';
import vitepressProtectPlugin from "vitepress-protect-plugin";
import { withMermaid } from 'vitepress-plugin-mermaid'; // mermaid
import { withPwa } from '@vite-pwa/vitepress';
let markdownItTaskCheckbox;
import('markdown-it-task-checkbox') // todo
  .then(module => {
    markdownItTaskCheckbox = module.default || module;
  })
  .catch(error => {
    console.error('Failed to import markdown-it-task-checkbox:', error);
  });

// 创建导航配置函数
function createNav(lang = 'zh') {
  if (lang === 'en') {
    return [
      { text: 'Home', link: '/en/' },
      {
        text: "LINKS",
        items: [
          { text: 'Vilinko Studio', link: 'https://www.vilinko.com' },
          { text: 'LightFrame', link: 'https://lightframe.vilinko.com' },
          { text: 'LFS', link: 'https://lfs.vilinko.com' }
        ],
      },
      {
        text: "ABOUT",
        items: [
          { text: 'About Vilinko Studio', link: '/en/about/index' },
          { text: 'Developers List', link: '/en/about/developers' },
        ],
      },
      { text: 'Login', link: 'https://vilinko-studio.feishu.cn/' },
    ];
  }
  
  // 默认中文导航
  return [
    { text: '首页', link: '/' },
    {
      text: "工作室链接",
      items: [
        { text: 'Vilinko Studio', link: 'https://www.vilinko.com' },
        { text: 'LightFrame', link: 'https://lightframe.vilinko.com' },
        { text: 'LFS', link: 'https://lfs.vilinko.com' }
      ],
    },
    {
      text: "关于我们",
      items: [
        { text: '关于 Vilinko Studio', link: '/about/index' },
        { text: '开发者列表', link: '/about/developers' },
      ],
    },
    { text: '企业登录', link: 'https://vilinko-studio.feishu.cn/' },
  ];
}

// 创建侧边栏配置函数
function createSidebar(lang = 'zh') {
  if (lang === 'en') {
    return [
      {
        text: 'Universe',
        collapsed: true,
        items: [
          { text: 'Introduction', link: '/en/docs/universe/index' }
        ]
      },
      {
        text: 'LightFrame',
        collapsed: true,
        items: [
          { text: 'Basic Introduction', link: '/en/docs/lightframe/index' },
          { text: 'User Manual', link: '/en/docs/lightframe/manual' },
          { text: 'Custom Commands', link: '/en/docs/lightframe/code' }
        ]
      },
      {
        text: 'Vui.Parser',
        collapsed: true,
        items: [
          { text: 'Basic Introduction', link: '/en/docs/vui.parser/index' }
        ]
      },
      {
        text: 'Vina.UI',
        collapsed: true,
        items: [
          { text: 'Basic Introduction', link: '/en/docs/vinaui/index' }
        ]
      },
      {
        text: 'LINKS',
        collapsed: true,
        items: [
          { text: 'Vilinko Studio', link: 'https://www.vilinko.com' },
          { text: 'LightFrame', link: 'https://lightframe.vilinko.com' },
          { text: 'LFS', link: 'https://lfs.vilinko.com' }
        ]
      },
      {
        text: 'ABOUT',
        collapsed: true,
        items: [
          { text: 'About Vilinko', link: '/en/about/index' },
          { text: 'Developers', link: '/en/about/developers' }
        ]
      },
      {
        text: 'Service Agreement',
        collapsed: true,
        items: [
          { text: 'Terms of Service', link: '/en/agreement/tos' },
          { text: 'Privacy Policy', link: '/en/agreement/privacy' },
          { text: 'Minor Protection Terms', link: '/en/agreement/protect_child' },
          { text: 'Paid Service Agreement', link: '/en/agreement/pay' },
        ]
      },
    ];
  }
  
  // 默认中文侧边栏
  return [
    {
      text: 'Universe',
      collapsed: true,
      items: [
        { text: '介绍', link: '/docs/universe/index' }
      ]
    },
    {
      text: 'LightFrame',
      collapsed: true,
      items: [
        { text: '基本介绍', link: '/docs/lightframe/index' },
        { text: '使用教程', link: '/docs/lightframe/manual' },
        { text: '自定义命令', link: '/docs/lightframe/code' }
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
      text: 'Vina.UI',
      collapsed: true,
      items: [
        { text: '基本介绍', link: '/docs/vinaui/index' }
      ]
    },
    {
      text: '链接',
      collapsed: true,
      items: [
        { text: 'Vilinko Studio', link: 'https://www.vilinko.com' },
        { text: 'LightFrame', link: 'https://lightframe.vilinko.com' },
        { text: 'LFS', link: 'https://lfs.vilinko.com' }
      ]
    },
    {
      text: '关于',
      collapsed: true,
      items: [
        { text: '关于 Vilinko', link: '/about/index' },
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
  ];
}

export default withMermaid(withPwa(
  defineConfig({
    base: "",
    head: [["link", { rel: "icon", href: "https://www.vilinko.com/img/Newico.png" }]],
    title: "Vilinko Studio 文档",
    description: "Vilinko Studio 文档，提供产品的使用说明和用户服务支持。",
    keywords: 'Vilinko Studio,文档,产品,服务,支持,Vilinko,vertillusion,lightframe,lfs,vinaui,vui',
    
    // 多语言配置
    locales: {
      root: {
        label: '简体中文',
        lang: 'zh-CN',
        themeConfig: {
          lang: 'zh-Hans',
          externalLinkIcon: true,
          langMenuLabel: '切换语言',
          darkModeSwitchLabel: '主题',
          lightModeSwitchTitle: '切换到浅色模式',
          darkModeSwitchTitle: '切换到深色模式',
          sidebarMenuLabel: '菜单',
          outline: { level: [2, 3], label: '目录' },
          returnToTopLabel: '返回顶部',
          docFooter: { prev: '上一篇', next: '下一篇' },
          
          // 导航和侧边栏
          nav: createNav('zh'),
          sidebar: createSidebar('zh'),
        }
      },
      en: {
        label: 'English',
        lang: 'en-US',
        themeConfig: {
          lang: 'en-US',
          externalLinkIcon: true,
          langMenuLabel: 'Switch Language',
          darkModeSwitchLabel: 'Theme',
          lightModeSwitchTitle: 'Switch to Light Mode',
          darkModeSwitchTitle: 'Switch to Dark Mode',
          sidebarMenuLabel: 'Menu',
          outline: { level: [2, 3], label: 'Outline' },
          returnToTopLabel: 'Back to Top',
          docFooter: { prev: 'Previous', next: 'Next' },
          
          // 导航和侧边栏
          nav: createNav('en'),
          sidebar: createSidebar('en'),
        }
      },
    },
    
    mermaid: {},
    mermaidPlugin: {
      class: "mermaid my-class",
    },
    
    markdown: {
      config: (md) => {
        if (markdownItTaskCheckbox) {
          md.use(markdownItTaskCheckbox);
        } else {
          console.warn('markdown-it-task-checkbox not loaded yet');
        }
      },
    },
    
    vite: {
      server: {
        proxy: {
          '/api': {
            target: 'https://api.vilinko.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
        },
      },
      plugins: [
        vitepressProtectPlugin({
          disableF12: true, // F12开发者模式
          disableCopy: false, // 文本复制
          disableSelect: false, // 文本选择
        }),
      ],
    },
    
    themeConfig: {
      logo: {
        light: "https://www.vilinko.com/img/Newico.png",
        dark: "https://www.vilinko.com/img/Newico.png"
      },
      
      // 搜索框
      search: {
        provider: "local",
        options: {
          enablePhraseSearch: true,
          translations: {
            button: {
              buttonText: "搜索",
              buttonAriaLabel: "搜索"
            },
            modal: {
              noResultsText: "未找到结果",
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
        message: '<a href="https://beian.miit.gov.cn/" target="_blank" style="text-decoration: none;">粤ICP备2025454076号</a>'
      },

      // 社交链接
      socialLinks: [
        { icon: 'github', link: 'https://github.com/VilinkoStudio' },
        { icon: 'bilibili', link: 'https://space.bilibili.com/3493298551393123' },
      ]
    },
  })
))
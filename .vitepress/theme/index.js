// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import "./style/blur.css";
import "./style/var.css";
import { setupImageOptimization } from './utils/imageOptimizer.js';
import Linkcard from "./components/Linkcard.vue";
import Closeword from "./components/closeword.vue";
import SponsorTable from "./components/SponsorTable.vue";
import DownloadCard from "./components/DownloadCard.vue";
import Version, { processNumTags, EnNumComponent } from "./components/version.vue";
import { processResearchTags } from "./components/research.vue";
// 导入Login组件
import Login from './components/login.vue';
// 导入unlockre组件
import Unlockre from './components/unlockre.vue';
// 导入ua组件
import Ua from './components/ua.vue';
// 导入uain组件
import Uain from './components/uain.vue';
// 导入nuna-design-vue组件库
import NunaDesignVue from 'nuna-design-vue';
import 'nuna-design-vue/style.css';

/** @type {import('vitepress').Theme} */
export default {
  ...DefaultTheme, // 展开DefaultTheme以确保所有默认属性都被包含
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 调用默认主题的enhanceApp方法
    DefaultTheme.enhanceApp?.({ app, router, siteData })

    // 全局注册nuna-design-vue组件库
    app.use(NunaDesignVue);

    // 初始化图片优化工具
    const imageOptimizer = setupImageOptimization();
    imageOptimizer.init();
    
    // 注册全局组件
    app.component('Linkcard', Linkcard)
    app.component('SponsorTable', SponsorTable)
    app.component('DownloadCard', DownloadCard)
    // 注册Closeword组件，支持<Closeword>和<cw>两种标签
    app.component('Closeword', Closeword)
    app.component('cw', Closeword)
    // 注册Version组件，支持<Version>和<version>两种标签
    app.component('Version', Version)
    app.component('version', Version)
    
    // 注册EnNumComponent组件，支持<en_num>标签
    app.component('en_num', EnNumComponent)
    
    // 注册Login组件，支持<login>标签
    app.component('Login', Login)
    app.component('login', Login)
    
    // 注册Unlockre组件，支持<Unlockre>和<unlockre>以及<rere>三种标签
    app.component('Unlockre', Unlockre)
    app.component('unlockre', Unlockre)
    app.component('rere', Unlockre)
    
    // 注册Ua组件，支持<Ua>和<ua>两种标签
    app.component('Ua', Ua)
    app.component('ua', Ua)
    
    // 注册Uain组件，支持<Uain>和<uain>两种标签
    app.component('Uain', Uain)
    app.component('uain', Uain)
    
    // 创建全局Snackbar服务
    const snackbarService = {
      showMessage(message, color = 'info', timeout = 3000) {
        // 创建Snackbar元素
        const snackbar = document.createElement('div');
        snackbar.className = 'v-snackbar';
        snackbar.style.cssText = `
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%) translateY(100%);
          background-color: ${color === 'error' ? '#f44336' : color === 'success' ? '#4caf50' : color === 'warning' ? '#ff9800' : '#2196f3'};
          color: white;
          padding: 16px 24px;
          border-radius: 4px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
          z-index: 1000000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          opacity: 0;
          transition: opacity 0.3s, transform 0.3s;
          white-space: nowrap;
          max-width: 90%;
          text-align: center;
        `;
        snackbar.textContent = message;
        
        // 添加到body
        document.body.appendChild(snackbar);
        
        // 显示动画
        setTimeout(() => {
          snackbar.style.opacity = '1';
          snackbar.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        // 自动关闭
        setTimeout(() => {
          snackbar.style.opacity = '0';
          snackbar.style.transform = 'translateX(-50%) translateY(100%)';
          setTimeout(() => {
            if (snackbar.parentNode) {
              snackbar.parentNode.removeChild(snackbar);
            }
          }, 300);
        }, timeout);
      }
    };
    
    // 挂载到window和app实例上
    if (typeof window !== 'undefined') {
      window.$snackbar = snackbarService;
    }
    app.config.globalProperties.$snackbar = snackbarService;
    
    // 添加页面加载完成后的钩子，用于处理<num>、<en_num>和<research>标签
    const originalAfterRouteChanged = router.onAfterRouteChanged;
    router.onAfterRouteChanged = () => {
      // 调用原始的路由变化后处理函数
      if (originalAfterRouteChanged) {
        originalAfterRouteChanged();
      }
      
      // 等待DOM渲染完成
      setTimeout(() => {
        // 处理页面中的所有标签
        processNumTags();
        processResearchTags();
        
        // 页面更新后重新处理图片
        imageOptimizer.updateImages();
      }, 100)
    }

    // 在应用卸载时清理资源
    const originalUnmount = app.unmount;
    app.unmount = function() {
      imageOptimizer.destroy();
      if (originalUnmount) {
        originalUnmount.call(this);
      }
    };
  }
}

// 处理研究标签
// 确保只在浏览器环境中执行
if (typeof window !== 'undefined') {
  window.processResearchTags = processResearchTags;
  // 处理数字标签
  window.processNumTags = processNumTags;
}
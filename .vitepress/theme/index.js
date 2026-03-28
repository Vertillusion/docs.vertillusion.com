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
import Login from './components/login.vue';
import Unlockre from './components/unlockre.vue';
import Ua from './components/ua.vue';
import Uain from './components/uain.vue';
import NunaDesignVue from 'nuna-design-vue';
import 'nuna-design-vue/style.css';

export default {
  ...DefaultTheme,
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
    })
  },
  enhanceApp({ app, router, siteData }) {
    DefaultTheme.enhanceApp?.({ app, router, siteData })

    app.use(NunaDesignVue);

    const imageOptimizer = setupImageOptimization();
    imageOptimizer.init();
    
    // 注册全局组件
    app.component('Linkcard', Linkcard)
    app.component('SponsorTable', SponsorTable)
    app.component('DownloadCard', DownloadCard)
    app.component('Closeword', Closeword)
    app.component('cw', Closeword)
    app.component('Version', Version)
    app.component('version', Version)
    app.component('en_num', EnNumComponent)
    app.component('Login', Login)
    app.component('login', Login)
    app.component('Unlockre', Unlockre)
    app.component('unlockre', Unlockre)
    app.component('rere', Unlockre)
    app.component('Ua', Ua)
    app.component('ua', Ua)
    app.component('Uain', Uain)
    app.component('uain', Uain)
    
    // 创建全局Snackbar服务
    const snackbarService = {
      showMessage(message, color = 'info', timeout = 3000) {
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
        processNumTags();
        processResearchTags();
        
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
  window.processNumTags = processNumTags;
}
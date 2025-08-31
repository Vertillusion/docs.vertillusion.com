// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import "./style/blur.css";
import "./style/var.css";
import { setupImageOptimization } from './utils/imageOptimizer.js';
import './utils/install-pwa.js';
import Linkcard from "./components/Linkcard.vue";
import Closeword from "./components/closeword.vue";
import SponsorTable from "./components/SponsorTable.vue";
import DownloadCard from "./components/DownloadCard.vue";
import Version, { processNumTags, EnNumComponent } from "./components/version.vue";
import { processResearchTags } from "./components/research.vue";

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
    
    // 添加页面加载完成后的钩子，用于处理<num>、<en_num>和<research>标签
    router.onAfterRouteChanged = () => {
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
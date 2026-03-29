import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import "./style/blur.css";
import "./style/var.css";
import Linkcard from "./components/Linkcard.vue";
import SponsorTable from "./components/SponsorTable.vue";
import DownloadCard from "./components/DownloadCard.vue";
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

    
    // 注册全局组件
    app.component('Linkcard', Linkcard)
    app.component('SponsorTable', SponsorTable)
    app.component('DownloadCard', DownloadCard)

    // 在应用卸载时清理资源
    const originalUnmount = app.unmount;
    app.unmount = function() {
      if (originalUnmount) {
        originalUnmount.call(this);
      }
    };
  }
}

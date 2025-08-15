// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import "./style/blur.css";
import "./style/var.css";
  import Linkcard from "./components/Linkcard.vue";
import Closeword from "./components/closeword.vue";
import SponsorTable from "./components/SponsorTable.vue";
import DownloadCard from "./components/DownloadCard.vue";

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件
    app.component('Linkcard', Linkcard)
    app.component('SponsorTable', SponsorTable)
    app.component('DownloadCard', DownloadCard)
    // 注册Closeword组件，支持<Closeword>和<cw>两种标签
    app.component('Closeword', Closeword)
    app.component('cw', Closeword)
  }
}
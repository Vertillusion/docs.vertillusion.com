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

// 微信客服悬浮窗初始化函数
let wechatChatbotLoaded = false;
let chatWindowContainer = null;
let iframeElement = null;
let chatButton = null;

function initWechatChatbot() {
  // 避免重复加载
  if (wechatChatbotLoaded) return;
  
  // 先创建悬浮按钮，不直接加载iframe
  createChatButton();
  
  // 预加载脚本，但不立即初始化
  new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://chatbot.weixin.qq.com/mmspraiweb_node/dist/static/script/FLOAT_WINDOW_INIT.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  }).then(() => {
    wechatChatbotLoaded = true;
    // 脚本加载完成，但等到用户点击按钮才显示客服窗口
  }).catch(error => {
    console.error('加载微信客服悬浮窗脚本失败:', error);
  });
}

// 创建悬浮按钮
function createChatButton() {
  // 创建按钮容器
  chatButton = document.createElement('div');
  chatButton.id = 'wechat-chat-button';
  chatButton.style.cssText = `
    position: fixed;
    right: 30px;
    bottom: 30px;
    width: 60px;
    height: 60px;
    background-color: #5c83ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 999998;
  `;
  
  // 添加用户头像图标
  chatButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style="color: white;"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
  
  // 添加点击事件
  chatButton.addEventListener('click', showChatWindow);
  
  document.body.appendChild(chatButton);
}

// 显示客服窗口
function showChatWindow() {
  // 移除按钮
  if (chatButton && chatButton.parentNode) {
    chatButton.parentNode.removeChild(chatButton);
  }
  
  // 创建聊天窗口容器
  chatWindowContainer = document.createElement('div');
  chatWindowContainer.id = 'wechat-chat-window';
  
  // 创建关闭按钮
  const closeButton = document.createElement('div');
  closeButton.id = 'wechat-chat-close';
  closeButton.style.cssText = `
    position: absolute;
    top: 14px;
    right: 14px;
    width: 24px;
    height: 24px;
    color: black;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    z-index: 1000000;
  `;
  closeButton.innerHTML = '×';
  
  // 创建iframe
  iframeElement = document.createElement('iframe');
  iframeElement.style.cssText = 'width: 100%; height: 100%; border: none;';
  
  // 设置容器样式
  const sizeWindow = () => {
    const { innerWidth: width, innerHeight: height } = window;
    const winWidth = Math.min(Math.max(400, width * 0.3), 500);
    const winHeight = Math.max(600, height * 0.7);
    
    chatWindowContainer.style.cssText = `
      position: fixed;
      right: 30px;
      bottom: 30px;
      width: ${winWidth}px;
      height: ${winHeight}px;
      z-index: 999999;
      overflow: hidden;
      border-radius: 6px;
    `;
  };
  
  sizeWindow();
  window.addEventListener('resize', sizeWindow);
  
  // 添加元素到容器
  chatWindowContainer.appendChild(closeButton);
  chatWindowContainer.appendChild(iframeElement);
  document.body.appendChild(chatWindowContainer);
  
  // 设置iframe源
  if (window._FLOAT_WINDOWA_INIT_) {
    // 使用自定义方式加载客服页面，而不是使用微信提供的初始化函数
    iframeElement.src = 'https://chatbot.weixin.qq.com/webapp/VevUWQr6ZPRLtn0f8gdoJ4bYQI6EKv?isFloat=true&robotName=%E5%B0%8FV';
  }
  
  // 关闭按钮点击事件
  closeButton.addEventListener('click', () => {
    if (chatWindowContainer && chatWindowContainer.parentNode) {
      chatWindowContainer.parentNode.removeChild(chatWindowContainer);
      window.removeEventListener('resize', sizeWindow);
    }
    // 重新显示按钮
    createChatButton();
  });
}

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
        
        // 初始化微信客服悬浮窗
        initWechatChatbot();
      }, 100)
    }

    // 在应用卸载时清理资源
    const originalUnmount = app.unmount;
    app.unmount = function() {
      imageOptimizer.destroy();
      // 清理客服组件
      if (chatWindowContainer && chatWindowContainer.parentNode) {
        chatWindowContainer.parentNode.removeChild(chatWindowContainer);
      }
      if (chatButton && chatButton.parentNode) {
        chatButton.parentNode.removeChild(chatButton);
      }
      if (originalUnmount) {
        originalUnmount.call(this);
      }
    };
  }
}
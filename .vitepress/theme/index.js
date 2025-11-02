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
  // 确保只在浏览器环境中执行
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
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
  // 确保只在浏览器环境中执行
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  // 创建按钮容器
  chatButton = document.createElement('div');
  chatButton.id = 'wechat-chat-button';
  
  // 检查是否为移动设备
  const isMobile = window.innerWidth <= 768;
  const buttonSize = isMobile ? '50px' : '60px';
  const iconSize = isMobile ? '28' : '32';
  const position = isMobile ? '20px' : '30px';
  
  chatButton.style.cssText = `
    position: fixed;
    right: ${position};
    bottom: ${position};
    width: ${buttonSize};
    height: ${buttonSize};
    background-color: #5c83ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 999998;
    box-shadow: 0 4px 12px rgba(92, 131, 255, 0.4);
    transition: transform 0.2s, background-color 0.2s;
  `;
  
  // 添加用户头像图标
  chatButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="currentColor" style="color: white;"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
  
  // 添加点击事件
  chatButton.addEventListener('click', showChatWindow);
  
  // 添加hover效果（非移动设备）
  if (!isMobile) {
    chatButton.addEventListener('mouseenter', () => {
      chatButton.style.transform = 'scale(1.1)';
      chatButton.style.backgroundColor = '#4a73ff';
    });
    
    chatButton.addEventListener('mouseleave', () => {
      chatButton.style.transform = 'scale(1)';
      chatButton.style.backgroundColor = '#5c83ff';
    });
  }
  
  // 添加触摸效果（移动设备）
  if (isMobile) {
    chatButton.addEventListener('touchstart', () => {
      chatButton.style.transform = 'scale(0.95)';
    });
    
    chatButton.addEventListener('touchend', () => {
      chatButton.style.transform = 'scale(1)';
    });
  }
  
  document.body.appendChild(chatButton);
}

// 显示客服窗口
function showChatWindow() {
  // 确保只在浏览器环境中执行
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
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
  
  // 检查是否为移动设备
  const isMobile = window.innerWidth <= 768;
  const buttonSize = isMobile ? '32px' : '24px';
  const fontSize = isMobile ? '24px' : '18px';
  
  closeButton.style.cssText = `
    position: absolute;
    top: 14px;
    right: 14px;
    width: ${buttonSize};
    height: ${buttonSize};
    color: black;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: ${fontSize};
    font-weight: bold;
    z-index: 1000000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: background-color 0.2s;
  `;
  closeButton.innerHTML = '×';
  
  // 添加交互效果
  closeButton.addEventListener('mouseenter', () => {
    closeButton.style.backgroundColor = 'rgba(255, 255, 255, 1)';
  });
  
  closeButton.addEventListener('mouseleave', () => {
    closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  });
  
  // 创建loading遮罩
  const createLoadingMask = () => {
    const loadingMask = document.createElement('div');
    loadingMask.id = 'chat-window-loading';
    loadingMask.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: opacity 0.5s ease;
    `;
    
    // 添加加载动画（旋转的圆圈）
    const spinner = document.createElement('div');
    spinner.style.cssText = `
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #5c83ff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    `;
    
    // 添加加载文本
    const loadingText = document.createElement('div');
    loadingText.textContent = '正在连接客服...';
    loadingText.style.cssText = `
      font-size: 14px;
      color: #666;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    // 添加动画样式
    let style = document.getElementById('loading-spinner-animation');
    if (!style) {
      style = document.createElement('style');
      style.id = 'loading-spinner-animation';
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
    
    loadingMask.appendChild(spinner);
    loadingMask.appendChild(loadingText);
    return loadingMask;
  };
  
  // 创建loading遮罩并添加到容器
  const loadingMask = createLoadingMask();
  chatWindowContainer.appendChild(loadingMask);
  
  // 创建iframe
  iframeElement = document.createElement('iframe');
  iframeElement.style.cssText = 'width: 100%; height: 100%; border: none; overflow: hidden;';
  
  // 设置容器样式
  const sizeWindow = () => {
    const { innerWidth: width, innerHeight: height } = window;
    const isMobile = width <= 768;
    
    let winWidth, winHeight, rightPos, bottomPos, borderRadius;
    
    if (isMobile) {
      // 移动设备：几乎全屏显示
      winWidth = width;
      winHeight = height; // 移动设备直接使用整个屏幕高度
      rightPos = '0';
      bottomPos = '0';
      borderRadius = '8px 8px 0 0';
    } else {
      // 桌面设备：最大高度不超过页面高度
      winWidth = Math.min(Math.max(400, width * 0.3), 500);
      // 设置最大高度为页面高度，减去底部距离
      const bottomSpacing = 30; // 底部间距
      winHeight = Math.min(Math.max(600, height * 0.7), height - bottomSpacing);
      rightPos = '30px';
      bottomPos = '30px';
      borderRadius = '6px';
    }
    
    chatWindowContainer.style.cssText = `
      position: fixed;
      right: ${rightPos};
      bottom: ${bottomPos};
      width: ${winWidth}px;
      height: ${winHeight}px;
      z-index: 999999;
      overflow: hidden;
      border-radius: ${borderRadius};
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      animation: slideUp 0.3s ease-out;
    `;
    
    // 为移动端添加动画关键帧
    if (isMobile) {
      let style = document.getElementById('chat-window-animation');
      if (!style) {
        style = document.createElement('style');
        style.id = 'chat-window-animation';
        style.textContent = `
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `;
        document.head.appendChild(style);
      }
    }
  };
  
  sizeWindow();
  window.addEventListener('resize', sizeWindow);
  
  // 添加元素到容器
  chatWindowContainer.appendChild(closeButton);
  chatWindowContainer.appendChild(iframeElement);
  document.body.appendChild(chatWindowContainer);
  
  // 设置iframe源
  iframeElement.src = 'https://chatbot.weixin.qq.com/webapp/VevUWQr6ZPRLtn0f8gdoJ4bYQI6EKv?isFloat=true&robotName=%E5%B0%8FV';
  
  // 监听iframe加载完成事件，2秒后隐藏loading遮罩
  iframeElement.onload = () => {
    setTimeout(() => {
      if (loadingMask && loadingMask.parentNode) {
        loadingMask.style.opacity = '0';
        setTimeout(() => {
          if (loadingMask.parentNode) {
            loadingMask.parentNode.removeChild(loadingMask);
          }
        }, 500); // 等待透明度动画完成后移除元素
      }
    }, 2000); // 页面加载完成后等待2秒消失
  };
  
  // 关闭按钮点击事件
  closeButton.addEventListener('click', () => {
    // 移除窗口
    if (chatWindowContainer && chatWindowContainer.parentNode) {
      chatWindowContainer.parentNode.removeChild(chatWindowContainer);
      // 移除事件监听器
      window.removeEventListener('resize', sizeWindow);
      // 重新创建按钮
      setTimeout(createChatButton, 100);
    }
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
        
        // 初始化微信客服悬浮窗
        initWechatChatbot();
      }, 100)
    }

    // 在应用卸载时清理资源
    const originalUnmount = app.unmount;
    app.unmount = function() {
      imageOptimizer.destroy();
      // 清理客服组件
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        if (chatWindowContainer && chatWindowContainer.parentNode) {
          chatWindowContainer.parentNode.removeChild(chatWindowContainer);
        }
        if (chatButton && chatButton.parentNode) {
          chatButton.parentNode.removeChild(chatButton);
        }
      }
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
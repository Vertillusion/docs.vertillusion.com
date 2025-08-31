// PWA安装工具 - 修复服务器端渲染时navigator未定义错误

// 存储变量
let deferredPrompt;
let installButton = null;

// 检查是否在浏览器环境中
function isBrowser() {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined';
}

// 初始化PWA功能（仅在浏览器环境中执行）
function initPWA() {
  if (!isBrowser()) return;
  
  // 注册Service Worker
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          
          // 监听更新事件
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (!installingWorker) return;
            
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // 新的内容已缓存，但用户需要刷新页面才能看到
                  console.log('New content is available; please refresh.');
                  showUpdateNotification();
                } else {
                  // 首次安装完成，内容已缓存
                  console.log('Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error('ServiceWorker registration failed: ', error);
        });
    
    // 页面加载后检查是否需要显示安装按钮
    setTimeout(checkAndShowInstallButton, 1000);
    });
  }
  
  // 添加PWA安装提示
  window.addEventListener('beforeinstallprompt', (e) => {
    // 阻止默认的安装提示
    e.preventDefault();
    // 保存事件，以便稍后触发
    deferredPrompt = e;
    
    // 显示安装按钮
    showInstallButton();
  });
  
  // 监听页面刷新或打开事件
  window.addEventListener('DOMContentLoaded', () => {
    checkAndShowInstallButton();
  });
}

// 检查是否可以安装PWA并显示按钮
function checkAndShowInstallButton() {
  if (!isBrowser()) return;
  
  // 只有在生产环境、不是独立模式且有deferredPrompt时才显示按钮
  if (process.env.NODE_ENV === 'production' && !isPwaInstalled() && deferredPrompt) {
    showInstallButton();
  }
}

// 创建并显示安装按钮
function showInstallButton() {
  if (!isBrowser() || installButton) return;
  
  try {
    // 创建安装按钮元素
    installButton = document.createElement('button');
    installButton.id = 'pwa-install-button';
    installButton.className = 'pwa-install-button';
    installButton.textContent = '安装到设备';
    installButton.title = '将此网站安装为应用';
    
    // 添加点击事件
    installButton.addEventListener('click', () => {
      triggerPwaInstall();
    });
    
    // 添加到页面
    if (document.body) {
      document.body.appendChild(installButton);
      
      // 确保按钮在几秒后可见
      setTimeout(() => {
        if (installButton) {
          installButton.style.opacity = '1';
        }
      }, 500);
    }
  } catch (error) {
    console.error('Failed to create install button:', error);
  }
}

// 隐藏安装按钮
function hideInstallButton() {
  if (!isBrowser() || !installButton) return;
  
  installButton.style.opacity = '0';
  setTimeout(() => {
    if (installButton && installButton.parentNode) {
      installButton.parentNode.removeChild(installButton);
      installButton = null;
    }
  }, 300);
}

// 显示更新通知
function showUpdateNotification() {
  if (!isBrowser()) return;
  
  // 检查是否已经有更新通知
  let updateNotification = document.getElementById('pwa-update-notification');
  if (updateNotification) return;
  
  try {
    // 创建更新通知元素
    updateNotification = document.createElement('div');
    updateNotification.id = 'pwa-update-notification';
    updateNotification.className = 'pwa-update-notification';
    updateNotification.innerHTML = `
      <p>有新版本可用！</p>
      <button id="pwa-refresh-button">立即刷新</button>
    `;
    
    // 添加刷新按钮点击事件
    const refreshButton = updateNotification.querySelector('#pwa-refresh-button');
    refreshButton.addEventListener('click', () => {
      window.location.reload();
    });
    
    // 添加到页面
    if (document.body) {
      document.body.appendChild(updateNotification);
    }
  } catch (error) {
    console.error('Failed to create update notification:', error);
  }
}

// 提供一个函数来手动触发安装提示
export function triggerPwaInstall() {
  if (!isBrowser() || !deferredPrompt) return;
  
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
      hideInstallButton();
    } else {
      console.log('User dismissed the A2HS prompt');
    }
    deferredPrompt = null;
  });
}

// 检查是否已安装PWA
export function isPwaInstalled() {
  if (!isBrowser()) return false;
  
  // 检查是否处于独立模式
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone ||
         document.referrer.includes('android-app://');
}

// 导出函数以便在其他地方使用
export { showInstallButton, hideInstallButton };

// 在模块加载时初始化（仅在浏览器环境中）
if (isBrowser()) {
  initPWA();
}
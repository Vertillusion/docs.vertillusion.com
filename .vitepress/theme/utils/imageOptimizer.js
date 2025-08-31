/**
 * 图片优化工具 - 处理图片懒加载和cookie缓存
 */

// 检查是否在浏览器环境中
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

// Cookie操作工具函数 - 仅在浏览器环境中可用
const CookieUtils = {
  // 设置Cookie，包含过期时间
  setCookie(name, value, days) {
    if (!isBrowser) return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
  },

  // 获取Cookie值
  getCookie(name) {
    if (!isBrowser) return null;
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  },

  // 检查Cookie是否存在且未过期
  isCookieValid(name) {
    if (!isBrowser) return false;
    return this.getCookie(name) !== null;
  }
};

// 图片缓存管理器
class ImageCacheManager {
  constructor() {
    this.cacheKey = 'imageCache';
    this.cacheDuration = 15; // 缓存15天
    this.cachedImages = {};
    if (isBrowser) {
      this.initCache();
    }
  }

  // 初始化缓存
  initCache() {
    if (!isBrowser) return;
    const cachedData = CookieUtils.getCookie(this.cacheKey);
    if (cachedData) {
      try {
        this.cachedImages = JSON.parse(cachedData);
      } catch (e) {
        console.warn('Failed to parse image cache data:', e);
        this.cachedImages = {};
      }
    }
  }

  // 保存缓存到Cookie
  saveCache() {
    if (!isBrowser) return;
    const cacheData = JSON.stringify(this.cachedImages);
    CookieUtils.setCookie(this.cacheKey, cacheData, this.cacheDuration);
  }

  // 添加图片到缓存
  cacheImage(url) {
    if (!isBrowser || this.cachedImages[url]) return;
    this.cachedImages[url] = new Date().getTime();
    this.saveCache();
  }

  // 检查图片是否已缓存
  isImageCached(url) {
    return !!this.cachedImages[url];
  }

  // 清理过期缓存
  cleanExpiredCache() {
    if (!isBrowser) return;
    const now = new Date().getTime();
    const expirationTime = this.cacheDuration * 24 * 60 * 60 * 1000;
    
    for (const url in this.cachedImages) {
      if (now - this.cachedImages[url] > expirationTime) {
        delete this.cachedImages[url];
      }
    }
    
    this.saveCache();
  }
}

// 图片懒加载管理器
class ImageLazyLoader {
  constructor() {
    this.observer = null;
    this.imageCacheManager = new ImageCacheManager();
  }

  // 初始化懒加载
  init() {
    if (!isBrowser) return;
    
    // 检查浏览器是否支持IntersectionObserver
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            this.observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '200px 0px', // 提前200px加载
        threshold: 0.1
      });
    }

    // 启动图片处理
    this.processImages();

    // 清理过期缓存
    this.imageCacheManager.cleanExpiredCache();
  }

  // 处理页面中的图片
  processImages() {
    if (!isBrowser) return;
    
    const images = document.querySelectorAll('img[src$=".png"], img[src$=".ico"]');
    
    images.forEach(img => {
      // 如果图片已经有loading属性，不重复处理
      if (img.getAttribute('loading') !== 'lazy') {
        // 设置loading属性为lazy
        img.setAttribute('loading', 'lazy');
        
        // 对于已缓存的图片，优先加载
        const imgUrl = img.src;
        if (this.imageCacheManager.isImageCached(imgUrl)) {
          // 已缓存的图片可以立即加载
          this.loadImage(img);
        } else if (this.observer) {
          // 未缓存的图片使用IntersectionObserver监听
          this.observer.observe(img);
        }
      }
    });
  }

  // 加载图片并缓存
  loadImage(img) {
    if (!isBrowser) return;
    
    const imgUrl = img.src;
    
    // 创建新图片对象预加载
    const tempImg = new Image();
    tempImg.onload = () => {
      // 图片加载成功后缓存
      this.imageCacheManager.cacheImage(imgUrl);
      
      // 如果图片有data-src属性，替换src
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      
      // 添加加载完成的类，用于动画效果
      img.classList.add('img-loaded');
    };
    
    // 设置图片源
    tempImg.src = imgUrl;
  }

  // 清理资源
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// 导出初始化函数
export function setupImageOptimization() {
  let imageLoader = null;
  
  // 初始化图片优化
  function init() {
    if (!isBrowser || imageLoader) return;
    
    imageLoader = new ImageLazyLoader();
    imageLoader.init();
  }
  
  // 页面更新时重新处理图片
  function updateImages() {
    if (!isBrowser || !imageLoader) return;
    
    imageLoader.processImages();
  }
  
  // 清理资源
  function destroy() {
    if (!isBrowser || !imageLoader) return;
    
    imageLoader.destroy();
    imageLoader = null;
  }
  
  return {
    init,
    updateImages,
    destroy
  };
}

export default setupImageOptimization;
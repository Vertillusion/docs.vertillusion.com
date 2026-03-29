/**
 * 图片优化工具 - 仅保留图片懒加载功能，移除缓存
 */

// 检查是否在浏览器环境中
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

// 图片懒加载管理器
class ImageLazyLoader {
  constructor() {
    this.observer = null;
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
        
        // 所有图片都通过IntersectionObserver监听，不使用缓存判断
        if (this.observer) {
          this.observer.observe(img);
        }
      }
    });
  }

  // 加载图片
  loadImage(img) {
    if (!isBrowser) return;
    
    const imgUrl = img.src;
    
    // 创建新图片对象预加载
    const tempImg = new Image();
    tempImg.onload = () => {
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
  return {
    init() {},
    updateImages() {},
    destroy() {}
  };
}

export default setupImageOptimization;
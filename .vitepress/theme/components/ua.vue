<!-- 私有化产品定制组件 -->

<template>
  <div class="unlockre-container">
    <button class="clear-cache-bar" @click="showUserInfo">
      <span class="action-text">BrowserInfo</span>
      <span class="warning-text">Show BrowserInfo</span>
    </button>
  </div>
</template>

<script setup>
// 全局错误数组，用于收集控制台错误信息
const consoleErrorLogs = [];
const MAX_ERRORS = 10; // 最多保存10条错误信息

// 初始化全局错误捕获机制
function initErrorCapture() {
  // 确保只在浏览器环境中执行
  if (typeof window === 'undefined') return;
  
  // 捕获全局JavaScript错误
  window.addEventListener('error', (event) => {
    const errorInfo = {
      type: 'JavaScript Error',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      timestamp: new Date().toISOString()
    };
    addError(errorInfo);
    // 不阻止默认行为，让错误继续在控制台显示
  }, true);

  // 捕获未处理的Promise拒绝
  window.addEventListener('unhandledrejection', (event) => {
    const errorInfo = {
      type: 'Unhandled Promise Rejection',
      message: event.reason?.message || String(event.reason),
      timestamp: new Date().toISOString()
    };
    addError(errorInfo);
  });

  // 重写console.error方法，捕获控制台错误
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const errorInfo = {
      type: 'Console Error',
      message: args.map(arg => 
        typeof arg === 'string' ? arg : 
        arg instanceof Error ? arg.message : 
        JSON.stringify(arg)
      ).join(' '),
      timestamp: new Date().toISOString()
    };
    addError(errorInfo);
    // 调用原始的console.error方法
    originalConsoleError.apply(console, args);
  };
}

// 添加错误到数组
function addError(errorInfo) {
  consoleErrorLogs.push(errorInfo);
  // 保持数组大小不超过MAX_ERRORS
  if (consoleErrorLogs.length > MAX_ERRORS) {
    consoleErrorLogs.shift(); // 移除最旧的错误
  }
}

// 确保只在浏览器客户端执行初始化
if (typeof window !== 'undefined') {
  // 初始化错误捕获
  initErrorCapture();
}

// 显示用户信息的函数
function showUserInfo() {
  // 确保只在浏览器环境中执行
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return;
  }
  
  try {
    // 获取用户Agent
    const userAgent = navigator.userAgent;
    
    // 获取浏览器内核版本（简化版）
    let kernelVersion = 'unknown';
    if (userAgent.includes('Chrome')) {
      kernelVersion = /Chrome\/(\d+\.\d+)/.exec(userAgent)?.[1] || 'unknown';
    } else if (userAgent.includes('Firefox')) {
      kernelVersion = /Firefox\/(\d+\.\d+)/.exec(userAgent)?.[1] || 'unknown';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      kernelVersion = /Version\/(\d+\.\d+)/.exec(userAgent)?.[1] || 'unknown';
    }
    
    // 获取当前时间
    const currentTime = new Date().toLocaleString();
    
    // 获取控制台错误信息
    let consoleErrors;
    if (consoleErrorLogs.length > 0) {
      // 格式化错误信息
      consoleErrors = consoleErrorLogs.map((error, index) => 
        `${index + 1}. ${error.type}: ${error.message}`
      ).join('; ');
    } else {
      consoleErrors = 'null'; // 无错误时显示null
    }
    
    // 组合信息，用英文分号分隔
    const info = `${userAgent};${kernelVersion};${currentTime};${consoleErrors}`;
    
    // 显示弹窗
    alert(info);
  } catch (error) {
    console.error('显示用户信息时出错:', error);
    alert('显示用户信息时发生错误');
  }
}
</script>

<style scoped>
.unlockre-container {
  width: 100%;
  margin: 20px 0;
}

.clear-cache-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  background-color: transparent;
  border: 1px solid #353535;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
}

.action-text {
  font-size: 14px;
  font-weight: 500;
  color: #ff4d4f;
}

.warning-text {
  font-size: 13px;
  color: #faad14;
  text-align: right;
}
</style>
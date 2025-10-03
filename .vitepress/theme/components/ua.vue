<template>
  <div class="unlockre-container">
    <button class="clear-cache-bar" @click="showUserInfo">
      <span class="action-text">BrowserInfo</span>
      <span class="warning-text">Show BrowserInfo</span>
    </button>
  </div>
</template>

<script setup>
// 显示用户信息的函数
function showUserInfo() {
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
    
    // 获取控制台错误信息（如果有的话）
    let consoleErrors = null;
    // 实际项目中，这里需要一个全局错误捕获机制来收集错误
    // 这里使用简化的方式
    
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
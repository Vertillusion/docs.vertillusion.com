<!-- 私有化产品定制组件 -->

<template>
  <div class="unlockre-container">
    <button class="clear-cache-bar" @click="handleButtonClick" :class="{ 'is-ready': isReadyToExecute }">
      <span class="action-text">{{ isReadyToExecute ? 'Execute' : 'BrowserInfo' }}</span>
      <select v-model="selectedSite" class="site-selector" :disabled="isReadyToExecute">
        <option value="vilinko">vilinko</option>
        <option value="docs">docs</option>
        <option value="lightframe">lightframe</option>
        <option value="lfs">lfs</option>
      </select>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 定义响应式数据
const selectedSite = ref('vilinko');
const isReadyToExecute = ref(false);

// 网站URL映射
const siteUrls = {
  vilinko: 'https://www.vilinko.com',
  docs: 'https://docs.vilinko.com',
  lightframe: 'https://lightframe.vilinko.com',
  lfs: 'https://lfs.vilinko.com'
};

// 按钮点击处理函数
function handleButtonClick() {
  if (isReadyToExecute.value) {
    // 第二次点击，执行实际操作
    showUserInfo();
    // 重置状态，允许重新选择
    isReadyToExecute.value = false;
  } else {
    // 第一次点击，准备执行
    isReadyToExecute.value = true;
  }
}

// 显示用户信息的函数
async function showUserInfo() {
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
    
    // 获取选中的网站URL
    const targetUrl = siteUrls[selectedSite.value];
    
    // 访问网站但不打开（使用fetch进行请求）
    let consoleErrors = null;
    try {
      // 使用fetch发送请求
      const response = await fetch(targetUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
        }
      });
      
      // 检查响应状态
      if (response.ok) {
        consoleErrors = `访问成功: ${targetUrl}, 状态码: ${response.status}`;
      } else {
        consoleErrors = `访问失败: ${targetUrl}, 状态码: ${response.status}`;
      }
    } catch (error) {
      consoleErrors = `访问异常: ${targetUrl}, 错误: ${error.message}`;
    }
    
    // 组合信息，用英文分号分隔
    const info = `${userAgent};${kernelVersion};${currentTime};${consoleErrors}`;
    
    // 显示弹窗
    alert(info);
  } catch (error) {
    console.error('显示用户信息时出错:', error);
    alert('显示用户信息时发生错误');
    // 出错时也要重置状态
    isReadyToExecute.value = false;
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
  transition: all 0.3s ease;
}

/* 准备执行状态的按钮样式 */
.clear-cache-bar:active,
.clear-cache-bar:focus {
  border-color: #1890ff;
}

.action-text {
  font-size: 14px;
  font-weight: 500;
  color: #ff4d4f;
}

/* 执行状态的文本颜色变化 */
.action-text,
.is-ready .action-text {
  font-size: 14px;
  font-weight: 500;
  color: #ff4d4f;
}

.is-ready .action-text {
  color: #52c41a;
}

.site-selector {
  font-size: 13px;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #ffffff;
  color: #333333;
  cursor: pointer;
}

.site-selector:focus {
  outline: none;
  border-color: #1890ff;
}

/* 禁用状态的选择器样式 */
.site-selector:disabled {
  background-color: #f5f5f5;
  color: #999999;
  cursor: not-allowed;
}
</style>
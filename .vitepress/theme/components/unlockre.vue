<template>
  <div class="unlockre-container">
    <button class="clear-cache-bar" @click="clearAllCaches">
      <span class="action-text">Clear Cookies</span>
      <span class="warning-text">Clear all cookies and LS</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 控制按钮显示状态（默认显示）
const showButton = ref(true)

// 清除所有缓存的函数
function clearAllCaches() {
  try {
    // 清除所有cookies
    clearAllCookies()
    
    // 清除localStorage
    localStorage.clear()
    
    // 清除sessionStorage
    sessionStorage.clear()
    
    // 显示成功提示
    console.log('所有缓存已清除')
    
    // 强制刷新并重定向到首页
    window.location.href = '/'
  } catch (error) {
    console.error('清除缓存时出错:', error)
    alert('清除缓存时发生错误，请重试')
  }
}

// 清除所有cookies的辅助函数
function clearAllCookies() {
  const cookies = document.cookie.split(';')
  
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim()
    
    // 设置过期时间为过去时间来删除cookie
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; secure`
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure`
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }
  
  // 清除可能影响页面缓存的特定cookies
  const specificCookies = ['vitepress-theme-cache', 'vitepress-cache', 'vue-router-cache', 'components-version', 'is-refreshing']
  specificCookies.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  })
}

// 组件挂载时的逻辑
onMounted(() => {
  // 按钮现在默认显示，无需键盘监听
})
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
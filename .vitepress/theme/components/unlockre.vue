<!-- 私有化产品定制组件 -->

<template>
  <div class="unlockre-container">
    <button class="clear-cache-bar" @click="showConfirmationDialog">
      <span class="action-text">Clear All Cache</span>
      <span class="warning-text">Remove all settings & cache</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 显示确认对话框
function showConfirmationDialog() {
  if (confirm('确定要清除所有缓存和个性化设置吗？这将重置所有本地保存的数据，页面将强制刷新。')) {
    clearAllCaches()
  }
}

// 清除所有缓存的函数
async function clearAllCaches() {
  try {
    // 1. 清除所有cookies
    clearAllCookies()
    
    // 2. 清除localStorage
    localStorage.clear()
    
    // 3. 清除sessionStorage
    sessionStorage.clear()
    
    // 4. 尝试清除IndexedDB (浏览器存储的结构化数据)
    await clearIndexedDB()
    
    // 5. 尝试清除ServiceWorker缓存
    await clearServiceWorkerCaches()
    
    // 6. 清除其他可能的缓存
    clearOtherStorage()
    
    console.log('所有缓存和个性化设置已清除')
    
    // 强制完全刷新页面，绕过缓存
    window.location.reload(true)
  } catch (error) {
    console.error('清除缓存时出错:', error)
    alert('清除部分缓存时发生错误，建议手动在浏览器设置中清除缓存。\n\n错误详情: ' + error.message)
  }
}

// 清除所有cookies的辅助函数
function clearAllCookies() {
  // 获取所有cookies
  const cookies = document.cookie.split(';')
  
  // 尝试多种方式删除cookie，确保跨域和子域cookie也被清除
  const cookieOptions = [
    `; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; secure; SameSite=None`,
    `; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname.split('.').slice(-2).join('.')}; secure; SameSite=None`,
    `; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; SameSite=None`,
    `; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  ]
  
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim()
    
    // 尝试所有cookie选项来确保删除
    cookieOptions.forEach(options => {
      document.cookie = `${name}=${options}`
    })
  }
  
  // 清除可能影响页面缓存的特定cookies
  const specificCookies = [
    'vitepress-theme-cache', 'vitepress-cache', 'vue-router-cache', 
    'components-version', 'is-refreshing', '_ga', '_gid', '_gat',
    'sessionid', 'csrf_token', 'user_prefs'
  ]
  
  specificCookies.forEach(cookieName => {
    cookieOptions.forEach(options => {
      document.cookie = `${cookieName}=${options}`
    })
  })
}

// 清除IndexedDB数据
async function clearIndexedDB() {
  // 检查浏览器是否支持IndexedDB
  if (!('indexedDB' in window)) {
    console.log('浏览器不支持IndexedDB，跳过此步骤')
    return
  }
  
  try {
    // 获取所有数据库名称（这在某些浏览器中可能受限）
    // 由于安全限制，我们只能列出部分可访问的数据库
    const dbsToClear = ['vitepress', 'vue', 'app-cache', 'user-settings']
    
    // 尝试删除每个数据库
    const deletePromises = dbsToClear.map(dbName => {
      return new Promise((resolve) => {
        const request = indexedDB.deleteDatabase(dbName)
        request.onsuccess = () => resolve()
        request.onerror = () => resolve() // 忽略不存在的数据库错误
        request.onblocked = () => {
          console.warn(`数据库 ${dbName} 被阻止删除，可能有其他连接正在使用`)
          resolve()
        }
      })
    })
    
    await Promise.all(deletePromises)
  } catch (error) {
    console.warn('清除IndexedDB时出错:', error)
  }
}

// 清除ServiceWorker缓存
async function clearServiceWorkerCaches() {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
      console.log('ServiceWorker缓存已清除')
    } catch (error) {
      console.warn('清除ServiceWorker缓存时出错:', error)
    }
  }
  
  // 尝试注销ServiceWorker
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        await registration.unregister()
      }
      console.log('ServiceWorker已注销')
    } catch (error) {
      console.warn('注销ServiceWorker时出错:', error)
    }
  }
}

// 清除其他可能的存储
function clearOtherStorage() {
  // 清除webSQL（如果可用）
  if (window.openDatabase) {
    try {
      // WebSQL没有标准的清除方法，我们只能尝试删除已知的数据库
      // 这通常不工作，但尝试一下
      console.log('WebSQL缓存可能需要手动清除')
    } catch (error) {
      console.warn('尝试清除WebSQL时出错:', error)
    }
  }
  
  // 清除应用缓存（如果可用）
  if (window.applicationCache && window.applicationCache.update) {
    try {
      window.applicationCache.update()
    } catch (error) {
      console.warn('更新应用缓存时出错:', error)
    }
  }
}

// 组件挂载时的逻辑
onMounted(() => {
  // 可以在这里添加初始化逻辑
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
  transition: all 0.3s ease;
}

.clear-cache-bar:hover {
  background-color: rgba(255, 77, 79, 0.1);
  border-color: #ff4d4f;
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
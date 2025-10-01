---
layout: home

hero:
  name: "Vilinko Studio"
  text: "文档"

  actions:
    - theme: brand
      text: 常见问题
      link: /support/qa.md
    - theme: alt
      text: 赞助者列表
      link: /docs/data/sponsor.md

features:
  - icon:
      dark: https://lightframe.vilinko.com/lightframe_dark.ico
      light: https://lightframe.vilinko.com/favicon.ico
    title: LightFrame
    details: 完全免费、由每一个用户支持、面向用户的轻量级创作型桌面优化应用程序。
    link: /docs/lightframe/index
    linkText: 查看文档
  - icon: 
      dark: ../vuip.ico
      light: ../vuip.ico
    title: Vui.Parser
    details: 简易、开源、轻量的数据解析器。
    link: /docs/vui.parser/index
    linkText: 查看文档
  - icon: 
      dark: ../uni.ico
      light: ../uni.ico
    title: Vilinko Universe
    details: 在 Vilinko Universe 发现、下载、启动、更新属于你和 Vilinko 的项目。
    link: /docs/universe/index
    linkText: 查看文档
  - icon: 
      dark: ../vina.ico
      light: ../vina.ico
    title: Vina UI
    details: 一个简洁轻量的 UI 基础框架。
    link: /docs/vinaui/index
    linkText: 查看文档
---

<script setup>
import { ref, onMounted } from 'vue'

// 配置字段：控制弹窗是否显示（true显示，false隐藏）
const showNationalDayAlert = true

onMounted(() => {
  // 清除可能导致缓存问题的cookies
  clearCacheCookies();
  
  // 检测components文件夹更新并强制刷新缓存
  checkComponentsUpdate();
  
  // 只有当配置为显示时才执行自动关闭逻辑
  if (showNationalDayAlert) {
    setTimeout(() => {
      const alerts = document.querySelectorAll('.top-alert')
      alerts.forEach(alert => {
        alert.style.opacity = '0'
        setTimeout(() => {
          alert.style.display = 'none'
        }, 300)
      })
    }, 5000)
  }
})

// 清除缓存相关的cookies
function clearCacheCookies() {
  // 清除可能影响页面缓存的cookies
  const cookiesToClear = ['vitepress-theme-cache', 'vitepress-cache', 'vue-router-cache'];
  
  cookiesToClear.forEach(cookieName => {
    // 设置过期时间为过去时间来删除cookie
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
  
  // 确保页面不使用缓存
  window.addEventListener('beforeunload', () => {
    // 移除可能的缓存标识
    localStorage.removeItem('vitepress-last-visit');
  });
}

// 检测components文件夹更新并强制刷新
function checkComponentsUpdate() {
  // 检查是否已经在刷新过程中，避免重复刷新
  if (localStorage.getItem('is-refreshing')) {
    // 如果标记存在，清除它并退出函数
    localStorage.removeItem('is-refreshing');
    return;
  }
  
  // 这里我们使用一个简单的版本号机制来检测组件更新
  const currentComponentsVersion = '1.0.1'; // 当components文件夹更新时，需要手动更新此版本号
  const storedVersion = localStorage.getItem('components-version');
  
  // 如果版本不匹配，强制刷新页面
  if (storedVersion !== currentComponentsVersion) {
    // 设置刷新标记
    localStorage.setItem('is-refreshing', 'true');
    // 更新存储的版本
    localStorage.setItem('components-version', currentComponentsVersion);
    
    // 强制刷新页面以加载最新内容
    setTimeout(() => {
      window.location.reload(true); // true参数表示强制从服务器加载，不使用缓存
    }, 500); // 增加一点延迟，确保标记有时间保存
  }
}
</script>

<!-- 使用条件渲染控制弹窗显示 -->
<div v-if="showNationalDayAlert">
  <n-alert message="国庆节快乐" type="info" show-icon class="top-alert" id="alert1" />
  <n-alert 
      message="国庆节快乐"
      description="祝大家国庆节快乐！感谢您一直以来对Vilinko Studio的支持，我们将继续为您提供优质的软件产品和服务。"
      type="info" 
      show-icon 
      class="top-alert"
      id="alert2"
  />
</div>
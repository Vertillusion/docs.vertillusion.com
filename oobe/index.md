---
layout: home

hero:
  name: ""
  text: "用户引导"
  tagline: "快速了解我们所提供服务的使用方法"

features:
  - icon:
      dark: https://lightframe.vilinko.com/lightframe_dark.ico
      light: https://lightframe.vilinko.com/favicon.ico
    title: LightFrame
    details: 完全免费、由每一个用户支持、面向用户的轻量级创作型桌面优化应用程序。
    link: /oobe/lightframe/index
    linkText: 开始
  - icon: 
      dark: ../vuip.ico
      light: ../vuip.ico
    title: Vui.Parser
    details: 简易、开源、轻量的数据解析器。
#    link: /docs/vui.parser/index
    linkText: 暂无引导内容可用，敬请期待
  - icon: 
      dark: ../uni.ico
      light: ../uni.ico
    title: Vilinko Universe
    details: 在 Vilinko Universe 发现、下载、启动、更新属于你和 Vilinko 的项目。
#    link: /docs/universe/index
    linkText: 暂无引导内容可用，敬请期待
#  - icon: 
#      dark: ../vina.ico
#      light: ../vina.ico
#    title: Vina UI
#    details: 一个简洁轻量的 UI 基础框架。
#    link: /docs/vinaui/index
#    linkText: 暂无引导内容可用，敬请期待
---

<script setup>
import { ref, onMounted } from 'vue'

const showNationalDayAlert = true

onMounted(() => {
  clearCacheCookies();
  checkComponentsUpdate();
  
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

function clearCacheCookies() {
  // 移除所有缓存相关的cookie
  const cookiesToClear = ['vitepress-theme-cache', 'vitepress-cache', 'vue-router-cache'];
  
  cookiesToClear.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
}

function checkComponentsUpdate() {
  // 移除版本控制和强制刷新逻辑，确保每次加载都是最新内容
  // 不再使用localStorage存储版本信息
}
</script>

<div v-if="showNationalDayAlert">
  <n-alert message="页面暂无翻译" type="warning" show-icon class="top-alert" id="alert1" />
  <n-alert 
      message="This page is not translated yet."
      description="This page is not translated yet. We will complete it as soon as possible."
      type="warning" 
      show-icon 
      class="top-alert"
      id="alert2"
  />
</div>
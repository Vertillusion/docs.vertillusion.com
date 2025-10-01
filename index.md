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
</script>

<!-- 使用条件渲染控制弹窗显示 -->
<div v-if="showNationalDayAlert">
  <n-alert message="国庆节快乐" type="info" :border="false" show-icon class="top-alert" id="alert1" />
  <n-alert 
      message="国庆节快乐" 
      :border="false"
      description="祝大家国庆节快乐！感谢您一直以来对Vilinko Studio的支持，我们将继续为您提供优质的软件产品和服务。"
      type="info" 
      show-icon 
      class="top-alert"
      id="alert2"
  />
</div>
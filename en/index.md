---
layout: home

hero:
  name: "Vilinko Studio"
  text: "Documentation"

  actions:
    - theme: brand
      text: Common Questions
      link: /support/qa.md
    - theme: alt
      text: Sponsor List
      link: /docs/data/sponsor.md
    - theme: alt
      text: Quick Service
      link: /en/docs/quick_service/index

features:
  - icon:
      dark: https://lightframe.vilinko.com/lightframe_dark.ico
      light: https://lightframe.vilinko.com/favicon.ico
    title: LightFrame
    details: Completely free, supported by every user, a lightweight desktop optimization application for users.
    link: /en/docs/lightframe/index
    linkText: View Documentation
  - icon: 
      dark: ../vuip.ico
      light: ../vuip.ico
    title: Vui.Parser
    details: A simple parser written for VinaUI.
    link: /en/docs/vui.parser/index
    linkText: View Documentation
  - icon: 
      dark: ../uni.ico
      light: ../uni.ico
    title: Vilinko Universe
    details: Find, download, start, and update projects belonging to you and Vilinko.
    link: /en/docs/universe/index
    linkText: View Documentation
  - icon:
      dark: ../vina.ico
      light: ../vina.ico
    title: Vina UI
    details: A UI foundation that simple and light.
    link: /en/docs/vinaui/index
    linkText: View Documentation
---

<script setup>
import { ref, onMounted } from 'vue'

const showNationalDayAlert = false

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
  const cookiesToClear = ['vitepress-theme-cache', 'vitepress-cache', 'vue-router-cache'];
  
  cookiesToClear.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
  
  window.addEventListener('beforeunload', () => {
    localStorage.removeItem('vitepress-last-visit');
  });
}

function checkComponentsUpdate() {
  if (localStorage.getItem('is-refreshing')) {
    localStorage.removeItem('is-refreshing');
    return;
  }
  
  const currentComponentsVersion = '1.0.1';
  const storedVersion = localStorage.getItem('components-version');
  
  if (storedVersion !== currentComponentsVersion) {
    localStorage.setItem('is-refreshing', 'true');
    localStorage.setItem('components-version', currentComponentsVersion);
    
    setTimeout(() => {
      window.location.reload(true);
    }, 500);
  }
}
</script>

<div v-if="showNationalDayAlert">
  <n-alert message="Happy National Day!" type="info" :border="false" show-icon class="top-alert" id="alert1" />
  <n-alert 
      message="Happy National Day!" 
      :border="false"
      description="Wishing you a joyous and happy National Day! Thank you for your continued support of Vilinko Studio. We will continue to provide you with excellent software and services."
      type="info" 
      show-icon 
      class="top-alert"
      id="alert2"
  />
</div>
<!-- 私有化产品定制组件 -->

<template>
  <div class="login-container">
    <div v-if="!isAuthenticated" class="login-form">
      <h1>🔒</h1>
      <br></br>
      <input
        v-model="password"
        type="password"
        placeholder="请输入授权码"
        @keyup.enter="checkPassword"
        class="password-input"
        ref="passwordInput"
      />
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
    <div v-else ref="contentWrapper" class="content-wrapper">
      <slot></slot>
    </div>
    <div class="content-for-search" aria-hidden="true">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      password: '',
      isAuthenticated: false,
      errorMessage: ''
    };
  },
  mounted() {
    // 组件挂载后自动聚焦到输入框
    this.$refs.passwordInput?.focus();
  },
  methods: {
    checkPassword() {
      // 验证密码是否正确
      if (this.password === 'vilinkostudio') {
        this.isAuthenticated = true;
        this.errorMessage = '';
        // 滚动到内容区域
        setTimeout(() => {
          this.$refs.contentWrapper?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        this.errorMessage = '该文档内容需使用授权码查阅，可尝试联系相关人员或通过在线提单的方式申请权限。';
        this.password = '';
        // 清空输入框并重新聚焦
        this.$refs.passwordInput?.focus();
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  width: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

.login-form {
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-form h1 {
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.password-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.password-input:focus {
  outline: none;
  border-color: #5c83ff;
  border-radius: 24px;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.error-message {
  color: #f56c6c;
  margin-top: 10px;
  font-size: 14px;
}

.content-wrapper {
  width: 100%;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 此样式确保内容可被搜索但对用户不可见 */
.content-for-search {
  position: absolute !important;
  left: -9999px !important;
  top: -9999px !important;
  width: 1px !important;
  height: 1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  opacity: 0 !important;
  pointer-events: none !important;
  white-space: nowrap !important;
}
</style>
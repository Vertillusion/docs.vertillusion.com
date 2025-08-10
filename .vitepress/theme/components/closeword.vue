<template>
  <span class="closeword">
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 'Closeword',
  // 这个组件会将内容隐藏但保留在DOM中，使其可被搜索
}
</script>

<style scoped>
.closeword {
  /* 设置极小字体大小，肉眼几乎不可见但保持显示 */
  font-size: 0.1px;
  opacity: 0.01;
  line-height: 0.1;
  /* 确保文本不会被选中或高亮 */
  user-select: none;
  pointer-events: none;
  /* 确保元素不占据空间 */
  display: inline-block;
}
</style>
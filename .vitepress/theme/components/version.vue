<script setup>
import { ref, defineProps } from 'vue'
import versionData from '../../../support/version.json'

// 定义组件属性
defineProps({
  // 用于中文显示的模块编号
  num: {
    type: String,
    default: ''
  },
  // 用于英文显示的模块编号
  enNum: {
    type: String,
    default: ''
  }
})

// 存储模块数据
const modules = ref(versionData)

// 根据 num 获取对应的模块信息
const getModuleByNum = (num) => {
  return modules.value.find(module => module.num === num)
}
</script>

<template>
  <component>
    <!-- 当使用组件包裹时，这里可以显示处理后的内容 -->
    <slot v-if="$slots.default" />
    <!-- 直接使用组件时，显示指定num的模块信息 -->
    <template v-else-if="num">
      <template v-if="getModuleByNum(num)">
        {{ getModuleByNum(num).name }} 的版本为 {{ getModuleByNum(num).version }}
      </template>
      <template v-else>
        未找到编号为 {{ num }} 的模块
      </template>
    </template>
    <!-- 直接使用组件时，显示指定en_num的英文模块信息 -->
    <template v-else-if="enNum">
      <template v-if="getModuleByNum(enNum)">
        {{ getModuleByNum(enNum).name }} version is {{ getModuleByNum(enNum).version }}
      </template>
      <template v-else>
        Module with number {{ enNum }} not found
      </template>
    </template>
  </component>
</template>

<script>
import { defineComponent } from 'vue'
import versionData from '../../../support/version.json'

// 英文标签组件
const EnNumComponent = defineComponent({
  props: {
    num: {
      type: String,
      default: ''
    }
  },
  computed: {
    moduleInfo() {
      const num = this.num || this.$slots.default?.()[0]?.textContent?.trim() || ''
      return versionData.find(m => m.num === num)
    }
  },
  render() {
    if (this.moduleInfo) {
      return this.$createTextVNode(`${this.moduleInfo.name} version is ${this.moduleInfo.version}`)
    } else {
      const num = this.num || this.$slots.default?.()[0]?.textContent?.trim() || ''
      return this.$createTextVNode(`Module with number ${num} not found`)
    }
  }
})

// 导出英文标签组件
export { EnNumComponent }

// 这个函数将被导出并在 theme/index.js 中使用
// 用于处理 Markdown 文件中的 <num> 和 <en_num> 标签
export function processNumTags() {
  try {
    console.log('开始处理标签...');
    
    // 查找并处理所有 <num> 标签（中文输出）
    const numElements = document.querySelectorAll('num');
    console.log(`找到 ${numElements.length} 个 <num> 标签`);
    
    numElements.forEach(element => {
      const num = element.textContent.trim();
      const module = versionData.find(m => m.num === num);
      
      if (module) {
        // 创建新的文本节点替换标签（中文格式）
        const textNode = document.createTextNode(`${module.name} 的版本为 ${module.version}`);
        element.parentNode.replaceChild(textNode, element);
      } else {
        // 未找到对应模块时的处理（中文提示）
        const textNode = document.createTextNode(`未找到编号为 ${num} 的模块`);
        element.parentNode.replaceChild(textNode, element);
      }
    });
    
    // 查找并处理所有 <en_num> 标签（英文输出）
    // 使用更通用的选择器，确保能找到所有可能的标签格式
    const enNumElements = document.querySelectorAll('en_num, [tag="en_num"]');
    console.log(`找到 ${enNumElements.length} 个 <en_num> 标签`);
    
    enNumElements.forEach(element => {
      const num = element.textContent.trim();
      const module = versionData.find(m => m.num === num);
      
      if (module) {
        // 创建新的文本节点替换标签（英文格式）
        const textNode = document.createTextNode(`${module.name} version is ${module.version}`);
        element.parentNode.replaceChild(textNode, element);
      } else {
        // 未找到对应模块时的处理（英文提示）
        const textNode = document.createTextNode(`Module with number ${num} not found`);
        element.parentNode.replaceChild(textNode, element);
      }
    });
    
    console.log('标签处理完成');
  } catch (err) {
    console.error('处理标签时出错:', err);
  }
}</script>

<style scoped>
/* 简化样式，因为不再需要加载和错误状态显示 */
</style>
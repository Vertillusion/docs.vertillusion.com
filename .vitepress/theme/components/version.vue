<script setup>
import { ref, defineProps } from 'vue'
import versionData from '../../../support/version.json'

const props = defineProps({
  num: {
    type: String,
    default: ''
  },
  enNum: {
    type: String,
    default: ''
  }
})

const modules = ref(versionData)

const getModuleByNum = (num) => {
  return modules.value.find(module => module.num === num)
}
</script>

<template>
  <component>
    <slot v-if="$slots.default" />
    <template v-else-if="props.num">
      <template v-if="getModuleByNum(props.num)">
        {{ getModuleByNum(props.num).name }} 的版本为 {{ getModuleByNum(props.num).version }}
      </template>
      <template v-else>
        未找到编号为 {{ props.num }} 的模块
      </template>
    </template>
    <template v-else-if="props.enNum">
      <template v-if="getModuleByNum(props.enNum)">
        {{ getModuleByNum(props.enNum).name }} version is {{ getModuleByNum(props.enNum).version }}
      </template>
      <template v-else>
        Module with number {{ props.enNum }} not found
      </template>
    </template>
  </component>
</template>

<script>
import { defineComponent } from 'vue'
import versionData from '../../../support/version.json'

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

export { EnNumComponent }

export function processNumTags() {
  try {
    // 处理中文标签
    const numElements = document.querySelectorAll('num');
    numElements.forEach(element => {
      const num = element.textContent.trim();
      const module = versionData.find(m => m.num === num);
      const textNode = document.createTextNode(module ? 
        `${module.name} 的版本为 ${module.version}` : 
        `未找到编号为 ${num} 的模块`
      );
      element.parentNode.replaceChild(textNode, element);
    });
    
    // 处理英文标签
    const enNumElements = document.querySelectorAll('en_num, [tag="en_num"]');
    enNumElements.forEach(element => {
      const num = element.textContent.trim();
      const module = versionData.find(m => m.num === num);
      const textNode = document.createTextNode(module ? 
        `${module.name} version is ${module.version}` : 
        `Module with number ${num} not found`
      );
      element.parentNode.replaceChild(textNode, element);
    });
  } catch (err) {
    console.error('处理标签时出错:', err);
  }
}
</script>

<style scoped>
</style>
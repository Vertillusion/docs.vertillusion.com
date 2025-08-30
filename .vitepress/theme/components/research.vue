<script>
import { defineComponent } from 'vue'
import researchData from '../../../support/research.json'

// 这个函数将被导出并在 theme/index.js 中使用
// 用于处理 Markdown 文件中的 <research> 标签
export function processResearchTags() {
  try {
    // 查找并处理所有 <research> 标签（中文输出）
    const researchElements = document.querySelectorAll('research');
    
    researchElements.forEach(element => {
      const n = element.textContent.trim();
      const research = researchData.find(r => r.n === n);
      
      if (research) {
        // 如果 status 是 'open'，显示正常内容；否则显示一个空格
        if (research.status === 'open') {
          // 创建一个容器来放置文本和链接
          const container = document.createElement('span');
          
          // 添加开头文本
          const startText = document.createTextNode(`数据调研中心正在进行 ${research.name} ，如果您有时间，欢迎帮助我们优化相关产品。`);
          container.appendChild(startText);
          
          // 添加链接（如果有）
          if (research.links) {
            container.appendChild(document.createTextNode(' '));
            const link = document.createElement('a');
            link.href = research.links;
            link.textContent = '前往调研中心';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            container.appendChild(link);
          }
          
          element.parentNode.replaceChild(container, element);
        } else {
          // 不是 open 状态，显示一个空格
          const spaceNode = document.createTextNode(' ');
          element.parentNode.replaceChild(spaceNode, element);
        }
      } else {
        // 未找到对应调研项目时的处理（中文提示）
        const textNode = document.createTextNode(`未找到调研项目 #${n}`);
        element.parentNode.replaceChild(textNode, element);
      }
    });
  } catch (err) {
    console.error('处理research标签时出错:', err);
  }
}

// 定义组件以便在非script setup环境中使用
const ResearchComponent = defineComponent({
  props: {
    n: {
      type: String,
      default: ''
    }
  },
  computed: {
    researchInfo() {
      const n = this.n || this.$slots.default?.()[0]?.textContent?.trim() || ''
      return researchData.find(r => r.n === n)
    }
  },
  render() {
    if (this.researchInfo) {
      // 如果 status 是 'open'，显示正常内容；否则显示一个空格
      if (this.researchInfo.status === 'open') {
        // 创建一个容器
        const container = this.$createElement('span', [
          // 添加开头文本
          this.$createTextVNode(`数据调研中心正在进行 ${this.researchInfo.name} ，如果您有时间，欢迎帮助我们优化相关产品。`)
        ]);
        
        // 添加链接（如果有）
        if (this.researchInfo.links) {
          container.children.push(this.$createTextVNode(' '));
          container.children.push(this.$createElement('a', {
            attrs: {
              href: this.researchInfo.links,
              target: '_blank',
              rel: 'noopener noreferrer'
            }
          }, '前往调研中心'));
        }
        
        return container;
      } else {
        // 不是 open 状态，显示一个空格
        return this.$createTextVNode(' ')
      }
    } else {
      const n = this.n || this.$slots.default?.()[0]?.textContent?.trim() || ''
      return this.$createTextVNode(`未找到调研项目 #${n}`)
    }
  }
})

export default ResearchComponent;
</script>
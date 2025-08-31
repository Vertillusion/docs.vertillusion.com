<script>
import { defineComponent } from 'vue'
import researchData from '../../../support/research.json'

export function processResearchTags() {
  try {
    // 检查是否在浏览器环境中
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    
    const researchElements = document.querySelectorAll('research');
    
    researchElements.forEach(element => {
      const n = element.textContent.trim();
      const research = researchData.find(r => r.n === n);
      
      if (research) {
        if (research.status === 'open') {
          const container = document.createElement('span');
          
          const startText = document.createTextNode(`数据调研中心正在进行 ${research.name} ，如果您有时间，欢迎帮助我们优化相关产品。`);
          container.appendChild(startText);
          
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
          const spaceNode = document.createTextNode(' ');
          element.parentNode.replaceChild(spaceNode, element);
        }
      } else {
        const textNode = document.createTextNode(`未找到调研项目 #${n}`);
        element.parentNode.replaceChild(textNode, element);
      }
    });
  } catch (err) {
    console.error('处理research标签时出错:', err);
  }
}

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
      if (this.researchInfo.status === 'open') {
        const container = this.$createElement('span', [
          this.$createTextVNode(`数据调研中心正在进行 ${this.researchInfo.name} ，如果您有时间，欢迎帮助我们优化相关产品。`)
        ]);
        
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
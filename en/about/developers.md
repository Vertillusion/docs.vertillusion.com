---
layout: page
---
<script>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme'

export default {
  components: {
    VPTeamPage,
    VPTeamMembers
  },
  data() {
    return {
      members: [
        {
          avatar: 'https://avatars.githubusercontent.com/u/48214360',
          name: '沫海CimiMoly',
          title: '这个人很高冷',
          links: [
            { icon: 'github', link: 'https://github.com/EnderMo' },
          ]
        },
        {
          avatar: 'https://avatars.githubusercontent.com/u/119720365',
          name: '悠笙iYoRoy',
          title: '这个人很高冷',
          links: [
            { icon: 'github', link: 'https://github.com/KaguraiYoRoy' },
          ]
        },
        {
          avatar: 'https://avatars.githubusercontent.com/u/61569726',
          name: '辰落火辉Haceau-Zoac',
          title: '平和 坚韧 不悲伤',
          links: [
            { icon: 'github', link: 'https://github.com/Haceau-Zoac' },
          ]
        },
        {
          avatar: 'https://avatars.githubusercontent.com/u/47657299',
          name: 'telecomadm1145',
          title: '这个人很高冷',
          links: [
            { icon: 'github', link: 'https://github.com/telecomadm1145' },
          ]
        },
        {
          avatar: 'https://avatars.githubusercontent.com/u/52279718',
          name: 'Fuwaki',
          title: '允许404，但永不驻足，在堆栈深处，听见花开的声音',
          links: [
            { icon: 'github', link: 'https://github.com/Fuwaki' },

          ]
        },
        {
          avatar: 'https://avatars.githubusercontent.com/u/62087089',
          name: 'xihale',
          title: '冥冥觉无物，历历使相生',
          links: [
            { icon: 'github', link: 'https://github.com/xihale' },
          ]
        },
        {
          avatar: 'https://raw.githubusercontent.com/VilinkoStudio/docs.vilinko.com/refs/heads/source/img/baic.png',
          name: '白菜',
          title: '血火锻诗脊作梁，霜刃裂史字凝伤。碑碣崩星溅寒句，九回肠铸万古芒。',
          links: [
            { icon: 'github', link: 'http://www.cabbage-white.top' },
          ]
        },
        {
          avatar: 'https://avatars.githubusercontent.com/u/107689645',
          name: '魔影酱 Ender',
          title: '如果我们都迷路了，那就到月亮上相见吧',
          links: [
            { icon: 'github', link: 'https://github.com/Ender-Cell' },
          ]
        },
        {
          avatar: 'https://avatars.githubusercontent.com/u/39179150',
          name: '坨坨总是吃不上饭',
          title: '在幻想中碰撞出熠熠生辉的焰火，照亮无垠的星辰大海！',
          links: [
            { icon: 'github', link: 'https://github.com/ThalliumASH' },
          ]
        },
        {
          avatar: 'https://avatars.githubusercontent.com/u/69663231',
          name: 'SlimeNull',
          title: '这个人很高冷',
          links: [
            { icon: 'github', link: 'https://github.com/SlimeNull' },
          ]
        },
        {
          avatar: 'https://avatars.githubusercontent.com/u/209813028',
          name: 'Yuyudifiesh',
          title: '霞光尽处，秧海连天',
          links: [
            { icon: 'github', link: 'https://github.com/yuyudifiesh' },
          ]
        },
      ]
    }
  }
}
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>Developers</template>
    <template #subtitle>Meet the amazing people behind Vilinko Studio</template>
  </VPTeamPageTitle>
  <VPTeamMembers
    :members="members"
    :size="'small'"
  />
</VPTeamPage>
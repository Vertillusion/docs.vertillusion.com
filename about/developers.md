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
          title: '个性签名',
          links: [
            { icon: 'github', link: 'https://github.com/EnderMo' },
          ]
        },
        {
          avatar: 'https://avatars.githubusercontent.com/u/119720365',
          name: '悠笙iYoRoy',
          title: '个性签名',
          links: [
            { icon: 'github', link: 'https://github.com/KaguraiYoRoy' },
          ]
        },
        {
          avatar: 'https://avatars.githubusercontent.com/u/61569726',
          name: '辰落火辉Haceau-Zoac',
          title: '个性签名',
          links: [
            { icon: 'github', link: 'https://github.com/Haceau-Zoac' },
          ]
        },
        {
          avatar: 'https://avatars.githubusercontent.com/u/47657299',
          name: 'telecomadm1145',
          title: '个性签名',
          links: [
            { icon: 'github', link: 'https://github.com/telecomadm1145' },
          ]
        },
        {
          avatar: 'https://avatars.githubusercontent.com/u/52279718',
          name: 'Fuwaki',
          title: '个性签名',
          links: [
            { icon: 'github', link: 'https://github.com/Fuwaki' },

          ]
        },
        {
          avatar: 'https://avatars.githubusercontent.com/u/62087089',
          name: 'xihale',
          title: '个性签名',
          links: [
            { icon: 'github', link: 'https://github.com/xihale' },
          ]
        },
        {
          avatar: '',
          name: '',
          title: '个性签名',
          links: [
            { icon: 'github', link: 'https://github.com/yyx990803' },
          ]
        },
        {
          avatar: '',
          name: '',
          title: '个性签名',
          links: [
            { icon: 'github', link: 'https://github.com/yyx990803' },
          ]
        },
        {
          avatar: '',
          name: '',
          title: '个性签名',
          links: [
            { icon: 'github', link: 'https://github.com/yyx990803' },
          ]
        },
      ]
    }
  }
}
</script>

<VPTeamPage>
  <VPTeamMembers
    :members="members"
  />
</VPTeamPage>
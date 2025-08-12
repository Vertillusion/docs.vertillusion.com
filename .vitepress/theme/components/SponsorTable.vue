<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useStorage } from '@vueuse/core'

// 定义API响应类型
interface SponsorResponse {
  code: number
  data: {
    date: string
    sponsors: string[]
    type: string
  }
  message: string
}

// 状态管理
const sponsors = ref<string[]>([])
const lastFetchDate = useStorage<Date | null>('lastFetchDate', null)
const isLoading = ref(false)
const error = ref<string | null>(null)

// 从API获取赞助者数据
const fetchSponsors = async () => {
  // 检查是否需要获取新数据（每15天一次）
  const now = new Date()
  if (lastFetchDate.value) {
    const diffTime = now.getTime() - lastFetchDate.value.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    if (diffDays < 15) {
      console.log('数据未过期，使用缓存数据')
      return
    }
  }

  isLoading.value = true
  error.value = null

  try {
    const response = await fetch('https://api.vilinko.com/sponsors/all')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: SponsorResponse = await response.json()
    if (data.code === 200) {
      sponsors.value = data.data.sponsors
      lastFetchDate.value = now
      console.log('数据获取成功')
    } else {
      throw new Error(`API error! message: ${data.message}`)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取数据失败'
    console.error('获取数据失败:', err)
  } finally {
    isLoading.value = false
  }
}

// 将赞助者数据转换为两列数组
const getTwoColumnData = () => {
  const twoColumnData: string[][] = []
  const midIndex = Math.ceil(sponsors.value.length / 2)

  for (let i = 0; i < midIndex; i++) {
    const row: string[] = []
    row.push(sponsors.value[i] || '')
    if (i + midIndex < sponsors.value.length) {
      row.push(sponsors.value[i + midIndex] || '')
    } else {
      row.push('')
    }
    twoColumnData.push(row)
  }

  return twoColumnData
}

// 在组件挂载时获取数据
onMounted(() => {
  fetchSponsors()
})

// 提供给父组件的方法
defineExpose({
  fetchSponsors,
  getTwoColumnData
})
</script>

<template>
  <div class="sponsor-table-container">
    <h3>赞助者列表</h3>
    
    <div v-if="isLoading" class="loading">
      加载中...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <table v-else-if="sponsors.length > 0" class="sponsor-table">
      <thead>
        <tr>
          <th>赞助者名称</th>
          <th>赞助者名称</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in getTwoColumnData()" :key="index">
          <td v-for="(name, colIndex) in row" :key="colIndex">
            {{ name }}
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else class="no-data">
      暂无赞助者数据
    </p>

    <p class="update-info" v-if="lastFetchDate">
      数据最后更新时间: {{ lastFetchDate.toLocaleDateString() }}
    </p>
  </div>
</template>

<style scoped>
.sponsor-table-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.sponsor-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.sponsor-table th,
.sponsor-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.sponsor-table th {
  background-color: var(--vp-c-bg-soft);
  font-weight: 600;
}

.sponsor-table tr:hover {
  background-color: #f5f5f5;
}

.loading,
.error,
.no-data {
  padding: 20px;
  text-align: center;
}

.error {
  color: var(--vp-c-danger);
}

.update-info {
  text-align: right;
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-top: 10px;
}
</style>
<script setup lang="ts">
import { ref, watch, onMounted, Ref, UnwrapRef } from 'vue'
// 使用localStorage替代@vueuse/core的useStorage，增加Date类型特殊处理
// isDateType: 标识该值是否应该被视为Date类型处理
const useStorage = <T>(key: string, defaultValue: T, isDateType = false): Ref<T> => {
  const storedValue = localStorage.getItem(key)
  let initialValue: T

  if (storedValue) {
    try {
      // 尝试解析存储的值
      const parsed = JSON.parse(storedValue)
      // 特殊处理Date类型
      if (isDateType && typeof parsed === 'string') {
        // 即使defaultValue是null，只要指定了isDateType为true，也按Date类型处理
        initialValue = new Date(parsed) as unknown as T
      } else {
        initialValue = parsed as T
      }
    } catch (error) {
      console.error('解析localStorage数据失败:', error)
      initialValue = defaultValue
    }
  } else {
    initialValue = defaultValue
  }

  // 使用类型断言确保类型匹配
  const value = ref<T>(initialValue) as Ref<T>

  watch(value, (newValue) => {
    // 特殊处理Date类型
    if (isDateType && newValue instanceof Date) {
      localStorage.setItem(key, JSON.stringify(newValue.toISOString()))
    } else {
      localStorage.setItem(key, JSON.stringify(newValue))
    }
  })

  return value
}

// 检查是否为有效日期
const isValidDate = (date: Date | null): boolean => {
  return date instanceof Date && !isNaN(date.getTime())
}

// 格式化日期
const formatDate = (date: Date): string => {
  return date.toLocaleDateString()
}

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
// 明确指定isDateType为true，确保Date类型正确处理
const lastFetchDate = useStorage<Date | null>('lastFetchDate', null, true)
const isLoading = ref(false)
const error = ref<string | null>(null)
const canRefresh = ref(true) // 控制按钮是否可点击
const refreshCountdown = ref(0) // 倒计时秒数

// 从API获取赞助者数据
// forceRefresh: 是否强制刷新数据，忽略缓存
const fetchSponsors = async (retryCount = 0, forceRefresh = false) => {
  // 如果是强制刷新且按钮不可点击，则直接返回
  if (forceRefresh && !canRefresh.value) {
    return
  }

  // 如果是强制刷新，开始倒计时
  if (forceRefresh) {
    startRefreshCountdown();
  }
  // 检查是否需要获取新数据（每15天一次）
  const now = new Date()
  if (!forceRefresh && isValidDate(lastFetchDate.value)) {
    const diffTime = now.getTime() - lastFetchDate.value.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    if (diffDays < 15) {
      console.log('数据未过期，使用缓存数据')
      // 如果有缓存数据但sponsors为空，仍然尝试获取
      if (sponsors.value.length === 0) {
        // 尝试从localStorage加载数据
        const storedSponsors = localStorage.getItem('sponsors')
        if (storedSponsors) {
          sponsors.value = JSON.parse(storedSponsors)
        }
      }
      return
    } else {
      console.log('数据已过期，需要获取新数据')
    }
  } else {
    if (forceRefresh) {
      console.log('用户强制刷新，获取新数据')
    } else {
      console.log('lastFetchDate不是有效的Date对象，需要获取新数据');
      // 清除无效的localStorage数据
      localStorage.removeItem('lastFetchDate');
      console.log('已清除无效的lastFetchDate数据')
    }
  }

  isLoading.value = true
  error.value = null

  try {
    // 添加超时处理
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    // 使用代理路径解决CORS问题
    const apiUrl = '/api/sponsors/all'
    console.log('正在请求API (通过代理):', apiUrl)
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      // 尝试添加credentials配置解决跨域问题
      credentials: 'include'
    })

    clearTimeout(timeoutId)
    console.log('API响应状态:', response.status)

    if (!response.ok) {
      throw new Error(`HTTP错误! 状态码: ${response.status}, 状态文本: ${response.statusText}`)
    }

    const data: SponsorResponse = await response.json()
    console.log('API响应数据:', data)
    if (data.code === 200) {
      sponsors.value = data.data.sponsors
      lastFetchDate.value = now
      // 保存到localStorage
      localStorage.setItem('sponsors', JSON.stringify(sponsors.value))
      console.log('数据获取成功')
    } else {
      throw new Error(`API错误! 代码: ${data.code}, 消息: ${data.message}`)
    }
  } catch (err) {
    let errorMessage = '未知错误'
    if (err instanceof Error) {
      errorMessage = err.message
      // 处理不同类型的错误
      if (errorMessage.includes('AbortError')) {
        errorMessage = '请求超时，请检查网络连接'
      } else if (errorMessage.includes('Failed to fetch')) {
        errorMessage = '无法连接到API服务器，可能是网络问题或CORS限制'
      }
    }
    error.value = `获取数据失败: ${errorMessage}`
    console.error('获取数据失败详情:', err)

    // 尝试从localStorage加载缓存数据
    const storedSponsors = localStorage.getItem('sponsors')
    if (storedSponsors) {
      sponsors.value = JSON.parse(storedSponsors)
      error.value += ' (已加载本地缓存数据)'
    } else if (retryCount < 3) {
      // 重试机制
      error.value += ` (${3 - retryCount}秒后重试...)`
      setTimeout(() => {
        fetchSponsors(retryCount + 1)
      }, 3000)
    }
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

// 开始刷新倒计时
const startRefreshCountdown = () => {
  canRefresh.value = false;
  refreshCountdown.value = 360; // 6分钟 = 360秒

  const countdownInterval = setInterval(() => {
    refreshCountdown.value--;

    if (refreshCountdown.value <= 0) {
      clearInterval(countdownInterval);
      canRefresh.value = true;
    }
  }, 1000);
}

// 格式化倒计时显示
const formatCountdown = () => {
  const minutes = Math.floor(refreshCountdown.value / 60);
  const seconds = refreshCountdown.value % 60;
  return `${minutes}分${seconds}秒`;
}

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

    <p class="update-info" v-if="isValidDate(lastFetchDate)">
      数据最后更新时间: {{ formatDate(lastFetchDate as Date) }}
    </p>

    <div class="refresh-button-container">
      <button @click="fetchSponsors(0, true)" :disabled="isLoading || !canRefresh">
        {{ isLoading ? '刷新中...' : (canRefresh ? '强制刷新' : `请等待${formatCountdown()}`) }}
      </button>
    </div>
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
  border-bottom: 1px solid #454545a6;
}

.sponsor-table th {
  background-color: var(--vp-c-bg-soft);
  font-weight: 600;
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

.refresh-button-container {
  text-align: right;
  margin-top: 10px;
}

.refresh-button-container button {
  padding: 6px 12px;
  background-color: var(--vp-c-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.refresh-button-container button:hover {
  background-color: var(--vp-c-primary-dark);
}

.refresh-button-container button:disabled {
  background-color: var(--vp-c-gray-3);
  cursor: not-allowed;
}
</style>
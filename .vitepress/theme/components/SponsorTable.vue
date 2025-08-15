<script setup lang="ts">
import { ref, watch, onMounted, Ref, UnwrapRef } from 'vue'
// 使用localStorage替代@vueuse/core的useStorage，增强Date类型处理
const useStorage = <T>(key: string, defaultValue: T, isDateType = false): Ref<T> => {
  const storedValue = localStorage.getItem(key)
  let initialValue: T

  if (storedValue) {
    try {
      const parsed = JSON.parse(storedValue)
      if (isDateType) {
        const date = safeParseDate(typeof parsed === 'string' ? parsed : null);
        initialValue = (date || defaultValue) as unknown as T
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

  const value = ref<T>(initialValue) as Ref<T>

  watch(value, (newValue) => {
    if (isDateType && newValue instanceof Date) {
      localStorage.setItem(key, JSON.stringify(newValue.toISOString()))
    } else {
      localStorage.setItem(key, JSON.stringify(newValue))
    }
  })

  return value
}

const isValidDate = (date: Date | null | string): boolean => {
  if (typeof date === 'string') {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }
  return date instanceof Date && !isNaN(date.getTime())
}

const safeParseDate = (dateStr: string | null): Date | null => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isValidDate(date) ? date : null;
}

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
const canRefresh = ref(true)
const refreshCountdown = ref(0)

const fetchSponsors = async (retryCount = 0, forceRefresh = false) => {
  if (forceRefresh && !canRefresh.value) {
    return
  }

  if (forceRefresh) {
    startRefreshCountdown();
  }
  // 检查是否需要获取新数据（每15天一次）
  const now = new Date()
  if (!forceRefresh && isValidDate(lastFetchDate.value)) {
    const diffTime = now.getTime() - (lastFetchDate.value?.getTime() || 0)
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    if (diffDays < 15) {
      console.log('数据未过期，使用缓存数据')
      if (sponsors.value.length === 0) {
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
      localStorage.removeItem('lastFetchDate');
      console.log('已清除无效的lastFetchDate数据')
    }
  }

  isLoading.value = true
    error.value = null

    // 灵活配置API请求路径 - 移到顶部确保作用域正确
    const isProduction = process.env.NODE_ENV === 'production';
    const useProxyInProduction = false; // 根据需要修改此配置
    
    let apiUrl;
    if (isProduction && !useProxyInProduction) {
      apiUrl = 'https://api.vilinko.com/sponsors/all';
      console.log('正在请求API (直接)');
    } else {
      apiUrl = '/api/sponsors/all';
      console.log('正在请求API (通过代理)');
    }

    // 添加超时处理 - 移到外部try块之前，确保在catch中可访问
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    try {

    if (apiUrl.includes('/api/sponsors/all') && isProduction) {
      console.warn('生产环境中使用代理路径可能导致404错误，请确认服务器代理配置是否正确');
    }
    // 预先定义fetchOptions，确保在整个函数作用域内可访问
    let fetchOptions = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          // 添加跨域请求标识
          'X-Requested-With': 'XMLHttpRequest',
        },
      signal: controller.signal,
      credentials: 'include',
      mode: 'cors',
      redirect: 'follow'
    };

    const response = await fetch(apiUrl, {
      ...fetchOptions,
      credentials: 'include' as const,
      mode: 'cors' as const,
      redirect: 'follow' as const,
    })

    clearTimeout(timeoutId)
    console.log('API响应状态:', response.status)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Error：110001`)
      } else {
        throw new Error(`Error：110002`)
      }
    }

    const data: SponsorResponse = await response.json()
    console.log('API响应数据:', data)
    if (data.code === 200) {
      sponsors.value = data.data.sponsors
      lastFetchDate.value = now
      localStorage.setItem('sponsors', JSON.stringify(sponsors.value))
      console.log('数据获取成功')
    } else {
      throw new Error(`Error：110003`)
    }
  } catch (err) {
    let errorMessage = 'Error：130001'
    if (err instanceof Error) {
      errorMessage = err.message
      if (errorMessage.includes('AbortError')) {
        errorMessage = 'Error：100001'
    } else if (errorMessage.includes('Failed to fetch')) {
        if (err instanceof TypeError && errorMessage.includes('Failed to fetch') && navigator.userAgent.includes('Chrome')) {
            if (apiUrl === 'https://api.vilinko.com/sponsors/all') {
                errorMessage = 'Error：100002';
                console.warn(errorMessage);
                controller.abort();
                apiUrl = '/api/sponsors/all';
                console.log('切换到代理模式');
                // 重新定义fetchOptions以确保其作用域正确
                let fetchOptions = {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                  },
                  signal: new AbortController().signal,
                  credentials: 'include',
                  mode: 'cors',
                  redirect: 'follow'
                };
                setTimeout(() => {
                    fetchSponsors(retryCount + 1, forceRefresh);
                }, 1000);
                return;
            } else {
                errorMessage = 'Error：100003';
            }
        } else if (navigator.userAgent.includes('Chrome')) {
            errorMessage = 'Error：100004';
        } else {
            errorMessage = 'Error：100005';
        }
    } else if (errorMessage.includes('404')) {
        errorMessage = 'API端点不存在，请检查API路径是否正确'
    }
    }
    error.value = `获取数据失败: ${errorMessage}`
    console.error('获取数据失败详情:', err)

    const storedSponsors = localStorage.getItem('sponsors')
    if (storedSponsors) {
      sponsors.value = JSON.parse(storedSponsors)
      error.value += ' (已加载本地缓存数据)'
    } else if (retryCount < 3) {
      error.value += ` (${3 - retryCount}秒后重试...)`
      setTimeout(() => {
        fetchSponsors(retryCount + 1)
      }, 3000)
    }
  } finally {
    isLoading.value = false
  }
}

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

onMounted(() => {
  fetchSponsors()
})

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
  color: #5c83ff;
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
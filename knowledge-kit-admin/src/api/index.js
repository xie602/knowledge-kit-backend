import axios from 'axios'
import { useAuthStore } from '../store/auth'

// API 配置 - 通过 Vite 代理
const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  config => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers['Authorization'] = `Bearer ${authStore.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 调用云函数的通用方法
export const callCloudFunction = async (functionName, data = {}) => {
  try {
    // 调用 http-proxy 云函数
    const response = await api.post('/http-proxy', {
      functionName,
      data
    })

    // http-proxy 返回的结构是 { success: true, result: {...} }
    if (response.data.success) {
      return response.data.result
    } else {
      throw new Error(response.data.error || '调用云函数失败')
    }
  } catch (error) {
    console.error(`云函数 ${functionName} 调用失败:`, error)
    throw error
  }
}

export default api

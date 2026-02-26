xian/**
 * 仪表盘相关API
 */

import { callCloudFunction } from './index'

export const dashboardApi = {
  // 获取仪表盘统计数据
  getStats: async () => {
    const result = await callCloudFunction('adminStats', {})
    return result.data
  },

  // 管理员统计
  getAdminStats: async (params = {}) => {
    const result = await callCloudFunction('adminStats', params)
    return result.data
  }
}


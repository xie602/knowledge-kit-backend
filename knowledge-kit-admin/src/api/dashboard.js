/**
 * 仪表盘相关API
 */

import { callCloudFunction } from './index'

export const dashboardApi = {
  // 获取仪表盘统计数据
  getStats: async () => {
    return await callCloudFunction('getDashboardStats', {})
  },

  // 管理员统计
  getAdminStats: async (params = {}) => {
    return await callCloudFunction('adminStats', params)
  }
}

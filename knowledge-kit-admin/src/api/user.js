/**
 * 用户相关API
 */

import { callCloudFunction } from './index'

export const userApi = {
  // 获取用户列表
  getList: async (params = {}) => {
    return await callCloudFunction('getUsers', params)
  },

  // 设置永久用户
  setPermanent: async (userId, isPermanent) => {
    return await callCloudFunction('setPermanentUser', {
      userId,
      isPermanent
    })
  },

  // 获取用户统计
  getStats: async (userId) => {
    return await callCloudFunction('getUserStats', { userId })
  },

  // 用户数据分析
  analyzeUsers: async (params = {}) => {
    return await callCloudFunction('analyzeUsers', params)
  }
}

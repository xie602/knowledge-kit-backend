/**
 * 系统设置API
 */

import { callCloudFunction } from './index'

export const settingApi = {
  // 获取设置
  get: async (key) => {
    return await callCloudFunction('all', {
      action: 'getOne',
      collection: 'settings',
      query: { key }
    })
  },

  // 获取所有设置
  getAll: async () => {
    return await callCloudFunction('all', {
      collection: 'settings'
    })
  },

  // 设置值
  set: async (key, value) => {
    return await callCloudFunction('all', {
      action: 'set',
      collection: 'settings',
      data: { key, value }
    })
  },

  // 更新设置
  update: async (key, value) => {
    return await callCloudFunction('all', {
      action: 'update',
      collection: 'settings',
      data: { key, value }
    })
  }
}

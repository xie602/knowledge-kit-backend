/**
 * 推荐管理API
 */

import { callCloudFunction } from './index'

export const recommendApi = {
  // 获取推荐列表
  getList: async (params = {}) => {
    return await callCloudFunction('all', {
      collection: 'recommendApps',
      ...params
    })
  },

  // 添加推荐
  add: async (data) => {
    return await callCloudFunction('all', {
      action: 'add',
      collection: 'recommendApps',
      data
    })
  },

  // 更新推荐
  update: async (id, data) => {
    return await callCloudFunction('all', {
      action: 'update',
      collection: 'recommendApps',
      data: { id, ...data }
    })
  },

  // 删除推荐
  delete: async (id) => {
    return await callCloudFunction('all', {
      action: 'delete',
      collection: 'recommendApps',
      data: { id }
    })
  }
}

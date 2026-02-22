/**
 * 分类相关API
 */

import { callCloudFunction } from './index'

export const categoryApi = {
  // 获取所有分类
  getAll: async () => {
    return await callCloudFunction('manageCategories', {
      action: 'getAll'
    })
  },

  // 按类型获取分类
  getByType: async (type) => {
    return await callCloudFunction('manageCategories', {
      action: 'getByType',
      type
    })
  },

  // 添加分类
  add: async (data) => {
    return await callCloudFunction('manageCategories', {
      action: 'add',
      data
    })
  },

  // 更新分类
  update: async (id, data) => {
    return await callCloudFunction('manageCategories', {
      action: 'update',
      data: { id, ...data }
    })
  },

  // 删除分类
  delete: async (id) => {
    return await callCloudFunction('manageCategories', {
      action: 'delete',
      data: { id }
    })
  }
}

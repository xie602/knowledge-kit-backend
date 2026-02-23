/**
 * 轮播图管理API
 */

import { callCloudFunction } from './index'

export const carouselApi = {
  // 获取轮播图列表
  getAll: async () => {
    return await callCloudFunction('manageCarousel', {
      action: 'getAll'
    })
  },

  // 添加轮播图
  add: async (data) => {
    return await callCloudFunction('manageCarousel', {
      action: 'add',
      data
    })
  },

  // 更新轮播图
  update: async (id, data) => {
    return await callCloudFunction('manageCarousel', {
      action: 'update',
      data: { id, ...data }
    })
  },

  // 删除轮播图
  delete: async (id) => {
    return await callCloudFunction('manageCarousel', {
      action: 'delete',
      data: { id }
    })
  }
}

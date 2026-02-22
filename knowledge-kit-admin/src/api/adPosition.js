/**
 * 广告位管理API
 */

import { callCloudFunction } from './index'

export const adPositionApi = {
  // 获取所有广告位
  getAll: async () => {
    return await callCloudFunction('manageAdPositions', {
      action: 'getAll'
    })
  },

  // 添加广告位
  add: async (data) => {
    return await callCloudFunction('manageAdPositions', {
      action: 'add',
      data
    })
  },

  // 更新广告位
  update: async (id, data) => {
    return await callCloudFunction('manageAdPositions', {
      action: 'update',
      data: { id, ...data }
    })
  },

  // 删除广告位
  delete: async (id) => {
    return await callCloudFunction('manageAdPositions', {
      action: 'delete',
      data: { id }
    })
  }
}

/**
 * 资料相关API
 */

import { callCloudFunction } from './index'

export const documentApi = {
  // 获取资料列表
  getList: async (params = {}) => {
    return await callCloudFunction('getDocuments', params)
  },

  // 获取资料详情
  getDetail: async (id) => {
    return await callCloudFunction('getDocumentById', { id })
  },

  // 上传资料
  upload: async (data) => {
    return await callCloudFunction('uploadDocument', data)
  },

  // 资料管理（增删改查）
  manage: async (action, data) => {
    return await callCloudFunction('manageDocuments', { action, data })
  },

  // 搜索资料
  search: async (keyword, params = {}) => {
    return await callCloudFunction('searchDocuments', { keyword, ...params })
  },

  // 收藏/取消收藏
  favorite: async (documentId, action = 'add') => {
    return await callCloudFunction('favoriteDocument', {
      documentId,
      action // 'add' 或 'remove'
    })
  },

  // 记录下载
  download: async (documentId) => {
    return await callCloudFunction('downloadDocument', { documentId })
  }
}

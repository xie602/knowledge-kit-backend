/**
 * 卡密相关API
 */

import { callCloudFunction } from './index'

export const cardApi = {
  // 获取卡密列表
  getList: async (params = {}) => {
    return await callCloudFunction('getCards', params)
  },

  // 生成卡密
  generate: async (count, type = '7days') => {
    return await callCloudFunction('generateCards', {
      count,
      type
    })
  },

  // 禁用卡密
  disable: async (cardId) => {
    return await callCloudFunction('disableCard', { cardId })
  },

  // 自动禁用过期卡密
  disableExpired: async () => {
    return await callCloudFunction('disableExpiredCards', {})
  }
}

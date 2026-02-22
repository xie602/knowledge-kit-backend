/**
 * 广告相关API
 */

import { callCloudFunction } from './index'

export const adApi = {
  // 获取广告配置
  getConfig: async () => {
    return await callCloudFunction('manageAds', {
      action: 'getConfig'
    })
  },

  // 设置广告配置
  setConfig: async (data) => {
    return await callCloudFunction('manageAds', {
      action: 'setConfig',
      data
    })
  },

  // 获取广告统计数据
  getStats: async (params = {}) => {
    return await callCloudFunction('manageAds', {
      action: 'getStats',
      ...params
    })
  },

  // 广告数据分析
  analyze: async (params = {}) => {
    return await callCloudFunction('analyzeAdStats', params)
  },

  // 记录广告事件
  track: async (adUnitId, position, eventType) => {
    return await callCloudFunction('trackAdStats', {
      adUnitId,
      position,
      eventType // 'impression', 'click', 'close'
    })
  }
}

/**
 * 内容同步相关API
 */

import { callCloudFunction } from './index'

export const syncApi = {
  // GitHub仓库同步
  github: async (params) => {
    return await callCloudFunction('syncGithub', params)
  },

  // 公众号文章同步
  wechat: async (params) => {
    return await callCloudFunction('syncWechatArticles', params)
  },

  // 获取文章列表
  getArticles: async (params = {}) => {
    return await callCloudFunction('getArticles', params)
  }
}

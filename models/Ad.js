const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  position: {
    type: String,
    required: true,
    enum: [
      'home_top',      // 首页顶部
      'home_bottom',   // 首页底部
      'category_top',  // 分类页顶部
      'category_bottom', // 分类页底部
      'detail_top',    // 详情页顶部
      'detail_bottom', // 详情页底部
      'personal_top',  // 个人中心顶部
      'search_top'     // 搜索页顶部
    ]
  },
  type: {
    type: String,
    default: 'banner',
    enum: [
      'banner',      // Banner广告
      'interstitial', // 插屏广告
      'rewarded',    // 激励视频广告
      'native',      // 原生广告
      'grid'         // 格子广告
    ]
  },
  content: {
    type: String,
    default: '',
    maxlength: 500
  },
  adUnitId: {
    type: String,
    default: '',
    trim: true
  },
  targetUrl: {
    type: String,
    default: '',
    trim: true
  },
  imageUrl: {
    type: String,
    default: '',
    trim: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// 为常用查询字段添加索引
adSchema.index({ position: 1 });
adSchema.index({ enabled: 1 });
adSchema.index({ priority: -1 });
adSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Ad', adSchema);
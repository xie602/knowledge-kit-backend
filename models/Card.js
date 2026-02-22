const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  // 卡密编号
  cardNumber: {
    type: String,
    required: true,
    unique: true
  },
  // 卡密类型：7天或永久
  type: {
    type: String,
    enum: ['7days', 'permanent'],
    default: 'permanent'
  },
  // 卡密状态：未使用、已使用、已禁用
  status: {
    type: String,
    enum: ['unused', 'used', 'disabled'],
    default: 'unused'
  },
  // 使用该卡密的用户ID
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // 卡密生成时间
  createdAt: {
    type: Date,
    default: Date.now
  },
  // 卡密使用时间
  usedAt: {
    type: Date,
    default: null
  },
  // 卡密过期时间
  expireDate: {
    type: Date,
    default: function() {
      if (this.type === '7days') {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      }
      return null; // 永久卡密没有过期时间
    }
  }
});

// 添加索引以提高查询性能
cardSchema.index({ cardNumber: 1 });
cardSchema.index({ status: 1 });
cardSchema.index({ type: 1 });
cardSchema.index({ userId: 1 });

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
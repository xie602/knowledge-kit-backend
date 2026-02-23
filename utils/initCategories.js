const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

// 若未配置 MONGODB_URI，则跳过分类初始化（适配内存存储运行模式）
if (!process.env.MONGODB_URI) {
  console.log('未配置 MONGODB_URI，检测到使用内存存储，跳过初始化分类数据。');
  module.exports = async function() { return; };
  return;
}

// 默认分类数据
const defaultCategories = [
  // 幼小衔接年级
  { name: '幼小衔接', type: 'grade', level: 1, order: 1 },
  
  // 小学年级
  { name: '一年级', type: 'grade', level: 1, order: 2 },
  { name: '二年级', type: 'grade', level: 1, order: 3 },
  { name: '三年级', type: 'grade', level: 1, order: 4 },
  { name: '四年级', type: 'grade', level: 1, order: 5 },
  { name: '五年级', type: 'grade', level: 1, order: 6 },
  { name: '六年级', type: 'grade', level: 1, order: 7 },
  
  // 初中年级
  { name: '七年级', type: 'grade', level: 1, order: 8 },
  { name: '八年级', type: 'grade', level: 1, order: 9 },
  { name: '九年级', type: 'grade', level: 1, order: 10 },
  
  // 高中年级
  { name: '高一', type: 'grade', level: 1, order: 11 },
  { name: '高二', type: 'grade', level: 1, order: 12 },
  { name: '高三', type: 'grade', level: 1, order: 13 },
  
  // 学期分类
  { name: '上学期', type: 'semester', level: 2, order: 1 },
  { name: '下学期', type: 'semester', level: 2, order: 2 },
  
  // 版本分类
  { name: '统编版', type: 'version', level: 4, order: 1 },
  { name: '人教版', type: 'version', level: 4, order: 2 },
  { name: '北师大版', type: 'version', level: 4, order: 3 },
  { name: '苏教版', type: 'version', level: 4, order: 4 },
  { name: '沪教版', type: 'version', level: 4, order: 5 },
  { name: '冀教版', type: 'version', level: 4, order: 6 },
  { name: '鲁教版', type: 'version', level: 4, order: 7 },
  
  // 资料类型分类
  { name: '单元测试卷', type: 'type', level: 5, order: 1 },
  { name: '期中试卷', type: 'type', level: 5, order: 2 },
  { name: '期末试卷', type: 'type', level: 5, order: 3 },
  { name: '中考试卷', type: 'type', level: 5, order: 4 },
  { name: '高考试卷', type: 'type', level: 5, order: 5 },
  { name: '模拟试卷', type: 'type', level: 5, order: 6 },
  { name: '竞赛试卷', type: 'type', level: 5, order: 7 },
  { name: '同步练习册', type: 'type', level: 5, order: 8 },
  { name: '专项练习题', type: 'type', level: 5, order: 9 },
  { name: '课后作业', type: 'type', level: 5, order: 10 },
  { name: '错题集', type: 'type', level: 5, order: 11 },
  { name: '思维导图', type: 'type', level: 5, order: 12 },
  { name: '课本同步资料', type: 'type', level: 5, order: 13 },
  { name: '课堂笔记', type: 'type', level: 5, order: 14 },
  { name: '知识点汇总', type: 'type', level: 5, order: 15 },
  { name: '学习方法指导', type: 'type', level: 5, order: 16 },
  { name: '解题技巧', type: 'type', level: 5, order: 17 },
  { name: '寒假作业', type: 'type', level: 5, order: 18 },
  { name: '寒假预习', type: 'type', level: 5, order: 19 },
  { name: '寒假复习', type: 'type', level: 5, order: 20 },
  { name: '寒假活动', type: 'type', level: 5, order: 21 },
  { name: '寒假计划', type: 'type', level: 5, order: 22 },
  { name: '暑假作业', type: 'type', level: 5, order: 23 },
  { name: '暑假预习', type: 'type', level: 5, order: 24 },
  { name: '暑假复习', type: 'type', level: 5, order: 25 },
  { name: '暑假活动', type: 'type', level: 5, order: 26 },
  { name: '暑假计划', type: 'type', level: 5, order: 27 },
  
  // 科目分类 - 幼小衔接
  { name: '语文启蒙诵读', type: 'subject', level: 3, order: 1 },
  { name: '语文拼音', type: 'subject', level: 3, order: 2 },
  { name: '语文情景识字', type: 'subject', level: 3, order: 3 },
  { name: '数学快乐数学', type: 'subject', level: 3, order: 4 },
  { name: '数学图形认知', type: 'subject', level: 3, order: 5 },
  { name: '艺术图画', type: 'subject', level: 3, order: 6 },
  { name: '艺术手工制作', type: 'subject', level: 3, order: 7 },
  { name: '习惯培养', type: 'subject', level: 3, order: 8 },
  
  // 科目分类 - 小学
  { name: '语文', type: 'subject', level: 3, order: 1 },
  { name: '数学', type: 'subject', level: 3, order: 2 },
  { name: '英语', type: 'subject', level: 3, order: 3 },
  { name: '道德与法治', type: 'subject', level: 3, order: 4 },
  
  // 科目分类 - 初中
  { name: '语文', type: 'subject', level: 3, order: 1 },
  { name: '数学', type: 'subject', level: 3, order: 2 },
  { name: '英语', type: 'subject', level: 3, order: 3 },
  { name: '物理', type: 'subject', level: 3, order: 4 },
  { name: '化学', type: 'subject', level: 3, order: 5 },
  { name: '生物', type: 'subject', level: 3, order: 6 },
  { name: '历史', type: 'subject', level: 3, order: 7 },
  { name: '地理', type: 'subject', level: 3, order: 8 },
  { name: '道德与法治', type: 'subject', level: 3, order: 9 },
  
  // 科目分类 - 高中
  { name: '语文', type: 'subject', level: 3, order: 1 },
  { name: '数学', type: 'subject', level: 3, order: 2 },
  { name: '英语', type: 'subject', level: 3, order: 3 },
  { name: '物理', type: 'subject', level: 3, order: 4 },
  { name: '化学', type: 'subject', level: 3, order: 5 },
  { name: '生物', type: 'subject', level: 3, order: 6 },
  { name: '历史', type: 'subject', level: 3, order: 7 },
  { name: '地理', type: 'subject', level: 3, order: 8 },
  { name: '思想政治', type: 'subject', level: 3, order: 9 }
];

async function initCategories() {
  try {
    // 连接到数据库
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge-kit');
    
    console.log('正在检查现有分类...');
    
    // 检查是否已有分类数据
    const existingCategories = await Category.countDocuments();
    
    if (existingCategories > 0) {
      console.log('分类数据已存在，跳过初始化');
      process.exit(0);
    }
    
    console.log('正在插入默认分类数据...');
    
    // 插入默认分类数据
    await Category.insertMany(defaultCategories);
    
    console.log('默认分类数据插入成功！');
    
    // 断开数据库连接
    await mongoose.connection.close();
    
    console.log('数据库连接已关闭');
  } catch (error) {
    console.error('初始化分类数据失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  initCategories();
}

module.exports = initCategories;
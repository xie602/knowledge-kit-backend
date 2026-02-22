const { sequelize } = require('../config/database');

// 导入所有模型
const User = require('../models/User');
const Document = require('../models/Document');
const Category = require('../models/Category');

// 初始化数据库
async function initDatabase() {
  try {
    console.log('开始初始化数据库...');
    
    // 自动创建表结构
    await sequelize.sync({ force: false });
    console.log('数据库表结构创建成功');
    
    // 初始化默认数据
    await initDefaultData();
    
  } catch (error) {
    console.error('数据库初始化失败:', error);
  }
}

// 初始化默认数据
async function initDefaultData() {
  try {
    // 检查是否已有分类数据
    const categoryCount = await Category.count();
    if (categoryCount === 0) {
      // 创建默认分类
      const defaultCategories = [
        { name: '技术文档', icon: '📚', order: 1 },
        { name: '学习资料', icon: '📖', order: 2 },
        { name: '设计资源', icon: '🎨', order: 3 },
        { name: '其他', icon: '📁', order: 4 }
      ];
      
      await Category.bulkCreate(defaultCategories);
      console.log('默认分类数据创建成功');
    }
    
    // 检查是否已有管理员用户
    const adminCount = await User.count({ where: { role: 'admin' } });
    if (adminCount === 0) {
      // 创建默认管理员
      await User.create({
        openid: 'admin_system',
        nickname: '系统管理员',
        avatarUrl: '',
        isPermanent: true,
        role: 'admin',
        status: 'active'
      });
      console.log('默认管理员创建成功');
    }
    
  } catch (error) {
    console.error('默认数据初始化失败:', error);
  }
}

module.exports = initDatabase;

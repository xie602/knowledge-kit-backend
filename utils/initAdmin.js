const User = require('../models/User');
require('dotenv').config();

/**
 * 初始化管理员账户
 * 用于创建第一个管理员用户
 */
async function initAdmin() {
  try {
    // 检查是否已经存在管理员账户
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('系统中已存在管理员账户');
      console.log('管理员信息:', {
        id: existingAdmin._id,
        openid: existingAdmin.openid,
        nickname: existingAdmin.nickname,
        createdAt: existingAdmin.createdAt
      });
      return;
    }
    
    // 创建默认管理员账户
    const adminUser = new User({
      openid: 'admin_default_openid_' + Date.now(), // 使用时间戳确保唯一性
      nickname: 'Admin User',
      role: 'admin',
      status: 'active'
    });
    
    await adminUser.save();
    
    console.log('管理员账户创建成功!');
    console.log('管理员信息:', {
      id: adminUser._id,
      openid: adminUser.openid,
      nickname: adminUser.nickname,
      role: adminUser.role,
      createdAt: adminUser.createdAt
    });
    
    console.log('\n注意：在生产环境中，您应该通过安全的方式替换默认的管理员账户！');
  } catch (error) {
    console.error('初始化管理员账户失败:', error);
  }
}

// 如果直接运行此文件，则执行初始化
if (require.main === module) {
  // 连接数据库
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge-kit', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(async () => {
    console.log('数据库连接成功');
    await initAdmin();
    mongoose.connection.close();
  }).catch((error) => {
    console.error('数据库连接失败:', error);
  });
}

module.exports = initAdmin;
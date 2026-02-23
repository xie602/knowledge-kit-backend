const { Sequelize } = require('sequelize');
require('dotenv').config();

// 从环境变量获取数据库连接信息
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// 测试数据库连接
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
}

module.exports = {
  sequelize,
  testConnection
};

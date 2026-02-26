// 数据库配置
// 注意：当前项目使用微信云开发数据库，不需要 PostgreSQL 数据库
// 此文件保留为空模块，用于兼容旧代码引用

console.log('使用微信云开发数据库，不初始化 PostgreSQL 数据库');

module.exports = {
  sequelize: null,
  testConnection: () => console.log('跳过数据库连接测试')
};

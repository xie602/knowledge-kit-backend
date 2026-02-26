// 暂时禁用数据库连接,使用空对象
// const { DataTypes } = require('sequelize');
// const { sequelize } = require('../config/database');

const Document = {};

// 暂时不定义模型,避免数据库连接错误
// 如果需要使用数据库,请先配置 .env 文件中的 DATABASE_URL

module.exports = Document;

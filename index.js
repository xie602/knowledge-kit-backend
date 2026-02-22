const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002; // 使用3002端口

// 数据库配置
const { sequelize, testConnection } = require('./config/database');

// 中间件
app.use(cors());
app.use(express.json());

// 初始化数据库
async function initializeApp() {
  try {
    // 测试数据库连接
    await testConnection();
    
    // 初始化数据库表结构
    const initDatabase = require('./utils/initDatabase');
    await initDatabase();
    
    console.log('数据库初始化完成');
  } catch (error) {
    console.error('应用初始化失败:', error);
  }
}

// 启动应用前初始化
initializeApp();

// API根路径
app.get('/api', (req, res) => {
  res.json({ 
    message: '知识锦囊API服务运行中',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      documents: '/api/documents',
      categories: '/api/categories'
    }
  });
});

// 根路由
app.get('/', (req, res) => {
  res.json({ message: '知识锦囊后端服务运行中' });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
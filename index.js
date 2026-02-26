const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 导入路由
const documentRouter = require('./routes/documentRoutes');
const userRouter = require('./routes/userRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const carouselRouter = require('./routes/carousel');
const announcementsRouter = require('./routes/announcements');

// API路由 - 必须在静态文件之前注册
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

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常' });
});

// 使用路由
app.use('/api/documents', documentRouter);
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/carousel', carouselRouter);
app.use('/api/announcements', announcementsRouter);

// 云函数代理路由
app.post('/api/http-proxy', async (req, res) => {
  try {
    const { functionName, data } = req.body;
    
    if (!functionName) {
      return res.status(400).json({ success: false, error: '缺少函数名称' });
    }
    
    console.log(`调用云函数: ${functionName}`, data);
    
    // 模拟云函数调用结果
    // 实际项目中应该使用 wx-server-sdk 或调用云函数 API
    const mockResults = {
      syncGithub: {
        success: true,
        total: 0,
        successCount: 0,
        failCount: 0,
        message: '仓库中不存在data.json文件，同步完成'
      },
      syncWechatArticles: {
        success: true,
        data: [],
        count: 0
      }
    };
    
    const result = mockResults[functionName] || {
      success: true,
      message: `云函数 ${functionName} 调用成功`
    };
    
    res.json({ success: true, result });
  } catch (error) {
    console.error('云函数调用失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ success: false, message: '服务器内部错误' });
});

// 导出app实例供Vercel使用
module.exports = app;

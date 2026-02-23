const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002; // 使用3002端口

// 中间件
app.use(cors());
app.use(express.json());

// 模拟数据库初始化（不实际连接数据库）
async function initializeApp() {
  try {
    console.log('跳过数据库初始化，直接启动服务');
  } catch (error) {
    console.error('初始化失败:', error);
  }
}

// 启动应用前初始化（异步执行，不阻塞服务器启动）
initializeApp().catch(error => {
  console.error('初始化失败，但服务器将继续运行:', error);
});

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

// 用户相关API
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    message: '获取用户列表成功',
    data: [
      {
        id: 1,
        openid: 'admin_system',
        nickname: '系统管理员',
        role: 'admin',
        status: 'active'
      },
      {
        id: 2,
        openid: 'test_user_1',
        nickname: '测试用户1',
        role: 'user',
        status: 'active'
      }
    ]
  });
});

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    message: '获取用户详情成功',
    data: {
      id: parseInt(id),
      openid: `user_${id}`,
      nickname: `用户${id}`,
      role: 'user',
      status: 'active'
    }
  });
});

// 文档相关API
app.get('/api/documents', (req, res) => {
  res.json({
    success: true,
    message: '获取文档列表成功',
    data: [
      {
        id: 1,
        title: '技术文档示例',
        description: '这是一个技术文档示例',
        category: '技术文档',
        downloadCount: 10,
        favoriteCount: 5
      },
      {
        id: 2,
        title: '学习资料示例',
        description: '这是一个学习资料示例',
        category: '学习资料',
        downloadCount: 5,
        favoriteCount: 2
      }
    ]
  });
});

app.get('/api/documents/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    message: '获取文档详情成功',
    data: {
      id: parseInt(id),
      title: `文档${id}`,
      description: `这是文档${id}的描述`,
      category: '技术文档',
      downloadCount: 0,
      favoriteCount: 0
    }
  });
});

// 分类相关API
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    message: '获取分类列表成功',
    data: [
      {
        id: 1,
        name: '技术文档',
        icon: '📚',
        order: 1
      },
      {
        id: 2,
        name: '学习资料',
        icon: '📖',
        order: 2
      },
      {
        id: 3,
        name: '设计资源',
        icon: '🎨',
        order: 3
      },
      {
        id: 4,
        name: '其他',
        icon: '📁',
        order: 4
      }
    ]
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
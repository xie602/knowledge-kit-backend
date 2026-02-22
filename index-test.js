const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 模拟数据（符合PRD的materials表结构）
let mockUsers = [];
let mockDocuments = [
  {
    _id: '1',
    title: '小学三年级数学期末试卷（上册）',
    grade: '三年级',
    subject: '数学',
    semester: '上学期',
    type: '试卷',
    version: '人教版',
    description: '包含本学期所有重点知识点，共100道题目',
    download_url: 'https://pan.baidu.com/s/xxx',
    preview_images: [],
    download_count: 234,
    views: 1205,
    collection_count: 89,
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=document%20cover%20with%20green%20theme&image_size=square',
    tags: ['期末', '试卷', '数学'],
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    _id: '2',
    title: '小学英语单词表（三年级下册）',
    grade: '三年级',
    subject: '英语',
    semester: '下学期',
    type: '知识点',
    version: '人教版',
    description: '三年级上下册全部单词，带音标和例句',
    download_url: 'https://pan.baidu.com/s/yyy',
    preview_images: [],
    download_count: 567,
    views: 2341,
    collection_count: 156,
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=english%20vocabulary%20list&image_size=square',
    tags: ['单词', '音标', '英语'],
    status: 'active',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date()
  },
  {
    _id: '3',
    title: '小学语文古诗词背诵资料（三年级）',
    grade: '三年级',
    subject: '语文',
    semester: '下学期',
    type: '知识点',
    version: '人教版',
    description: '本学期必背古诗词及译文',
    download_url: 'https://pan.baidu.com/s/zzz',
    preview_images: [],
    download_count: 432,
    views: 1876,
    collection_count: 203,
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20poetry%20cover&image_size=square',
    tags: ['古诗词', '背诵', '语文'],
    status: 'active',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date()
  }
];

let mockCategories = [
  { id: '1', name: '一年级', icon: '📚', color: '#4CAF50' },
  { id: '2', name: '二年级', icon: '📝', color: '#2196F3' },
  { id: '3', name: '三年级', icon: '✏️', color: '#FF9800' },
  { id: '4', name: '四年级', icon: '🎨', color: '#9C27B0' },
  { id: '5', name: '五年级', icon: '🔬', color: '#E91E63' },
  { id: '6', name: '六年级', icon: '📐', color: '#00BCD4' }
];

// API根路径
app.get('/api', (req, res) => {
  res.json({
    message: '知识锦囊API服务运行中（测试版）',
    version: '1.0.0-test',
    endpoints: {
      users: '/api/users',
      documents: '/api/documents',
      categories: '/api/categories'
    }
  });
});

// 根路由
app.get('/', (req, res) => {
  res.json({ message: '知识锦囊后端服务运行中（测试版）' });
});

// 用户路由
app.post('/api/users/login', (req, res) => {
  const { code } = req.body;
  const mockUser = {
    openid: 'test_openid_' + Date.now(),
    nickname: '测试用户',
    avatar: 'https://via.placeholder.com/100',
    isPermanent: false
  };
  mockUsers.push(mockUser);
  res.json({
    success: true,
    token: 'test_token_' + Date.now(),
    user: mockUser
  });
});

app.get('/api/users/info', (req, res) => {
  res.json({
    success: true,
    user: {
      openid: 'test_openid',
      nickname: '测试用户',
      avatar: 'https://via.placeholder.com/100',
      isPermanent: false
    }
  });
});

app.post('/api/users/verify-card', (req, res) => {
  const { cardNumber } = req.body;
  if (cardNumber === 'TEST123') {
    res.json({
      success: true,
      message: '卡密验证成功',
      isPermanent: true
    });
  } else {
    res.status(400).json({
      success: false,
      message: '卡密无效'
    });
  }
});

// 文档路由
app.get('/api/documents', (req, res) => {
  res.json({
    success: true,
    data: {
      documents: mockDocuments
    }
  });
});

app.get('/api/documents/:id', (req, res) => {
  const doc = mockDocuments.find(d => d.id === req.params.id);
  if (doc) {
    res.json({
      success: true,
      document: doc
    });
  } else {
    res.status(404).json({
      success: false,
      message: '文档不存在'
    });
  }
});

app.get('/api/documents/search', (req, res) => {
  const { keyword } = req.query;
  const results = mockDocuments.filter(doc =>
    doc.title.includes(keyword) || doc.content.includes(keyword)
  );
  res.json({
    success: true,
    data: {
      documents: results
    }
  });
});

app.post('/api/documents/:id/like', (req, res) => {
  const doc = mockDocuments.find(d => d.id === req.params.id);
  if (doc) {
    doc.likes += 1;
    res.json({
      success: true,
      likes: doc.likes
    });
  } else {
    res.status(404).json({
      success: false,
      message: '文档不存在'
    });
  }
});

// 分类路由
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: {
      categories: mockCategories
    }
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器错误',
    error: err.message
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`✅ 测试服务器运行在端口 ${PORT}`);
  console.log(`📡 访问 http://localhost:${PORT}`);
  console.log(`📚 API文档 http://localhost:${PORT}/api`);
});

const express = require('express');
const router = express.Router();
const documentController = require('../controllers/DocumentController');
const { auth, adminAuth } = require('../middleware/auth'); // 引入新的认证中间件

// 获取文档列表
router.get('/', documentController.getDocuments);

// 获取文档详情
router.get('/:id', documentController.getDocumentById);

// 搜索文档
router.get('/search/:keyword', documentController.searchDocuments);

// 点赞文档
router.post('/like/:id', documentController.likeDocument);

// 收藏文档（需要认证）
router.post('/favorite/:id', auth, documentController.toggleFavorite);

// 创建文档（需要管理员权限）
router.post('/', adminAuth, documentController.createDocument);

// 更新文档（需要管理员权限）
router.put('/:id', adminAuth, documentController.updateDocument);

// 删除文档（需要管理员权限）
router.delete('/:id', adminAuth, documentController.deleteDocument);

module.exports = router;
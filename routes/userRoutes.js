const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// 管理员登录
router.post('/admin/login', UserController.adminLogin);

// 用户登录/注册
router.post('/login', UserController.login);

// 获取用户信息
router.get('/info', UserController.getUserInfo);

// 验证卡片
router.post('/verify-card', UserController.verifyCard);

// 获取用户统计数据
router.get('/stats', UserController.getUserStats);

// 检查文档是否被收藏
router.get('/favorite/:documentId', UserController.checkFavorite);

// 创建管理员
router.post('/admin/create', UserController.createAdmin);

// 获取所有用户
router.get('/admin/list', UserController.getAllUsers);

// 更新用户角色
router.put('/admin/role/:userId', UserController.updateUserRole);

// 批量生成卡密
router.post('/admin/generate-cards', UserController.generateCards);

// 查看卡密使用情况
router.get('/admin/cards', UserController.getCards);

// 禁用卡密
router.put('/admin/card/disable/:cardNumber', UserController.disableCard);

// 禁用过期卡密
router.put('/admin/cards/disable-expired', UserController.disableExpiredCards);

// 手动设置用户为永久用户
router.put('/admin/user/permanent/:userId', UserController.setPermanentUser);

// 用户数据分析
router.get('/admin/analyze', UserController.analyzeUsers);

// 用户状态管理
router.put('/admin/user/status/:userId', UserController.updateUserStatus);

// 获取单个用户
router.get('/admin/user/:userId', UserController.getUserById);

// 后台通用更新用户
router.put('/admin/user/:userId', UserController.updateUser);

// 删除用户
router.delete('/admin/user/:userId', UserController.deleteUser);

// 导出用户数据
router.get('/admin/export', UserController.exportUsers);

module.exports = router;

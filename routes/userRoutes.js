const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const { auth, adminAuth } = require('../middleware/auth');

// Web后台管理员登录
router.post('/admin/login', userController.adminLogin);

// 用户登录/注册
router.post('/login', userController.login);

// 获取用户信息（需要认证）
router.get('/me', auth, userController.getUserInfo);

// 验证卡片（需要认证）
router.post('/verify-card', auth, userController.verifyCard);

// 获取用户统计数据（需要认证）
router.get('/stats', auth, userController.getUserStats);

// 检查文档是否被收藏（需要认证）
router.get('/favorites/:documentId', auth, userController.checkFavorite);

// 以下为管理相关的API端点（需要管理员权限）

// 创建管理员（仅限管理员）
router.post('/admins', adminAuth, userController.createAdmin);

// 获取所有用户（仅限管理员）
router.get('/', adminAuth, userController.getAllUsers);

// 更新用户角色（仅限管理员）
router.put('/:userId/role', adminAuth, userController.updateUserRole);

// 手动设置用户为永久用户（仅限管理员）
router.put('/:userId/permanent', adminAuth, userController.setPermanentUser);

// 更新用户状态（仅限管理员）
router.put('/:userId/status', adminAuth, userController.updateUserStatus);

// 用户数据分析（仅限管理员）
router.get('/analysis', adminAuth, userController.analyzeUsers);

// 卡密管理相关端点（仅限管理员）

// 批量生成卡密（仅限管理员）
router.post('/cards', adminAuth, userController.generateCards);

// 查看卡密使用情况（仅限管理员）
router.get('/cards', adminAuth, userController.getCards);

// 禁用卡密（仅限管理员）
router.put('/cards/:cardNumber/disable', adminAuth, userController.disableCard);

// 禁用过期卡密（仅限管理员）
router.post('/cards/disable-expired', adminAuth, userController.disableExpiredCards);

// 管理后台兼容路由：获取单个用户、更新用户、删除用户、导出用户数据
// 获取单个用户信息（仅限管理员）
router.get('/:userId', adminAuth, userController.getUserById);

// 更新用户（包含角色、下载次数等，可用于后台通用更新）
router.put('/:userId', adminAuth, userController.updateUser);

// 删除用户（仅限管理员）
router.delete('/:userId', adminAuth, userController.deleteUser);

// 导出用户数据（仅限管理员）
router.get('/export', adminAuth, userController.exportUsers);

// Web 后台常用的个人信息接口别名（兼容前端 /users/profile）
router.get('/profile', auth, userController.getUserInfo);

module.exports = router;
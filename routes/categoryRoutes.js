const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryController');
// 暂时移除认证中间件以便测试
// const { auth, adminAuth } = require('../middleware/auth');

// 获取分类树结构
router.get('/tree', categoryController.getCategoryTree);

// 年级管理路由（更具体的路由放在前面）
router.get('/grades', categoryController.getGrades);
router.post('/grades', categoryController.createGrade);
router.put('/grades/:id', categoryController.updateGrade);
router.delete('/grades/:id', categoryController.deleteGrade);

// 默认的CRUD路由（更通用的路由放在后面）
router.get('/', categoryController.index);
router.post('/', categoryController.store);
router.get('/:id', categoryController.show);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.destroy);

module.exports = router;
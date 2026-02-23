const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryController');
const { auth, adminAuth } = require('../middleware/auth');

// 获取分类树结构
router.get('/tree', auth, adminAuth, categoryController.getCategoryTree);

// 默认的CRUD路由
router.get('/', auth, adminAuth, categoryController.index);
router.post('/', auth, adminAuth, categoryController.store);
router.get('/:id', auth, adminAuth, categoryController.show);
router.put('/:id', auth, adminAuth, categoryController.update);
router.delete('/:id', auth, adminAuth, categoryController.destroy);

module.exports = router;
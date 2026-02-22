const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/DashboardController');
const { auth, adminAuth } = require('../middleware/auth');

// 获取仪表盘统计数据
router.get('/stats', auth, adminAuth, dashboardController.getStats);

module.exports = router;
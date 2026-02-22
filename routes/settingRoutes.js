const express = require('express');
const router = express.Router();
const settingController = require('../controllers/SettingController');
const { auth, adminAuth } = require('../middleware/auth');

// 获取系统设置
router.get('/', auth, adminAuth, settingController.getSettings);

// 更新系统设置
router.put('/', auth, adminAuth, settingController.updateSetting);

module.exports = router;
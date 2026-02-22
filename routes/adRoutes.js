const express = require('express');
const router = express.Router();
const adController = require('../controllers/AdController');
const { auth, adminAuth } = require('../middleware/auth');

// 广告CRUD路由
router.get('/', auth, adminAuth, adController.index);
router.post('/', auth, adminAuth, adController.store);
router.get('/:id', auth, adminAuth, adController.show);
router.put('/:id', auth, adminAuth, adController.update);
router.delete('/:id', auth, adminAuth, adController.destroy);

// 广告位管理路由
router.get('/positions', auth, adminAuth, adController.getPositions);
router.post('/positions', auth, adminAuth, adController.createPosition);
router.get('/positions/:id', auth, adminAuth, adController.getPositionById);
router.put('/positions/:id', auth, adminAuth, adController.updatePosition);
router.delete('/positions/:id', auth, adminAuth, adController.deletePosition);

// 广告统计路由
router.get('/statistics', auth, adminAuth, adController.getStatistics);

module.exports = router;
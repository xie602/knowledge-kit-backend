const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/RecommendController');
const { auth, adminAuth } = require('../middleware/auth');

// CRUD路由
router.get('/', auth, adminAuth, recommendController.index);
router.post('/', auth, adminAuth, recommendController.store);
router.get('/:id', auth, adminAuth, recommendController.show);
router.put('/:id', auth, adminAuth, recommendController.update);
router.delete('/:id', auth, adminAuth, recommendController.destroy);

module.exports = router;
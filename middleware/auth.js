const jwt = require('jsonwebtoken');
// 导入内存存储
const memoryStorage = require('../utils/memoryStorage');

// 从请求中获取内存存储
function getStorage(req) {
  if (req && req.memoryStorage) return req.memoryStorage;
  return memoryStorage;
}

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: '未授权，请登录' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    
    // 检查是否使用内存存储
    if (!process.env.MONGODB_URI) {
      // 使用内存存储
      const storage = getStorage(req);
      const user = storage.users.find(u => u._id === decoded.userId);
      if (!user || user.status !== 'active') {
        return res.status(401).json({ message: '用户不存在或已被禁用' });
      }
      req.userDb = user;
    } else {
      // 使用MongoDB
      const User = require('../models/User');
      const user = await User.findById(decoded.userId);
      if (!user || user.status !== 'active') {
        return res.status(401).json({ message: '用户不存在或已被禁用' });
      }
      req.userDb = user;
    }
    
    next();
  } catch (error) {
    console.error('认证失败:', error);
    res.status(401).json({ message: '认证失败，请重新登录' });
  }
};

// 管理员权限中间件
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: '未授权，请登录' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // 检查是否使用内存存储
    if (!process.env.MONGODB_URI) {
      // 使用内存存储
      const storage = getStorage(req);
      const user = storage.users.find(u => u._id === decoded.userId);
      if (!user || user.status !== 'active') {
        return res.status(401).json({ message: '用户不存在或已被禁用' });
      }
      // 检查用户是否为管理员
      if (user.role !== 'admin') {
        return res.status(403).json({ message: '权限不足，仅管理员可访问' });
      }
      req.userDb = user;
    } else {
      // 使用MongoDB
      const User = require('../models/User');
      const user = await User.findById(decoded.userId);
      if (!user || user.status !== 'active') {
        return res.status(401).json({ message: '用户不存在或已被禁用' });
      }
      // 检查用户是否为管理员
      if (user.role !== 'admin') {
        return res.status(403).json({ message: '权限不足，仅管理员可访问' });
      }
      req.userDb = user;
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('认证失败:', error);
    res.status(401).json({ message: '认证失败，请重新登录' });
  }
};

module.exports = { auth, adminAuth };
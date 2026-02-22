const jwt = require('jsonwebtoken');

// 共享内存存储（用于内存模式）
const memoryStorage = require('../utils/memoryStorage');

// 从请求中获取内存存储（保留兼容性）
function getStorage(req) {
  if (req && req.memoryStorage) return req.memoryStorage;
  return memoryStorage;
}

// Web后台管理员登录
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    // 从内存存储中查找管理员
    const storage = getStorage({});
    const admin = storage.users.find(u => u.role === 'admin');

    // 简化验证：直接使用默认管理员
    if (username === 'admin' && password === 'admin123') {
      // 生成token
      const token = jwt.sign(
        { userId: admin ? admin._id : 'admin_local_' + Date.now(), username, role: 'admin' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: '登录成功',
        token,
        user: {
          id: admin ? admin._id : 'admin_local',
          username,
          role: 'admin',
          nickname: '管理员'
        }
      });
    }

    res.status(401).json({ message: '用户名或密码错误' });
  } catch (error) {
    console.error('管理员登录失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 模拟模型
class MockModel {
  constructor(data) {
    Object.assign(this, data);
    this._id = this._id || Date.now().toString();
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = this.updatedAt || new Date();
  }
  
  save() {
    const storage = getStorage({});
    const collection = this.constructor.name === 'User' ? storage.users : storage.cards;
    const index = collection.findIndex(item => item._id === this._id);
    if (index !== -1) {
      collection[index] = this;
    } else {
      collection.push(this);
    }
    this.updatedAt = new Date();
    return Promise.resolve(this);
  }
  
  static find(query) {
    const storage = getStorage({});
    const collection = this.name === 'User' ? storage.users : storage.cards;
    let results = collection;
    
    // 简单的查询过滤
    for (const [key, value] of Object.entries(query)) {
      results = results.filter(item => {
        if (key === 'isPermanent') {
          return item.isPermanent === (value === 'true');
        }
        return item[key] === value;
      });
    }
    
    return {
      sort: function(sortObj) {
        return {
          limit: function(limit) {
            return {
              skip: function(skip) {
                return {
                  select: function() {
                    return Promise.resolve(results.slice(skip, skip + limit));
                  }
                };
              }
            };
          }
        };
      }
    };
  }
  
  static findOne(query, req) {
    const storage = getStorage(req || {});
    const collection = this.name === 'User' ? storage.users : storage.cards;
    let result = collection.find(item => {
      for (const [key, value] of Object.entries(query)) {
        if (item[key] !== value) return false;
      }
      return true;
    });
    return Promise.resolve(result ? new this(result) : null);
  }
  
  static countDocuments(query, req) {
    const storage = getStorage(req || {});
    const collection = this.name === 'User' ? storage.users : storage.cards;
    let count = collection.length;
    return Promise.resolve(count);
  }
  
  static findById(id, req) {
    const storage = getStorage(req || {});
    const collection = this.name === 'User' ? storage.users : storage.cards;
    const result = collection.find(item => item._id === id);
    return Promise.resolve(result ? new this(result) : null);
  }
}

class User extends MockModel {}
class Card extends MockModel {}

// 用户登录/注册
exports.login = async (req, res) => {
  try {
    const { openid, nickname, avatar } = req.body;
    
    if (!openid) {
      return res.status(400).json({ message: '缺少openid' });
    }
    
    // 查找或创建用户
    let user = await User.findOne({ openid });
    
    if (!user) {
      user = new User({
        openid,
        nickname,
        avatar
      });
      await user.save();
    } else {
      // 更新用户信息
      if (nickname) user.nickname = nickname;
      if (avatar) user.avatar = avatar;
      await user.save();
    }
    
    // 生成token
    const token = jwt.sign(
      { userId: user._id, openid: user.openid },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        openid: user.openid,
        nickname: user.nickname,
        avatar: user.avatar,
        isPermanent: user.isPermanent,
        expireDate: user.expireDate,
        downloadCount: user.downloadCount
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取用户信息
exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        openid: user.openid,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role,
        isPermanent: user.isPermanent,
        expireDate: user.expireDate,
        downloadCount: user.downloadCount
      }
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 验证卡片
exports.verifyCard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cardNumber } = req.body;
    
    if (!cardNumber) {
      return res.status(400).json({ message: '缺少卡片编号' });
    }
    
    // 验证卡片格式 (8-12位数字)
    if (!/^\d{8,12}$/.test(cardNumber)) {
      return res.status(400).json({ message: '卡片编号格式不正确' });
    }
    
    // 查找卡密
    const card = await Card.findOne({ cardNumber });
    
    if (!card) {
      return res.status(400).json({ message: '无效的卡片编号' });
    }
    
    // 检查卡密状态
    if (card.status === 'used') {
      return res.status(400).json({ message: '卡片已被使用' });
    }
    
    if (card.status === 'disabled') {
      return res.status(400).json({ message: '卡片已被禁用' });
    }
    
    // 检查卡密是否过期
    if (card.expireDate && card.expireDate < new Date()) {
      return res.status(400).json({ message: '卡片已过期' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 更新卡密状态
    card.status = 'used';
    card.userId = user._id;
    card.usedAt = new Date();
    await card.save();
    
    // 设置用户为永久用户或7天用户
    if (card.type === 'permanent') {
      user.isPermanent = true;
      user.expireDate = null; // 永久用户没有过期时间
    } else if (card.type === '7days') {
      user.isPermanent = false;
      user.expireDate = card.expireDate;
    }
    
    user.cardNumber = cardNumber;
    await user.save();
    
    res.json({
      success: true,
      message: `卡片验证成功，您已成为${card.type === 'permanent' ? '永久' : '7天'}用户`,
      user: {
        id: user._id,
        openid: user.openid,
        nickname: user.nickname,
        avatar: user.avatar,
        isPermanent: user.isPermanent,
        expireDate: user.expireDate,
        downloadCount: user.downloadCount
      }
    });
  } catch (error) {
    console.error('验证卡片失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取用户统计数据
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 返回用户统计数据
    const stats = {
      totalDownloads: user.downloadCount,
      totalFavorites: user.favoriteDocuments.length,
      totalDocumentsDownloaded: user.downloadedDocuments.length
    };
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('获取用户统计数据失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 检查文档是否被收藏
exports.checkFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { documentId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    const isFavorite = user.favoriteDocuments.some(favId => favId.equals(documentId));
    
    res.json({
      success: true,
      isFavorite
    });
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 创建管理员（仅限已有管理员）
exports.createAdmin = async (req, res) => {
  try {
    const requestingUserId = req.user.userId;
    
    // 验证请求用户是否为管理员
    const requestingUser = await User.findById(requestingUserId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: '权限不足，仅管理员可创建管理员账户' });
    }
    
    const { openid, nickname } = req.body;
    
    if (!openid) {
      return res.status(400).json({ message: '缺少openid' });
    }
    
    // 检查是否已存在该用户
    let user = await User.findOne({ openid });
    
    if (user) {
      // 如果用户已存在，更新其角色为管理员
      user.role = 'admin';
      await user.save();
    } else {
      // 创建新管理员用户
      user = new User({
        openid,
        nickname: nickname || 'Admin User',
        role: 'admin'
      });
      await user.save();
    }
    
    res.json({
      success: true,
      message: '管理员创建成功',
      user: {
        id: user._id,
        openid: user.openid,
        nickname: user.nickname,
        role: user.role
      }
    });
  } catch (error) {
    console.error('创建管理员失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取所有用户（仅限管理员）
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, isPermanent, sort, order } = req.query;
    
    // 构建查询条件
    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;
    if (isPermanent !== undefined) query.isPermanent = isPermanent === 'true';
    
    // 构建排序对象
    let sortObj = { createdAt: -1 };
    if (sort && order) {
      sortObj = {};
      sortObj[sort] = order === 'desc' ? -1 : 1;
    }
    
    const users = await User.find(query)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v'); // 排除版本字段
    
    const total = await User.countDocuments(query);
    
    // 为了兼容前端，同时返回两种格式
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit)
        }
      },
      // 同时返回兼容旧格式的数据
      users: users,
      total: total
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新用户角色（仅限管理员）
exports.updateUserRole = async (req, res) => {
  try {
    const requestingUserId = req.user.userId;
    
    // 验证请求用户是否为管理员
    const requestingUser = await User.findById(requestingUserId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: '权限不足，仅管理员可更新用户角色' });
    }
    
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!userId || !role) {
      return res.status(400).json({ message: '缺少必要参数' });
    }
    
    // 验证角色是否有效
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: '无效的角色' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 防止降级自己的管理员权限
    if (user._id.toString() === requestingUserId && role !== 'admin') {
      return res.status(400).json({ message: '不能更改自己的角色' });
    }
    
    user.role = role;
    await user.save();
    
    res.json({
      success: true,
      message: '用户角色更新成功',
      user: {
        id: user._id,
        openid: user.openid,
        nickname: user.nickname,
        role: user.role
      }
    });
  } catch (error) {
    console.error('更新用户角色失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 批量生成卡密（仅限管理员）
exports.generateCards = async (req, res) => {
  try {
    const requestingUserId = req.user.userId;
    
    // 验证请求用户是否为管理员
    const requestingUser = await User.findById(requestingUserId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: '权限不足，仅管理员可生成卡密' });
    }
    
    const { count = 10, type = 'permanent' } = req.body;
    
    // 验证参数
    if (count <= 0 || count > 1000) {
      return res.status(400).json({ message: '生成数量必须在1-1000之间' });
    }
    
    if (!['7days', 'permanent'].includes(type)) {
      return res.status(400).json({ message: '无效的卡密类型' });
    }
    
    // 生成卡密
    const generatedCards = [];
    for (let i = 0; i < count; i++) {
      // 生成11位数字加字母的随机组合卡密
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let cardNumber = '';
      for (let i = 0; i < 11; i++) {
        cardNumber += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      
      // 检查卡密是否已存在
      const existingCard = await Card.findOne({ cardNumber });
      if (existingCard) {
        i--; // 重新生成
        continue;
      }
      
      // 设置过期时间
      let expireDate = null;
      if (type === '7days') {
        expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 7);
      }
      
      const card = new Card({
        cardNumber,
        type,
        expireDate
      });
      
      await card.save();
      generatedCards.push(card);
    }
    
    res.json({
      success: true,
      message: `成功生成${generatedCards.length}个${type === 'permanent' ? '永久' : '7天'}卡密`,
      cards: generatedCards.map(card => ({
        cardNumber: card.cardNumber,
        type: card.type,
        status: card.status,
        createdAt: card.createdAt,
        expireDate: card.expireDate
      }))
    });
  } catch (error) {
    console.error('生成卡密失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 查看卡密使用情况（仅限管理员）
exports.getCards = async (req, res) => {
  try {
    const requestingUserId = req.user.userId;
    
    // 验证请求用户是否为管理员
    const requestingUser = await User.findById(requestingUserId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: '权限不足，仅管理员可查看卡密' });
    }
    
    const { page = 1, limit = 20, status, type } = req.query;
    
    // 构建查询条件
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    
    const cards = await Card.find(query)
      .populate('userId', 'nickname avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Card.countDocuments(query);
    
    const formattedCards = cards.map(card => ({
      cardNumber: card.cardNumber,
      type: card.type,
      status: card.status,
      user: card.userId ? {
        id: card.userId._id,
        nickname: card.userId.nickname,
        avatar: card.userId.avatar
      } : null,
      createdAt: card.createdAt,
      usedAt: card.usedAt,
      expireDate: card.expireDate
    }));
    
    // 为了兼容前端，同时返回两种格式
    res.json({
      success: true,
      data: {
        cards: formattedCards,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit)
        }
      },
      // 同时返回兼容旧格式的数据
      cards: formattedCards,
      total: total
    });
  } catch (error) {
    console.error('查看卡密失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 禁用卡密（仅限管理员）
exports.disableCard = async (req, res) => {
  try {
    const requestingUserId = req.user.userId;
    
    // 验证请求用户是否为管理员
    const requestingUser = await User.findById(requestingUserId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: '权限不足，仅管理员可禁用卡密' });
    }
    
    const { cardNumber } = req.params;
    
    if (!cardNumber) {
      return res.status(400).json({ message: '缺少卡密编号' });
    }
    
    const card = await Card.findOne({ cardNumber });
    
    if (!card) {
      return res.status(404).json({ message: '卡密不存在' });
    }
    
    // 禁用卡密
    card.status = 'disabled';
    await card.save();
    
    // 如果卡密已被使用，更新用户状态
    if (card.userId && card.status === 'used') {
      const user = await User.findById(card.userId);
      if (user) {
        user.isPermanent = false;
        user.expireDate = new Date(); // 立即过期
        await user.save();
      }
    }
    
    res.json({
      success: true,
      message: '卡密已成功禁用',
      card: {
        cardNumber: card.cardNumber,
        type: card.type,
        status: card.status,
        createdAt: card.createdAt,
        usedAt: card.usedAt,
        expireDate: card.expireDate
      }
    });
  } catch (error) {
    console.error('禁用卡密失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 禁用过期卡密（仅限管理员）
exports.disableExpiredCards = async (req, res) => {
  try {
    const requestingUserId = req.user.userId;
    
    // 验证请求用户是否为管理员
    const requestingUser = await User.findById(requestingUserId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: '权限不足，仅管理员可禁用过期卡密' });
    }
    
    // 查找过期的卡密
    const expiredCards = await Card.find({
      status: 'unused',
      expireDate: { $lt: new Date() }
    });
    
    // 禁用过期卡密
    const disabledCount = expiredCards.length;
    for (const card of expiredCards) {
      card.status = 'disabled';
      await card.save();
    }
    
    // 查找已使用且过期的卡密对应的用户
    const usedExpiredCards = await Card.find({
      status: 'used',
      expireDate: { $lt: new Date() }
    });
    
    // 更新过期用户的状态
    const updatedUserCount = usedExpiredCards.length;
    for (const card of usedExpiredCards) {
      if (card.userId) {
        const user = await User.findById(card.userId);
        if (user && user.isPermanent) {
          user.isPermanent = false;
          user.expireDate = new Date();
          await user.save();
        }
      }
    }
    
    res.json({
      success: true,
      message: `成功禁用${disabledCount}个过期卡密，更新${updatedUserCount}个过期用户状态`
    });
  } catch (error) {
    console.error('禁用过期卡密失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 手动设置用户为永久用户（仅限管理员）
exports.setPermanentUser = async (req, res) => {
  try {
    const requestingUserId = req.user.userId;
    
    // 验证请求用户是否为管理员
    const requestingUser = await User.findById(requestingUserId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: '权限不足，仅管理员可设置永久用户' });
    }
    
    const { userId } = req.params;
    const { isPermanent } = req.body;
    
    if (!userId || isPermanent === undefined) {
      return res.status(400).json({ message: '缺少必要参数' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 更新用户状态
    user.isPermanent = isPermanent;
    if (isPermanent) {
      user.expireDate = null; // 永久用户没有过期时间
    } else {
      user.expireDate = new Date(); // 非永久用户立即过期
    }
    await user.save();
    
    res.json({
      success: true,
      message: `用户已${isPermanent ? '设置为永久用户' : '取消永久用户状态'}`,
      user: {
        id: user._id,
        openid: user.openid,
        nickname: user.nickname,
        isPermanent: user.isPermanent,
        expireDate: user.expireDate
      }
    });
  } catch (error) {
    console.error('设置永久用户失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 用户数据分析（仅限管理员）
exports.analyzeUsers = async (req, res) => {
  try {
    const requestingUserId = req.user.userId;
    
    // 验证请求用户是否为管理员
    const requestingUser = await User.findById(requestingUserId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: '权限不足，仅管理员可查看用户数据分析' });
    }
    
    // 获取用户统计数据
    const totalUsers = await User.countDocuments({ role: 'user' });
    const permanentUsers = await User.countDocuments({ role: 'user', isPermanent: true });
    const regularUsers = totalUsers - permanentUsers;
    
    // 获取活跃用户数据（最近7天有登录或操作的用户）
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // 这里简化处理，实际应该根据用户操作日志来判断
    const activeUsers = await User.countDocuments({ 
      role: 'user',
      updatedAt: { $gte: sevenDaysAgo }
    });
    
    // 获取下载偏好数据
    const usersWithDownloads = await User.find({ 
      role: 'user',
      downloadCount: { $gt: 0 }
    }).select('downloadCount favoriteDocuments downloadedDocuments');
    
    let totalDownloads = 0;
    let totalFavorites = 0;
    usersWithDownloads.forEach(user => {
      totalDownloads += user.downloadCount;
      totalFavorites += user.favoriteDocuments ? user.favoriteDocuments.length : 0;
    });
    
    const avgDownloadsPerUser = usersWithDownloads.length > 0 ? totalDownloads / usersWithDownloads.length : 0;
    const avgFavoritesPerUser = usersWithDownloads.length > 0 ? totalFavorites / usersWithDownloads.length : 0;
    
    // 获取用户注册趋势（最近30天）
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const registrationTrend = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
      const count = await User.countDocuments({ 
        role: 'user',
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      });
      
      registrationTrend.push({
        date: startOfDay.toISOString().split('T')[0],
        count
      });
    }
    
    const analysisData = {
      userStats: {
        totalUsers,
        permanentUsers,
        regularUsers,
        activeUsers,
        activeRate: totalUsers > 0 ? (activeUsers / totalUsers * 100).toFixed(2) : 0
      },
      downloadStats: {
        totalDownloads,
        totalFavorites,
        avgDownloadsPerUser: avgDownloadsPerUser.toFixed(2),
        avgFavoritesPerUser: avgFavoritesPerUser.toFixed(2)
      },
      registrationTrend
    };
    
    // 为了兼容前端，同时返回两种格式
    res.json({
      success: true,
      data: analysisData,
      // 同时返回兼容旧格式的数据
      ...analysisData
    });
  } catch (error) {
    console.error('用户数据分析失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 用户状态管理（启用/禁用用户，仅限管理员）
exports.updateUserStatus = async (req, res) => {
  try {
    const requestingUserId = req.user.userId;
    
    // 验证请求用户是否为管理员
    const requestingUser = await User.findById(requestingUserId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: '权限不足，仅管理员可更新用户状态' });
    }
    
    const { userId } = req.params;
    const { status } = req.body;
    
    if (!userId || !status) {
      return res.status(400).json({ message: '缺少必要参数' });
    }
    
    // 验证状态是否有效
    if (!['active', 'inactive', 'banned'].includes(status)) {
      return res.status(400).json({ message: '无效的用户状态' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 更新用户状态
    user.status = status;
    await user.save();
    
    res.json({
      success: true,
      message: '用户状态更新成功',
      user: {
        id: user._id,
        openid: user.openid,
        nickname: user.nickname,
        status: user.status
      }
    });
  } catch (error) {
    console.error('更新用户状态失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取单个用户（仅限管理员）
exports.getUserById = async (req, res) => {
  try {
    const requestingUserId = req.user.userId;
    const requestingUser = await User.findById(requestingUserId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: '权限不足' });
    }

    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: '缺少用户ID' });

    const user = await User.findById(userId).select('-__v');
    if (!user) return res.status(404).json({ message: '用户不存在' });

    res.json({ success: true, user });
  } catch (error) {
    console.error('获取用户失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 后台通用更新用户（仅限管理员）
exports.updateUser = async (req, res) => {
  try {
    const requestingUserId = req.user.userId;
    const requestingUser = await User.findById(requestingUserId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: '权限不足' });
    }

    const { userId } = req.params;
    const { role, downloadCount, nickname } = req.body;

    if (!userId) return res.status(400).json({ message: '缺少用户ID' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: '用户不存在' });

    // 防止管理员降级自己
    if (user._id.toString() === requestingUserId && role && role !== 'admin') {
      return res.status(400).json({ message: '不能更改自己的角色' });
    }

    if (role) {
      if (!['user', 'admin'].includes(role)) return res.status(400).json({ message: '无效的角色' });
      user.role = role;
    }
    if (typeof downloadCount !== 'undefined') user.downloadCount = Number(downloadCount) || 0;
    if (typeof nickname !== 'undefined') user.nickname = nickname;

    await user.save();

    res.json({ success: true, message: '用户更新成功', user });
  } catch (error) {
    console.error('更新用户失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 删除用户（仅限管理员）
exports.deleteUser = async (req, res) => {
  try {
    const requestingUserId = req.user.userId;
    const requestingUser = await User.findById(requestingUserId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: '权限不足' });
    }

    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: '缺少用户ID' });

    // 防止删除自己
    if (userId === requestingUserId) return res.status(400).json({ message: '不能删除自己' });

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: '用户不存在' });

    // 清理相关卡密关联（将卡密重置为未使用）
    if (typeof Card !== 'undefined') {
      await Card.updateMany({ userId }, { $set: { userId: null, status: 'unused' } });
    }

    res.json({ success: true, message: '用户已删除' });
  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 导出用户数据（仅限管理员）
exports.exportUsers = async (req, res) => {
  try {
    const requestingUserId = req.user.userId;
    const requestingUser = await User.findById(requestingUserId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: '权限不足' });
    }

    const users = await User.find({}).select('-__v');
    // 导出为 JSON 文件响应
    res.setHeader('Content-Disposition', 'attachment; filename=users.json');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('导出用户数据失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};
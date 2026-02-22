const Recommend = require('../models/Recommend');

class RecommendController {
  // 获取推荐列表
  async index(req, res) {
    try {
      const { page = 1, limit = 10, enabled, keyword } = req.query;
      const query = {};

      if (enabled !== undefined) {
        query.enabled = enabled === 'true';
      }

      if (keyword) {
        query.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } }
        ];
      }

      const recommendations = await Recommend.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ order: 1, createdAt: -1 });

      const total = await Recommend.countDocuments(query);

      res.json({
        success: true,
        data: recommendations,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total
      });
    } catch (error) {
      console.error('获取推荐列表失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 获取单个推荐
  async show(req, res) {
    try {
      const recommendation = await Recommend.findById(req.params.id);

      if (!recommendation) {
        return res.status(404).json({ success: false, message: '推荐不存在' });
      }

      res.json({ success: true, data: recommendation });
    } catch (error) {
      console.error('获取推荐失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 创建推荐
  async store(req, res) {
    try {
      const {
        name,
        appId,
        title,
        description,
        icon,
        path,
        order = 0,
        enabled = true,
        remark
      } = req.body;

      // 验证必要字段
      if (!name || !appId) {
        return res.status(400).json({ success: false, message: '小程序名称和AppID为必填项' });
      }

      // 检查AppID是否已存在
      const existingRecommend = await Recommend.findOne({ appId });
      if (existingRecommend) {
        return res.status(400).json({ success: false, message: 'AppID已存在' });
      }

      const recommendation = new Recommend({
        name,
        appId,
        title: title || name,
        description: description || '',
        icon: icon || '',
        path: path || '',
        order,
        enabled,
        remark: remark || '',
        createdBy: req.user._id
      });

      await recommendation.save();

      res.status(201).json({ success: true, data: recommendation });
    } catch (error) {
      console.error('创建推荐失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 更新推荐
  async update(req, res) {
    try {
      const {
        name,
        appId,
        title,
        description,
        icon,
        path,
        order,
        enabled,
        remark
      } = req.body;

      const recommendation = await Recommend.findById(req.params.id);
      if (!recommendation) {
        return res.status(404).json({ success: false, message: '推荐不存在' });
      }

      // 检查AppID是否与其他推荐冲突
      if (appId && appId !== recommendation.appId) {
        const existingRecommend = await Recommend.findOne({ appId, _id: { $ne: req.params.id } });
        if (existingRecommend) {
          return res.status(400).json({ success: false, message: 'AppID已存在' });
        }
      }

      // 更新字段
      if (name) recommendation.name = name;
      if (appId) recommendation.appId = appId;
      if (title !== undefined) recommendation.title = title;
      if (description !== undefined) recommendation.description = description;
      if (icon !== undefined) recommendation.icon = icon;
      if (path !== undefined) recommendation.path = path;
      if (order !== undefined) recommendation.order = order;
      if (enabled !== undefined) recommendation.enabled = enabled;
      if (remark !== undefined) recommendation.remark = remark;

      await recommendation.save();

      res.json({ success: true, data: recommendation });
    } catch (error) {
      console.error('更新推荐失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 删除推荐
  async destroy(req, res) {
    try {
      const recommendation = await Recommend.findByIdAndDelete(req.params.id);

      if (!recommendation) {
        return res.status(404).json({ success: false, message: '推荐不存在' });
      }

      res.json({ success: true, message: '推荐删除成功' });
    } catch (error) {
      console.error('删除推荐失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new RecommendController();
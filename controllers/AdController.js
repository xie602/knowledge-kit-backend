const Ad = require('../models/Ad');
const AdPosition = require('../models/AdPosition');

class AdController {
  // 获取广告列表
  async index(req, res) {
    try {
      const { page = 1, limit = 10, position, type, enabled, keyword } = req.query;
      const query = {};

      if (position) {
        query.position = position;
      }

      if (type) {
        query.type = type;
      }

      if (enabled !== undefined) {
        query.enabled = enabled === 'true';
      }

      if (keyword) {
        query.$or = [
          { title: { $regex: keyword, $options: 'i' } },
          { content: { $regex: keyword, $options: 'i' } }
        ];
      }

      const ads = await Ad.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ priority: -1, createdAt: -1 });

      const total = await Ad.countDocuments(query);

      res.json({
        success: true,
        data: ads,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total
      });
    } catch (error) {
      console.error('获取广告列表失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 获取单个广告
  async show(req, res) {
    try {
      const ad = await Ad.findById(req.params.id);

      if (!ad) {
        return res.status(404).json({ success: false, message: '广告不存在' });
      }

      res.json({ success: true, data: ad });
    } catch (error) {
      console.error('获取广告失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 创建广告
  async store(req, res) {
    try {
      const {
        title,
        position,
        type = 'banner',
        content,
        adUnitId,
        targetUrl,
        imageUrl,
        enabled = true,
        startDate,
        endDate,
        priority = 0
      } = req.body;

      // 验证必要字段
      if (!title || !position) {
        return res.status(400).json({ success: false, message: '标题和位置为必填项' });
      }

      const ad = new Ad({
        title,
        position,
        type,
        content: content || '',
        adUnitId: adUnitId || '',
        targetUrl: targetUrl || '',
        imageUrl: imageUrl || '',
        enabled,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        priority,
        createdBy: req.user._id
      });

      await ad.save();

      res.status(201).json({ success: true, data: ad });
    } catch (error) {
      console.error('创建广告失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 更新广告
  async update(req, res) {
    try {
      const {
        title,
        position,
        type,
        content,
        adUnitId,
        targetUrl,
        imageUrl,
        enabled,
        startDate,
        endDate,
        priority
      } = req.body;

      const ad = await Ad.findById(req.params.id);
      if (!ad) {
        return res.status(404).json({ success: false, message: '广告不存在' });
      }

      // 更新字段
      if (title) ad.title = title;
      if (position) ad.position = position;
      if (type !== undefined) ad.type = type;
      if (content !== undefined) ad.content = content;
      if (adUnitId !== undefined) ad.adUnitId = adUnitId;
      if (targetUrl !== undefined) ad.targetUrl = targetUrl;
      if (imageUrl !== undefined) ad.imageUrl = imageUrl;
      if (enabled !== undefined) ad.enabled = enabled;
      if (startDate !== undefined) ad.startDate = startDate ? new Date(startDate) : null;
      if (endDate !== undefined) ad.endDate = endDate ? new Date(endDate) : null;
      if (priority !== undefined) ad.priority = priority;

      await ad.save();

      res.json({ success: true, data: ad });
    } catch (error) {
      console.error('更新广告失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 删除广告
  async destroy(req, res) {
    try {
      const ad = await Ad.findByIdAndDelete(req.params.id);

      if (!ad) {
        return res.status(404).json({ success: false, message: '广告不存在' });
      }

      res.json({ success: true, message: '广告删除成功' });
    } catch (error) {
      console.error('删除广告失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 获取广告位列表
  async getPositions(req, res) {
    try {
      const { page = 1, limit = 10, status, keyword } = req.query;
      const query = {};

      if (status) {
        query.status = status;
      }

      if (keyword) {
        query.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { key: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } }
        ];
      }

      const positions = await AdPosition.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const total = await AdPosition.countDocuments(query);

      res.json({
        success: true,
        data: positions,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total
      });
    } catch (error) {
      console.error('获取广告位列表失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 获取单个广告位
  async getPositionById(req, res) {
    try {
      const position = await AdPosition.findById(req.params.id);

      if (!position) {
        return res.status(404).json({ success: false, message: '广告位不存在' });
      }

      res.json({ success: true, data: position });
    } catch (error) {
      console.error('获取广告位失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 创建广告位
  async createPosition(req, res) {
    try {
      const { name, key, description, width, height, status = 'active' } = req.body;

      // 验证必要字段
      if (!name || !key) {
        return res.status(400).json({ success: false, message: '名称和标识为必填项' });
      }

      const position = new AdPosition({
        name,
        key,
        description: description || '',
        width: width || null,
        height: height || null,
        status,
        createdBy: req.user._id
      });

      await position.save();

      res.status(201).json({ success: true, data: position });
    } catch (error) {
      console.error('创建广告位失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 更新广告位
  async updatePosition(req, res) {
    try {
      const { name, key, description, width, height, status } = req.body;

      const position = await AdPosition.findById(req.params.id);
      if (!position) {
        return res.status(404).json({ success: false, message: '广告位不存在' });
      }

      // 更新字段
      if (name) position.name = name;
      if (key) position.key = key;
      if (description !== undefined) position.description = description;
      if (width !== undefined) position.width = width || null;
      if (height !== undefined) position.height = height || null;
      if (status !== undefined) position.status = status;

      await position.save();

      res.json({ success: true, data: position });
    } catch (error) {
      console.error('更新广告位失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 删除广告位
  async deletePosition(req, res) {
    try {
      const position = await AdPosition.findByIdAndDelete(req.params.id);

      if (!position) {
        return res.status(404).json({ success: false, message: '广告位不存在' });
      }

      res.json({ success: true, message: '广告位删除成功' });
    } catch (error) {
      console.error('删除广告位失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 获取广告统计数据
  async getStatistics(req, res) {
    try {
      // 这里可以实现真实的统计逻辑，现在返回模拟数据
      const statistics = {
        clicks: [
          { date: '1日', count: 120 },
          { date: '2日', count: 150 },
          { date: '3日', count: 180 },
          { date: '4日', count: 160 },
          { date: '5日', count: 200 },
          { date: '6日', count: 220 },
          { date: '7日', count: 190 }
        ],
        impressions: [
          { date: '1日', count: 1200 },
          { date: '2日', count: 1500 },
          { date: '3日', count: 1800 },
          { date: '4日', count: 1600 },
          { date: '5日', count: 2000 },
          { date: '6日', count: 2200 },
          { date: '7日', count: 1900 }
        ],
        performance: [
          { adTitle: '测试广告1', clicks: 220, impressions: 2200 },
          { adTitle: '测试广告2', clicks: 190, impressions: 1900 },
          { adTitle: '测试广告3', clicks: 180, impressions: 1800 },
          { adTitle: '测试广告4', clicks: 160, impressions: 1600 },
          { adTitle: '测试广告5', clicks: 150, impressions: 1500 }
        ]
      };

      res.json({ success: true, data: statistics });
    } catch (error) {
      console.error('获取广告统计数据失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AdController();
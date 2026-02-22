const Category = require('../models/Category');

class CategoryController {
  // 获取分类树结构
  async getCategoryTree(req, res) {
    try {
      // 获取所有分类，按层级排序
      const categories = await Category.find().sort({ order: 1, createdAt: 1 });
      
      // 构建树形结构
      const categoryMap = {};
      const tree = [];

      // 首先创建所有分类的映射
      categories.forEach(cat => {
        categoryMap[cat._id.toString()] = {
          _id: cat._id,
          name: cat.name,
          type: cat.type,
          parentId: cat.parentId,
          description: cat.description,
          icon: cat.icon,
          color: cat.color,
          order: cat.order,
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
          children: []
        };
      });

      // 构建父子关系
      categories.forEach(cat => {
        const catObj = categoryMap[cat._id.toString()];
        
        if (!cat.parentId) {
          // 根节点
          tree.push(catObj);
        } else {
          // 子节点
          const parent = categoryMap[cat.parentId];
          if (parent) {
            parent.children.push(catObj);
          }
        }
      });

      res.json({ tree });
    } catch (error) {
      console.error('获取分类树失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 获取分类列表
  async index(req, res) {
    try {
      const { page = 1, limit = 10, type, keyword } = req.query;
      const query = {};
      
      if (type) {
        query.type = type;
      }
      
      if (keyword) {
        query.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } }
        ];
      }

      const categories = await Category.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ order: 1, createdAt: -1 });

      const total = await Category.countDocuments(query);

      res.json({
        success: true,
        data: categories,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total
      });
    } catch (error) {
      console.error('获取分类列表失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 获取单个分类
  async show(req, res) {
    try {
      const category = await Category.findById(req.params.id);
      
      if (!category) {
        return res.status(404).json({ success: false, message: '分类不存在' });
      }

      res.json({ success: true, data: category });
    } catch (error) {
      console.error('获取分类失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 创建分类
  async store(req, res) {
    try {
      const { name, type, parentId, description, icon, color, order } = req.body;

      // 检查分类名是否已存在
      const existingCategory = await Category.findOne({ name, parentId: parentId || null });
      if (existingCategory) {
        return res.status(400).json({ success: false, message: '同级别下分类名称已存在' });
      }

      const category = new Category({
        name,
        type,
        parentId: parentId || null,
        description: description || '',
        icon: icon || '',
        color: color || '#4CAF50',
        order: order || 0,
        createdBy: req.user._id // 假设中间件已验证用户身份
      });

      await category.save();

      res.status(201).json({ success: true, data: category });
    } catch (error) {
      console.error('创建分类失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 更新分类
  async update(req, res) {
    try {
      const { name, type, parentId, description, icon, color, order } = req.body;

      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ success: false, message: '分类不存在' });
      }

      // 检查同级分类名是否重复
      const existingCategory = await Category.findOne({ 
        name, 
        parentId: parentId || null,
        _id: { $ne: req.params.id }
      });
      if (existingCategory) {
        return res.status(400).json({ success: false, message: '同级别下分类名称已存在' });
      }

      category.name = name;
      category.type = type;
      category.parentId = parentId || null;
      category.description = description;
      category.icon = icon;
      category.color = color;
      category.order = order;

      await category.save();

      res.json({ success: true, data: category });
    } catch (error) {
      console.error('更新分类失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 删除分类
  async destroy(req, res) {
    try {
      const categoryId = req.params.id;

      // 检查是否存在子分类
      const childCategories = await Category.find({ parentId: categoryId });
      if (childCategories.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: '该分类下存在子分类，无法删除，请先删除所有子分类' 
        });
      }

      // TODO: 检查是否有文档关联到此分类，如需要可添加相关检查

      const category = await Category.findByIdAndDelete(categoryId);
      if (!category) {
        return res.status(404).json({ success: false, message: '分类不存在' });
      }

      res.json({ success: true, message: '分类删除成功' });
    } catch (error) {
      console.error('删除分类失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CategoryController();
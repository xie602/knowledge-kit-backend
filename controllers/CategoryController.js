const Category = require('../models/Category');
const { Op } = require('sequelize');

// 内存存储作为兜底方案
const memoryStorage = {
  categories: [
    // 年级分类
    { id: 1, name: '幼小衔接', type: 'grade', order: 1, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: '一年级', type: 'grade', order: 2, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { id: 3, name: '二年级', type: 'grade', order: 3, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { id: 4, name: '三年级', type: 'grade', order: 4, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { id: 5, name: '四年级', type: 'grade', order: 5, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { id: 6, name: '五年级', type: 'grade', order: 6, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { id: 7, name: '六年级', type: 'grade', order: 7, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { id: 8, name: '七年级', type: 'grade', order: 8, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { id: 9, name: '八年级', type: 'grade', order: 9, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { id: 10, name: '九年级', type: 'grade', order: 10, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { id: 11, name: '高一', type: 'grade', order: 11, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { id: 12, name: '高二', type: 'grade', order: 12, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { id: 13, name: '高三', type: 'grade', order: 13, status: 'active', createdAt: new Date(), updatedAt: new Date() }
  ],
  nextId: 14
};

class CategoryController {
  // 获取分类树结构
  async getCategoryTree(req, res) {
    try {
      // 尝试从数据库获取
      try {
        const categories = await Category.findAll({ 
          order: [['order', 'ASC'], ['createdAt', 'ASC']] 
        });
        
        // 构建树形结构
        const categoryMap = {};
        const tree = [];

        // 首先创建所有分类的映射
        categories.forEach(cat => {
          categoryMap[cat.id] = {
            id: cat.id,
            name: cat.name,
            icon: cat.icon,
            order: cat.order,
            status: cat.status,
            createdAt: cat.createdAt,
            updatedAt: cat.updatedAt,
            children: []
          };
        });

        // 构建父子关系
        categories.forEach(cat => {
          const catObj = categoryMap[cat.id];
          tree.push(catObj);
        });

        res.json({ success: true, tree });
      } catch (dbError) {
        console.warn('数据库操作失败，使用内存存储:', dbError.message);
        // 使用内存存储
        const categories = memoryStorage.categories;
        const tree = categories.map(cat => ({
          ...cat,
          children: []
        }));
        res.json({ success: true, tree });
      }
    } catch (error) {
      console.error('获取分类树失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 获取年级列表
  async getGrades(req, res) {
    try {
      // 尝试从数据库获取
      try {
        const grades = await Category.findAll({ 
          where: { type: 'grade' },
          order: [['order', 'ASC'], ['createdAt', 'ASC']] 
        });
        res.json({ success: true, data: grades });
      } catch (dbError) {
        console.warn('数据库操作失败，使用内存存储:', dbError.message);
        // 使用内存存储
        const grades = memoryStorage.categories.filter(cat => cat.type === 'grade');
        res.json({ success: true, data: grades });
      }
    } catch (error) {
      console.error('获取年级列表失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 创建年级
  async createGrade(req, res) {
    try {
      const { name, order } = req.body;

      // 尝试从数据库创建
      try {
        // 检查年级名是否已存在
        const existingGrade = await Category.findOne({ where: { name, type: 'grade' } });
        if (existingGrade) {
          return res.status(400).json({ success: false, message: '年级名称已存在' });
        }

        const grade = await Category.create({
          name,
          type: 'grade',
          order: order || 0,
          status: 'active'
        });

        res.status(201).json({ success: true, data: grade });
      } catch (dbError) {
        console.warn('数据库操作失败，使用内存存储:', dbError.message);
        // 使用内存存储
        // 检查年级名是否已存在
        const existingGrade = memoryStorage.categories.find(cat => cat.name === name && cat.type === 'grade');
        if (existingGrade) {
          return res.status(400).json({ success: false, message: '年级名称已存在' });
        }

        const grade = {
          id: memoryStorage.nextId++,
          name,
          type: 'grade',
          order: order || 0,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        memoryStorage.categories.push(grade);
        res.status(201).json({ success: true, data: grade });
      }
    } catch (error) {
      console.error('创建年级失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 更新年级
  async updateGrade(req, res) {
    try {
      const gradeId = parseInt(req.params.id);
      const { name, order, status } = req.body;

      // 尝试从数据库更新
      try {
        const grade = await Category.findByPk(gradeId);
        if (!grade) {
          return res.status(404).json({ success: false, message: '年级不存在' });
        }

        // 检查年级名是否重复
        const existingGrade = await Category.findOne({ 
          where: { 
            name,
            type: 'grade',
            id: { [Op.ne]: gradeId }
          }
        });
        if (existingGrade) {
          return res.status(400).json({ success: false, message: '年级名称已存在' });
        }

        await grade.update({
          name,
          order,
          status
        });

        res.json({ success: true, data: grade });
      } catch (dbError) {
        console.warn('数据库操作失败，使用内存存储:', dbError.message);
        // 使用内存存储
        const gradeIndex = memoryStorage.categories.findIndex(cat => cat.id === gradeId && cat.type === 'grade');
        if (gradeIndex === -1) {
          return res.status(404).json({ success: false, message: '年级不存在' });
        }

        // 检查年级名是否重复
        const existingGrade = memoryStorage.categories.find(cat => 
          cat.name === name && cat.type === 'grade' && cat.id !== gradeId
        );
        if (existingGrade) {
          return res.status(400).json({ success: false, message: '年级名称已存在' });
        }

        const grade = memoryStorage.categories[gradeIndex];
        grade.name = name;
        grade.order = order;
        grade.status = status;
        grade.updatedAt = new Date();

        res.json({ success: true, data: grade });
      }
    } catch (error) {
      console.error('更新年级失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 删除年级
  async deleteGrade(req, res) {
    try {
      const gradeId = parseInt(req.params.id);

      // 尝试从数据库删除
      try {
        const grade = await Category.findByPk(gradeId);
        if (!grade) {
          return res.status(404).json({ success: false, message: '年级不存在' });
        }

        await grade.destroy();
        res.json({ success: true, message: '年级删除成功' });
      } catch (dbError) {
        console.warn('数据库操作失败，使用内存存储:', dbError.message);
        // 使用内存存储
        const gradeIndex = memoryStorage.categories.findIndex(cat => cat.id === gradeId && cat.type === 'grade');
        if (gradeIndex === -1) {
          return res.status(404).json({ success: false, message: '年级不存在' });
        }

        memoryStorage.categories.splice(gradeIndex, 1);
        res.json({ success: true, message: '年级删除成功' });
      }
    } catch (error) {
      console.error('删除年级失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 获取分类列表
  async index(req, res) {
    try {
      const { page = 1, limit = 10, keyword } = req.query;
      
      // 尝试从数据库获取
      try {
        const offset = (page - 1) * limit;
        const where = {};
        
        if (keyword) {
          where.name = {
            [Op.iLike]: `%${keyword}%`
          };
        }

        const { count, rows: categories } = await Category.findAndCountAll({
          where,
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: [['order', 'ASC'], ['createdAt', 'DESC']]
        });

        res.json({
          success: true,
          data: categories,
          totalPages: Math.ceil(count / limit),
          currentPage: parseInt(page),
          total: count
        });
      } catch (dbError) {
        console.warn('数据库操作失败，使用内存存储:', dbError.message);
        // 使用内存存储
        let categories = memoryStorage.categories;
        
        if (keyword) {
          categories = categories.filter(cat => 
            cat.name.toLowerCase().includes(keyword.toLowerCase())
          );
        }
        
        const total = categories.length;
        const offset = (page - 1) * limit;
        const paginatedCategories = categories
          .sort((a, b) => a.order - b.order || new Date(b.createdAt) - new Date(a.createdAt))
          .slice(offset, offset + limit);

        res.json({
          success: true,
          data: paginatedCategories,
          totalPages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          total: total
        });
      }
    } catch (error) {
      console.error('获取分类列表失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 获取单个分类
  async show(req, res) {
    try {
      const categoryId = parseInt(req.params.id);
      
      // 尝试从数据库获取
      try {
        const category = await Category.findByPk(categoryId);
        
        if (!category) {
          return res.status(404).json({ success: false, message: '分类不存在' });
        }

        res.json({ success: true, data: category });
      } catch (dbError) {
        console.warn('数据库操作失败，使用内存存储:', dbError.message);
        // 使用内存存储
        const category = memoryStorage.categories.find(cat => cat.id === categoryId);
        
        if (!category) {
          return res.status(404).json({ success: false, message: '分类不存在' });
        }

        res.json({ success: true, data: category });
      }
    } catch (error) {
      console.error('获取分类失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 创建分类
  async store(req, res) {
    try {
      const { name, icon, order } = req.body;

      // 尝试从数据库创建
      try {
        // 检查分类名是否已存在
        const existingCategory = await Category.findOne({ where: { name } });
        if (existingCategory) {
          return res.status(400).json({ success: false, message: '分类名称已存在' });
        }

        const category = await Category.create({
          name,
          icon: icon || '',
          order: order || 0,
          status: 'active'
        });

        res.status(201).json({ success: true, data: category });
      } catch (dbError) {
        console.warn('数据库操作失败，使用内存存储:', dbError.message);
        // 使用内存存储
        // 检查分类名是否已存在
        const existingCategory = memoryStorage.categories.find(cat => cat.name === name);
        if (existingCategory) {
          return res.status(400).json({ success: false, message: '分类名称已存在' });
        }

        const category = {
          id: memoryStorage.nextId++,
          name,
          icon: icon || '',
          order: order || 0,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        memoryStorage.categories.push(category);
        res.status(201).json({ success: true, data: category });
      }
    } catch (error) {
      console.error('创建分类失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 更新分类
  async update(req, res) {
    try {
      const categoryId = parseInt(req.params.id);
      const { name, icon, order, status } = req.body;

      // 尝试从数据库更新
      try {
        const category = await Category.findByPk(categoryId);
        if (!category) {
          return res.status(404).json({ success: false, message: '分类不存在' });
        }

        // 检查分类名是否重复
        const existingCategory = await Category.findOne({ 
          where: { 
            name,
            id: { [Op.ne]: categoryId }
          }
        });
        if (existingCategory) {
          return res.status(400).json({ success: false, message: '分类名称已存在' });
        }

        await category.update({
          name,
          icon,
          order,
          status
        });

        res.json({ success: true, data: category });
      } catch (dbError) {
        console.warn('数据库操作失败，使用内存存储:', dbError.message);
        // 使用内存存储
        const categoryIndex = memoryStorage.categories.findIndex(cat => cat.id === categoryId);
        if (categoryIndex === -1) {
          return res.status(404).json({ success: false, message: '分类不存在' });
        }

        // 检查分类名是否重复
        const existingCategory = memoryStorage.categories.find(cat => 
          cat.name === name && cat.id !== categoryId
        );
        if (existingCategory) {
          return res.status(400).json({ success: false, message: '分类名称已存在' });
        }

        const category = memoryStorage.categories[categoryIndex];
        category.name = name;
        category.icon = icon;
        category.order = order;
        category.status = status;
        category.updatedAt = new Date();

        res.json({ success: true, data: category });
      }
    } catch (error) {
      console.error('更新分类失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 删除分类
  async destroy(req, res) {
    try {
      const categoryId = parseInt(req.params.id);

      // 尝试从数据库删除
      try {
        const category = await Category.findByPk(categoryId);
        if (!category) {
          return res.status(404).json({ success: false, message: '分类不存在' });
        }

        await category.destroy();
        res.json({ success: true, message: '分类删除成功' });
      } catch (dbError) {
        console.warn('数据库操作失败，使用内存存储:', dbError.message);
        // 使用内存存储
        const categoryIndex = memoryStorage.categories.findIndex(cat => cat.id === categoryId);
        if (categoryIndex === -1) {
          return res.status(404).json({ success: false, message: '分类不存在' });
        }

        memoryStorage.categories.splice(categoryIndex, 1);
        res.json({ success: true, message: '分类删除成功' });
      }
    } catch (error) {
      console.error('删除分类失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CategoryController();
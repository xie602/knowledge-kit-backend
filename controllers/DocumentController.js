const Document = require('../models/Document');
const User = require('../models/User');
// 暂时不使用数据库,返回模拟数据
// const { Sequelize } = require('sequelize');

// 获取文档列表
exports.getDocuments = async (req, res) => {
  try {
    const { 
      grade, semester, subject, version, type,
      page = 1, limit = 10, sort = 'createdAt' 
    } = req.query;
    
    const query = { status: 'published' }; // 只返回已发布的文档
    
    // 添加多级分类筛选条件
    if (grade) query.grade = grade;
    if (semester) query.semester = semester;
    if (subject) query.subject = subject;
    if (version) query.version = version;
    if (type) query.type = type;
    
    const skip = (page - 1) * limit;
    
    // 根据排序参数构建排序对象
    const sortObj = {};
    sortObj[sort] = -1; // 降序排列
    
    const documents = await Document.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Document.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        documents,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取文档列表失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取文档详情
exports.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({ message: '文档不存在' });
    }
    
    // 增加浏览量
    document.views += 1;
    await document.save();
    
    res.json({
      success: true,
      document
    });
  } catch (error) {
    console.error('获取文档详情失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 搜索文档 - 返回模拟数据(暂不连接数据库)
exports.searchDocuments = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 20 } = req.query;

    if (!keyword) {
      return res.status(400).json({ message: '缺少搜索关键词' });
    }

    // 模拟搜索结果数据
    const mockDocuments = [
      {
        id: 1,
        title: `包含"${keyword}"的数学资料`,
        description: '这是一个关于数学的详细资料',
        category: '学习资料',
        grade: '三年级',
        subject: '数学',
        semester: '上学期',
        type: '知识点汇总',
        tags: '数学,三年级,知识点',
        downloadCount: 100,
        favoriteCount: 50,
        views: 200,
        coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=math%20study%20materials&image_size=square',
        fileUrl: 'https://example.com/file.pdf',
        fileSize: 1024000,
        fileType: 'pdf',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        title: `关于"${keyword}"的语文学习`,
        description: '语文阅读理解专项训练',
        category: '学习资料',
        grade: '四年级',
        subject: '语文',
        semester: '下学期',
        type: '专项练习',
        tags: '语文,四年级,阅读理解',
        downloadCount: 85,
        favoriteCount: 40,
        views: 150,
        coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20study&image_size=square',
        fileUrl: 'https://example.com/file2.pdf',
        fileSize: 2048000,
        fileType: 'pdf',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: {
        documents: mockDocuments,
        pagination: {
          total: mockDocuments.length,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(mockDocuments.length / limit)
        }
      }
    });
  } catch (error) {
    console.error('搜索文档失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 点赞文档
exports.likeDocument = async (req, res) => {
  try {
    const { id } = req.params;
    
    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({ message: '文档不存在' });
    }
    
    document.likes += 1;
    await document.save();
    
    res.json({
      success: true,
      message: '点赞成功',
      likes: document.likes
    });
  } catch (error) {
    console.error('点赞文档失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 创建文档
exports.createDocument = async (req, res) => {
  try {
    const {
      title, 
      content, 
      grade, 
      semester, 
      subject, 
      version, 
      type, 
      tags = [], 
      coverImage, 
      author, 
      download_url, 
      preview_images = []
    } = req.body;
    
    // 验证必需字段
    if (!title || !content || !grade || !subject || !type || !download_url) {
      return res.status(400).json({ 
        message: '标题、内容、年级、科目、资料类型和下载链接是必需的' 
      });
    }
    
    // 检查是否存在相同的下载链接
    const existingDoc = await Document.findOne({ download_url });
    if (existingDoc) {
      return res.status(400).json({ message: '该下载链接已存在' });
    }
    
    // 创建新文档
    const document = new Document({
      title,
      content,
      grade,
      semester,
      subject,
      version,
      type,
      tags,
      coverImage,
      author,
      download_url,
      preview_images
    });
    
    await document.save();
    
    res.json({
      success: true,
      message: '文档创建成功',
      document
    });
  } catch (error) {
    console.error('创建文档失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新文档
exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, 
      content, 
      grade, 
      semester, 
      subject, 
      version, 
      type, 
      tags, 
      coverImage, 
      author, 
      download_url, 
      preview_images, 
      status
    } = req.body;
    
    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({ message: '文档不存在' });
    }
    
    // 更新文档字段
    if (title) document.title = title;
    if (content) document.content = content;
    if (grade) document.grade = grade;
    if (semester) document.semester = semester;
    if (subject) document.subject = subject;
    if (version) document.version = version;
    if (type) document.type = type;
    if (tags !== undefined) document.tags = tags;
    if (coverImage !== undefined) document.coverImage = coverImage;
    if (author !== undefined) document.author = author;
    if (download_url !== undefined) document.download_url = download_url;
    if (preview_images !== undefined) document.preview_images = preview_images;
    if (status) document.status = status;
    
    await document.save();
    
    res.json({
      success: true,
      message: '文档更新成功',
      document
    });
  } catch (error) {
    console.error('更新文档失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 删除文档
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    
    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({ message: '文档不存在' });
    }
    
    await Document.deleteOne({ _id: id });
    
    res.json({
      success: true,
      message: '文档删除成功'
    });
  } catch (error) {
    console.error('删除文档失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 收藏/取消收藏文档
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.userId; // 从认证中间件获取用户ID
    const { id } = req.params;
    
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: '文档不存在' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 检查用户是否已收藏该文档
    const isFavorite = user.favoriteDocuments.some(favId => favId.equals(document._id));
    
    if (isFavorite) {
      // 取消收藏
      user.favoriteDocuments = user.favoriteDocuments.filter(favId => !favId.equals(document._id));
      document.收藏数 -= 1;
      await Promise.all([user.save(), document.save()]);
      
      res.json({
        success: true,
        message: '已取消收藏',
        isFavorite: false,
        收藏数: document.收藏数
      });
    } else {
      // 添加收藏
      user.favoriteDocuments.push(document._id);
      document.收藏数 += 1;
      await Promise.all([user.save(), document.save()]);
      
      res.json({
        success: true,
        message: '收藏成功',
        isFavorite: true,
        收藏数: document.收藏数
      });
    }
  } catch (error) {
    console.error('收藏文档失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};
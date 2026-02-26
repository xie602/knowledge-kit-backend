const express = require('express');
const router = express.Router();

// 搜索文档 - 模拟数据
router.get('/search/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // 模拟搜索结果
    const mockDocuments = [
      {
        id: 1,
        title: `${keyword} - 数学知识点汇总`,
        description: '小学数学知识点汇总',
        grade: '三年级',
        subject: '数学',
        type: '知识点汇总',
        downloadCount: 100,
        views: 200,
        coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=math&image_size=square'
      }
    ];

    res.json({
      success: true,
      data: {
        documents: mockDocuments,
        pagination: {
          total: 1,
          page: Number(page),
          limit: Number(limit),
          pages: 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取文档列表
router.get('/', async (req, res) => {
  res.json({
    success: true,
    data: {
      documents: [],
      pagination: { total: 0, page: 1, limit: 10, pages: 0 }
    }
  });
});

module.exports = router;

const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// 配置multer用于文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 根据文件类型选择存储目录
    const type = req.body.type || 'other';
    let uploadDir = 'uploads/';
    
    switch(type) {
      case 'image':
        uploadDir += 'images/';
        break;
      case 'document':
        uploadDir += 'documents/';
        break;
      default:
        uploadDir += 'other/';
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // 根据文件类型过滤
  const type = req.body.type || 'image';
  
  if (type === 'image') {
    // 图片类型
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只能上传图片文件'), false);
    }
  } else if (type === 'document') {
    // 文档类型
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('只能上传PDF或Word文档'), false);
    }
  } else {
    // 其他类型
    cb(null, true);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制5MB
  }
});

// 上传文件
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: '未选择文件'
    });
  }

  // 返回文件信息
  res.json({
    success: true,
    message: '文件上传成功',
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

// 错误处理
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '文件大小超出限制'
      });
    }
  }
  
  res.status(400).json({
    success: false,
    message: err.message || '文件上传失败'
  });
});

module.exports = router;
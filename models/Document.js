const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.STRING(100)
  },
  tags: {
    type: DataTypes.STRING(255)
  },
  coverImage: {
    type: DataTypes.STRING(512)
  },
  fileUrl: {
    type: DataTypes.STRING(512),
    allowNull: false
  },
  fileSize: {
    type: DataTypes.INTEGER
  },
  fileType: {
    type: DataTypes.STRING(50)
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  favoriteCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'documents',
  timestamps: true
});

module.exports = Document;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  openid: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false
  },
  nickname: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  avatarUrl: {
    type: DataTypes.STRING(512)
  },
  isPermanent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  cardId: {
    type: DataTypes.INTEGER
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'banned'),
    defaultValue: 'active'
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  lastLoginAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'users',
  timestamps: true,
  updatedAt: 'updatedAt'
});

module.exports = User;

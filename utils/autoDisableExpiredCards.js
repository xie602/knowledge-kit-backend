// 导入内存存储
const memoryStorage = require('./memoryStorage');

/**
 * 自动禁用过期卡密的函数
 * 该函数会定期运行，禁用所有过期的未使用卡密
 * 同时更新使用过期卡密的用户状态
 */
async function autoDisableExpiredCards() {
  try {
    console.log('开始执行自动禁用过期卡密任务...');
    
    // 检查是否使用内存存储
    if (!process.env.MONGODB_URI) {
      console.log('使用内存存储模式，执行内存中的卡密过期检查...');
      
      // 1. 禁用过期的未使用卡密
      const expiredUnusedCards = memoryStorage.cards.filter(card => 
        card.status === 'unused' && card.expireDate && new Date(card.expireDate) < new Date()
      );
      
      if (expiredUnusedCards.length > 0) {
        console.log(`找到 ${expiredUnusedCards.length} 个过期未使用卡密，准备禁用...`);
        
        for (const card of expiredUnusedCards) {
          card.status = 'disabled';
          console.log(`已禁用过期未使用卡密: ${card.cardNumber}`);
        }
      }
      
      // 2. 查找使用了过期卡密的用户并更新状态
      const expiredUsedCards = memoryStorage.cards.filter(card => 
        card.status === 'used' && card.expireDate && new Date(card.expireDate) < new Date()
      );
      
      if (expiredUsedCards.length > 0) {
        console.log(`找到 ${expiredUsedCards.length} 个过期已使用卡密，准备更新用户状态...`);
        
        for (const card of expiredUsedCards) {
          if (card.userId) {
            const user = memoryStorage.users.find(u => u._id === card.userId);
            if (user && user.isPermanent) {
              // 更新用户状态为普通用户
              user.isPermanent = false;
              user.expireDate = new Date();
              console.log(`已更新过期卡密用户状态: ${user.nickname || user._id}`);
            }
          }
        }
      }
      
      // 3. 查找过期的用户并更新状态
      const expiredUsers = memoryStorage.users.filter(user => 
        !user.isPermanent && user.expireDate && new Date(user.expireDate) < new Date()
      );
      
      if (expiredUsers.length > 0) {
        console.log(`找到 ${expiredUsers.length} 个过期用户，准备更新状态...`);
        
        for (const user of expiredUsers) {
          // 确保用户状态正确
          user.expireDate = new Date();
          console.log(`已更新过期用户状态: ${user.nickname || user._id}`);
        }
      }
    } else {
      // 使用MongoDB模式
      const Card = require('../models/Card');
      const User = require('../models/User');
      
      // 1. 禁用过期的未使用卡密
      const expiredUnusedCards = await Card.find({
        status: 'unused',
        expireDate: { $lt: new Date() }
      });
      
      if (expiredUnusedCards.length > 0) {
        console.log(`找到 ${expiredUnusedCards.length} 个过期未使用卡密，准备禁用...`);
        
        for (const card of expiredUnusedCards) {
          card.status = 'disabled';
          await card.save();
          console.log(`已禁用过期未使用卡密: ${card.cardNumber}`);
        }
      }
      
      // 2. 查找使用了过期卡密的用户并更新状态
      const expiredUsedCards = await Card.find({
        status: 'used',
        expireDate: { $lt: new Date() }
      });
      
      if (expiredUsedCards.length > 0) {
        console.log(`找到 ${expiredUsedCards.length} 个过期已使用卡密，准备更新用户状态...`);
        
        for (const card of expiredUsedCards) {
          if (card.userId) {
            const user = await User.findById(card.userId);
            if (user && user.isPermanent === false) {
              // 更新用户状态为普通用户，清除过期时间
              user.expireDate = new Date();
              await user.save();
              console.log(`已更新过期卡密用户状态: ${user.nickname || user._id}`);
            }
          }
        }
      }
      
      // 3. 查找过期的用户并更新状态
      const expiredUsers = await User.find({
        isPermanent: false,
        expireDate: { $lt: new Date() }
      });
      
      if (expiredUsers.length > 0) {
        console.log(`找到 ${expiredUsers.length} 个过期用户，准备更新状态...`);
        
        for (const user of expiredUsers) {
          // 确保用户状态正确
          user.expireDate = new Date();
          await user.save();
          console.log(`已更新过期用户状态: ${user.nickname || user._id}`);
        }
      }
    }
    
    console.log('自动禁用过期卡密任务执行完成');
  } catch (error) {
    console.error('自动禁用过期卡密失败:', error);
  }
}

/**
 * 启动自动禁用过期卡密的定时任务
 * 每小时运行一次
 */
function startAutoDisableTask() {
  // 立即执行一次
  autoDisableExpiredCards();
  
  // 设置定时任务，每小时执行一次
  setInterval(autoDisableExpiredCards, 60 * 60 * 1000);
  console.log('自动禁用过期卡密定时任务已启动，每小时执行一次');
}

module.exports = {
  autoDisableExpiredCards,
  startAutoDisableTask
};
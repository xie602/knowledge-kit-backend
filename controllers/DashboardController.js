const User = require('../models/User');
const Document = require('../models/Document');
const Category = require('../models/Category');
const Ad = require('../models/Ad');

class DashboardController {
  // 获取仪表盘统计数据
  async getStats(req, res) {
    try {
      // 时间范围参数
      const { range = 'day' } = req.query;
      
      // 计算时间范围
      const now = new Date();
      let startDate = new Date(now);
      
      switch(range) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        default: // day
          startDate.setDate(now.getDate());
          break;
      }

      // 获取统计数据
      const [
        totalUsers,
        totalMaterials,
        todayVisitors,
        weekVisitors,
        monthVisitors,
        totalDownloads,
        userGrowth,
        downloadRankings,
        adStats,
        categoryDistribution,
        newUserRetention
      ] = await Promise.all([
        // 总用户数
        User.countDocuments(),
        
        // 总资料数
        Document.countDocuments(),
        
        // 今日访问量 (使用最新7天数据作为示例)
        this.getVisitorsCount(new Date(now.getFullYear(), now.getMonth(), now.getDate())),
        
        // 本周访问量
        this.getVisitorsCount(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)),
        
        // 本月访问量
        this.getVisitorsCount(new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())),
        
        // 总下载量 (假设文档模型中有下载计数)
        this.getTotalDownloads(),
        
        // 用户增长趋势 (最近7天)
        this.getUserGrowthData(),
        
        // 下载排行
        this.getDownloadRankings(),
        
        // 广告统计
        this.getAdStats(),
        
        // 资料分类分布
        this.getCategoryDistribution(),
        
        // 用户留存率
        this.getUserRetention()
      ]);

      res.json({
        success: true,
        data: {
          totalUsers,
          totalMaterials,
          todayVisitors,
          weekVisitors,
          monthVisitors,
          totalDownloads,
          trendData: userGrowth,
          downloadRankings,
          adStats,
          categoryDistribution,
          userRetention: newUserRetention,
          systemHealth: {
            uptime: '99.9%',
            apiResponseTime: 120, // ms
            serverLoad: 0.65
          }
        }
      });
    } catch (error) {
      console.error('获取仪表盘统计数据失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 获取访问量数据
  async getVisitorsCount(startDate) {
    // 这里可以根据实际业务逻辑计算访问量
    // 暂时返回模拟数据
    return Math.floor(Math.random() * 100) + 50;
  }

  // 获取总下载量
  async getTotalDownloads() {
    // 这里可以根据实际业务逻辑计算总下载量
    // 暂时返回模拟数据
    return Math.floor(Math.random() * 10000) + 5000;
  }

  // 获取用户增长数据
  async getUserGrowthData() {
    const dates = [];
    const now = new Date();
    
    // 生成最近7天的数据
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      
      dates.push({
        date: date.toISOString().split('T')[0],
        users: Math.floor(Math.random() * 20),
        materials: Math.floor(Math.random() * 10),
        downloads: Math.floor(Math.random() * 50)
      });
    }
    
    return dates;
  }

  // 获取下载排行
  async getDownloadRankings() {
    // 模拟下载排行数据
    return [
      { title: '三年级数学期末试卷', downloads: 125 },
      { title: '五年级语文单元测试', downloads: 98 },
      { title: '高一物理知识点汇总', downloads: 87 },
      { title: '小学英语同步练习', downloads: 76 },
      { title: '中考化学模拟试题', downloads: 64 }
    ];
  }

  // 获取广告统计数据
  async getAdStats() {
    // 模拟广告统计
    return {
      totalExposures: Math.floor(Math.random() * 10000) + 5000,
      totalClicks: Math.floor(Math.random() * 500) + 200,
      ctr: ((Math.random() * 5) + 1).toFixed(2), // 点击率
      estimatedRevenue: (Math.random() * 1000).toFixed(2) // 预估收益
    };
  }

  // 获取资料分类分布
  async getCategoryDistribution() {
    // 模拟分类分布数据
    return [
      { name: '一年级', count: 25 },
      { name: '二年级', count: 30 },
      { name: '三年级', count: 28 },
      { name: '四年级', count: 22 },
      { name: '五年级', count: 35 },
      { name: '六年级', count: 20 }
    ];
  }

  // 获取用户留存率
  async getUserRetention() {
    // 模拟用户留存率数据
    return {
      day1: 65,  // 次日留存率
      day7: 35,  // 7日留存率
      day30: 15  // 30日留存率
    };
  }
}

module.exports = new DashboardController();
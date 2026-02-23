<template>
  <div class="dashboard-container">
    <h2>系统概览</h2>
    
    <!-- 快捷操作 -->
    <div class="quick-actions">
      <el-button type="primary" @click="handleQuickUpload">
        <el-icon><Upload /></el-icon>
        快速上传资料
      </el-button>
      <el-button type="success" @click="handleQuickSync">
        <el-icon><Refresh /></el-icon>
        同步GitHub仓库
      </el-button>
      <el-button type="warning" @click="handleQuickCard">
        <el-icon><Tickets /></el-icon>
        生成卡密
      </el-button>
      <el-button type="info" @click="handleQuickNotice">
        <el-icon><Bell /></el-icon>
        发布公告
      </el-button>
    </div>
    
    <!-- 实时数据 -->
    <div class="realtime-stats">
      <el-card class="realtime-card">
        <div class="stat-content">
          <div class="stat-number">{{ realtimeStats.onlineUsers }}</div>
          <div class="stat-label">当前在线用户</div>
        </div>
      </el-card>
      <el-card class="realtime-card">
        <div class="stat-content">
          <div class="stat-number">{{ realtimeStats.activeSessions }}</div>
          <div class="stat-label">当前活跃会话</div>
        </div>
      </el-card>
      <el-card class="realtime-card">
        <div class="stat-content">
          <div class="stat-number">{{ realtimeStats.todayVisits }}</div>
          <div class="stat-label">今日访问量</div>
        </div>
      </el-card>
      <el-card class="realtime-card">
        <div class="stat-content">
          <div class="stat-number">{{ realtimeStats.todayDownloads }}</div>
          <div class="stat-label">今日下载量</div>
        </div>
      </el-card>
    </div>
    
    <!-- 核心指标 -->
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalUsers }}</div>
          <div class="stat-label">总用户数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalDocuments }}</div>
          <div class="stat-label">总文档数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalDownloads }}</div>
          <div class="stat-label">总下载量</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalFavorites }}</div>
          <div class="stat-label">总收藏数</div>
        </div>
      </el-card>
    </div>
    
    <!-- 数据概览 -->
    <div class="overview-section">
      <!-- 最新动态 -->
      <el-card class="latest-news-card">
        <template #header>
          <div class="chart-header">
            <span>最新动态</span>
          </div>
        </template>
        <div class="scrollable-content">
          <el-table :data="latestNews" style="width: 100%">
            <el-table-column prop="type" label="类型" width="100"></el-table-column>
            <el-table-column prop="content" label="内容" min-width="400"></el-table-column>
            <el-table-column prop="time" label="时间" width="180"></el-table-column>
          </el-table>
        </div>
      </el-card>
      
      <!-- 热门搜索词 -->
      <el-card class="hot-search-card">
        <template #header>
          <div class="chart-header">
            <span>热门搜索词</span>
          </div>
        </template>
        <div class="scrollable-content">
          <div class="hot-search-list">
            <div 
              v-for="(item, index) in hotSearchKeywords" 
              :key="index" 
              class="hot-search-item"
            >
              <div class="rank">{{ index + 1 }}</div>
              <div class="keyword">{{ item.keyword }}</div>
              <div class="count">{{ item.count }}次</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 图表控制 -->
    <div class="chart-controls">
      <el-button-group>
        <el-button :type="timeRange === '1d' ? 'primary' : 'default'" @click="setTimeRange('1d')">日</el-button>
        <el-button :type="timeRange === '7d' ? 'primary' : 'default'" @click="setTimeRange('7d')">周</el-button>
        <el-button :type="timeRange === '30d' ? 'primary' : 'default'" @click="setTimeRange('30d')">月</el-button>
      </el-button-group>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-container">
      <!-- 用户增长趋势 -->
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>用户增长趋势</span>
          </div>
        </template>
        <div ref="userGrowthChart" class="chart"></div>
      </el-card>
      
      <!-- 下载趋势分析 -->
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>下载趋势分析</span>
          </div>
        </template>
        <div ref="downloadTrendChart" class="chart"></div>
      </el-card>
      
      <!-- 用户活跃度数据 -->
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>用户活跃度数据</span>
          </div>
        </template>
        <div ref="userActivityChart" class="chart"></div>
      </el-card>
      
      <!-- 广告收益数据 -->
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>广告收益数据</span>
          </div>
        </template>
        <div ref="adRevenueChart" class="chart"></div>
      </el-card>
      
      <!-- 资料分类分布 -->
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>资料分类分布</span>
          </div>
        </template>
        <div ref="categoryDistributionChart" class="chart"></div>
      </el-card>
      
      <!-- 用户地域分布 -->
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>用户地域分布</span>
          </div>
        </template>
        <div ref="userRegionChart" class="chart"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { Upload, Refresh, Tickets, Bell } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 时间范围选择
const timeRange = ref('30d')
const categoryType = ref('grade')

// 设置时间范围
const setTimeRange = (range) => {
  timeRange.value = range
  updateCharts()
}

// 实时数据
const realtimeStats = reactive({
  onlineUsers: 128,
  activeSessions: 256,
  todayVisits: 1234,
  todayDownloads: 567
})

// 核心指标
const stats = reactive({
  totalUsers: 12345,
  totalDocuments: 5678,
  totalDownloads: 89012,
  totalFavorites: 23456
})

// 图表引用
const userGrowthChart = ref(null)
const downloadTrendChart = ref(null)
const userActivityChart = ref(null)
const adRevenueChart = ref(null)
const categoryDistributionChart = ref(null)
const userRegionChart = ref(null)

// 图表实例
const chartInstances = {
  userGrowth: null,
  downloadTrend: null,
  userActivity: null,
  adRevenue: null,
  categoryDistribution: null,
  userRegion: null
}

// 模拟数据
const userGrowthData = [
  { date: '01-01', users: 120 },
  { date: '01-02', users: 190 },
  { date: '01-03', users: 300 },
  { date: '01-04', users: 450 },
  { date: '01-05', users: 600 },
  { date: '01-06', users: 800 },
  { date: '01-07', users: 1000 },
  { date: '01-08', users: 1200 },
  { date: '01-09', users: 1500 },
  { date: '01-10', users: 1800 }
]

const downloadTrendData = [
  { date: '01-01', downloads: 500 },
  { date: '01-02', downloads: 800 },
  { date: '01-03', downloads: 1200 },
  { date: '01-04', downloads: 1500 },
  { date: '01-05', downloads: 1800 },
  { date: '01-06', downloads: 2200 },
  { date: '01-07', downloads: 2500 },
  { date: '01-08', downloads: 2800 },
  { date: '01-09', downloads: 3200 },
  { date: '01-10', downloads: 3500 }
]

const userActivityData = [
  { name: '日活(DAU)', value: 3500 },
  { name: '月活(MAU)', value: 12000 },
  { name: '次日留存', value: 45 },
  { name: '7日留存', value: 30 },
  { name: '30日留存', value: 15 }
]

const adRevenueData = [
  { date: '01-01', revenue: 120 },
  { date: '01-02', revenue: 190 },
  { date: '01-03', revenue: 250 },
  { date: '01-04', revenue: 320 },
  { date: '01-05', revenue: 400 },
  { date: '01-06', revenue: 450 },
  { date: '01-07', revenue: 520 },
  { date: '01-08', revenue: 580 },
  { date: '01-09', revenue: 650 },
  { date: '01-10', revenue: 720 }
]

const categoryDistributionData = {
  grade: [
    { name: '小学', value: 2000 },
    { name: '初中', value: 1800 },
    { name: '高中', value: 1500 },
    { name: '幼小衔接', value: 378 }
  ],
  subject: [
    { name: '数学', value: 1500 },
    { name: '语文', value: 1300 },
    { name: '英语', value: 1200 },
    { name: '物理', value: 400 },
    { name: '化学', value: 350 },
    { name: '其他', value: 928 }
  ],
  type: [
    { name: '试卷', value: 1800 },
    { name: '练习', value: 1500 },
    { name: '知识点总结', value: 1200 },
    { name: '寒假', value: 600 },
    { name: '暑假', value: 578 }
  ]
}

const userRegionData = [
  { name: '北京', value: 1500 },
  { name: '上海', value: 1200 },
  { name: '广州', value: 1000 },
  { name: '深圳', value: 900 },
  { name: '杭州', value: 800 },
  { name: '成都', value: 700 },
  { name: '武汉', value: 600 },
  { name: '其他', value: 5045 }
]

const hotSearchKeywords = [
  { keyword: '中考数学', count: 1234 },
  { keyword: '高考复习资料', count: 987 },
  { keyword: '小学英语', count: 876 },
  { keyword: '初中物理', count: 765 },
  { keyword: '高中化学', count: 654 },
  { keyword: '寒假作业', count: 543 },
  { keyword: '暑假预习', count: 432 },
  { keyword: '知识点总结', count: 321 },
  { keyword: '单元测试卷', count: 210 },
  { keyword: '期末复习', count: 109 }
]

const latestNews = [
  { type: '用户', content: '新用户张三注册成功', time: '2026-02-21 15:30' },
  { type: '用户', content: '用户李四收藏了初中物理知识点总结', time: '2026-02-21 15:25' },
  { type: '用户', content: '用户王五下载了高考数学模拟试卷', time: '2026-02-21 15:20' },
  { type: '用户', content: '新用户赵六注册成功', time: '2026-02-21 15:15' },
  { type: '用户', content: '用户钱七收藏了高中英语词汇手册', time: '2026-02-21 15:10' },
  { type: '用户', content: '用户孙八下载了初中化学实验指导', time: '2026-02-21 15:05' },
  { type: '用户', content: '新用户周九注册成功', time: '2026-02-21 15:00' },
  { type: '用户', content: '用户吴十收藏了小学数学应用题集', time: '2026-02-21 14:55' }
]

// 初始化图表
onMounted(() => {
  initUserGrowthChart()
  initDownloadTrendChart()
  initUserActivityChart()
  initAdRevenueChart()
  initCategoryDistributionChart()
  initUserRegionChart()
})

// 用户增长趋势图表
const initUserGrowthChart = () => {
  if (!chartInstances.userGrowth && userGrowthChart.value) {
    chartInstances.userGrowth = echarts.init(userGrowthChart.value)
    window.addEventListener('resize', () => chartInstances.userGrowth.resize())
  }
  
  if (chartInstances.userGrowth) {
    // 根据时间范围生成数据
    let data = []
    let dates = []
    
    if (timeRange.value === '1d') {
      // 日数据 - 24小时
      for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0')
        dates.push(`${hour}:00`)
        data.push(Math.floor(Math.random() * 50) + 10)
      }
    } else if (timeRange.value === '7d') {
      // 周数据 - 7天
      const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      for (let i = 0; i < 7; i++) {
        dates.push(weekDays[i])
        data.push(Math.floor(Math.random() * 300) + 100)
      }
    } else {
      // 月数据 - 30天
      for (let i = 1; i <= 30; i++) {
        dates.push(`${i}日`)
        data.push(Math.floor(Math.random() * 500) + 200)
      }
    }
    
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: dates
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: data,
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#409EFF'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(64, 158, 255, 0.5)'
            },
            {
              offset: 1,
              color: 'rgba(64, 158, 255, 0.1)'
            }
          ])
        }
      }]
    }
    chartInstances.userGrowth.setOption(option)
  }
}

// 下载趋势分析图表
const initDownloadTrendChart = () => {
  if (!chartInstances.downloadTrend && downloadTrendChart.value) {
    chartInstances.downloadTrend = echarts.init(downloadTrendChart.value)
    window.addEventListener('resize', () => chartInstances.downloadTrend.resize())
  }
  
  if (chartInstances.downloadTrend) {
    // 根据时间范围生成数据
    let data = []
    let dates = []
    
    if (timeRange.value === '1d') {
      // 日数据 - 24小时
      for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0')
        dates.push(`${hour}:00`)
        data.push(Math.floor(Math.random() * 100) + 20)
      }
    } else if (timeRange.value === '7d') {
      // 周数据 - 7天
      const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      for (let i = 0; i < 7; i++) {
        dates.push(weekDays[i])
        data.push(Math.floor(Math.random() * 500) + 200)
      }
    } else {
      // 月数据 - 30天
      for (let i = 1; i <= 30; i++) {
        dates.push(`${i}日`)
        data.push(Math.floor(Math.random() * 1000) + 500)
      }
    }
    
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: dates
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: data,
        type: 'bar',
        itemStyle: {
          color: '#67C23A'
        }
      }]
    }
    chartInstances.downloadTrend.setOption(option)
  }
}

// 用户活跃度数据图表
const initUserActivityChart = () => {
  if (!chartInstances.userActivity && userActivityChart.value) {
    chartInstances.userActivity = echarts.init(userActivityChart.value)
    window.addEventListener('resize', () => chartInstances.userActivity.resize())
  }
  
  if (chartInstances.userActivity) {
    // 根据时间范围生成数据
    let dau, mau, day2Retain, day7Retain, day30Retain
    
    if (timeRange.value === '1d') {
      // 日数据
      dau = Math.floor(Math.random() * 500) + 300
      mau = Math.floor(Math.random() * 3000) + 8000
      day2Retain = Math.floor(Math.random() * 30) + 30
      day7Retain = Math.floor(Math.random() * 15) + 15
      day30Retain = Math.floor(Math.random() * 5) + 5
    } else if (timeRange.value === '7d') {
      // 周数据
      dau = Math.floor(Math.random() * 800) + 500
      mau = Math.floor(Math.random() * 4000) + 10000
      day2Retain = Math.floor(Math.random() * 25) + 35
      day7Retain = Math.floor(Math.random() * 15) + 20
      day30Retain = Math.floor(Math.random() * 5) + 8
    } else {
      // 月数据
      dau = Math.floor(Math.random() * 1000) + 800
      mau = Math.floor(Math.random() * 5000) + 12000
      day2Retain = Math.floor(Math.random() * 20) + 40
      day7Retain = Math.floor(Math.random() * 15) + 25
      day30Retain = Math.floor(Math.random() * 5) + 10
    }
    
    const option = {
      tooltip: {
        trigger: 'item'
      },
      radar: {
        indicator: [
          { name: '日活(DAU)', max: 5000 },
          { name: '月活(MAU)', max: 15000 },
          { name: '次日留存', max: 100 },
          { name: '7日留存', max: 100 },
          { name: '30日留存', max: 100 }
        ]
      },
      series: [{
        type: 'radar',
        data: [{
          value: [dau, mau, day2Retain, day7Retain, day30Retain],
          name: '用户活跃度',
          areaStyle: {
            color: 'rgba(64, 158, 255, 0.2)'
          },
          lineStyle: {
            color: '#409EFF'
          },
          itemStyle: {
            color: '#409EFF'
          }
        }]
      }]
    }
    chartInstances.userActivity.setOption(option)
  }
}

// 广告收益数据图表
const initAdRevenueChart = () => {
  if (!chartInstances.adRevenue && adRevenueChart.value) {
    chartInstances.adRevenue = echarts.init(adRevenueChart.value)
    window.addEventListener('resize', () => chartInstances.adRevenue.resize())
  }
  
  if (chartInstances.adRevenue) {
    // 根据时间范围生成数据
    let data = []
    let dates = []
    
    if (timeRange.value === '1d') {
      // 日数据 - 24小时
      for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0')
        dates.push(`${hour}:00`)
        data.push(Math.floor(Math.random() * 20) + 5)
      }
    } else if (timeRange.value === '7d') {
      // 周数据 - 7天
      const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      for (let i = 0; i < 7; i++) {
        dates.push(weekDays[i])
        data.push(Math.floor(Math.random() * 100) + 50)
      }
    } else {
      // 月数据 - 30天
      for (let i = 1; i <= 30; i++) {
        dates.push(`${i}日`)
        data.push(Math.floor(Math.random() * 200) + 100)
      }
    }
    
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}<br/>收益: ¥{c}'
      },
      xAxis: {
        type: 'category',
        data: dates
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '¥{value}'
        }
      },
      series: [{
        data: data,
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#E6A23C'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(230, 162, 60, 0.5)'
            },
            {
              offset: 1,
              color: 'rgba(230, 162, 60, 0.1)'
            }
          ])
        }
      }]
    }
    chartInstances.adRevenue.setOption(option)
  }
}

// 资料分类分布图表
const initCategoryDistributionChart = () => {
  if (!chartInstances.categoryDistribution && categoryDistributionChart.value) {
    chartInstances.categoryDistribution = echarts.init(categoryDistributionChart.value)
    window.addEventListener('resize', () => chartInstances.categoryDistribution.resize())
  }
  
  if (chartInstances.categoryDistribution) {
    // 根据时间范围和分类类型生成数据
    let data = []
    const baseData = categoryDistributionData[categoryType.value]
    
    // 根据时间范围调整数据
    if (timeRange.value === '1d') {
      // 日数据 - 缩小数值
      data = baseData.map(item => ({
        name: item.name,
        value: Math.floor(Math.random() * 100) + 10
      }))
    } else if (timeRange.value === '7d') {
      // 周数据 - 中等数值
      data = baseData.map(item => ({
        name: item.name,
        value: Math.floor(Math.random() * 500) + 100
      }))
    } else {
      // 月数据 - 原始数值
      data = baseData.map(item => ({
        name: item.name,
        value: Math.floor(Math.random() * 1000) + 200
      }))
    }
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      series: [{
        type: 'pie',
        radius: '60%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    }
    chartInstances.categoryDistribution.setOption(option)
  }
}

// 用户地域分布图表
const initUserRegionChart = () => {
  if (!chartInstances.userRegion && userRegionChart.value) {
    chartInstances.userRegion = echarts.init(userRegionChart.value)
    window.addEventListener('resize', () => chartInstances.userRegion.resize())
  }
  
  if (chartInstances.userRegion) {
    // 根据时间范围生成数据
    let data = []
    
    if (timeRange.value === '1d') {
      // 日数据 - 缩小数值
      data = userRegionData.map(item => ({
        name: item.name,
        value: Math.floor(Math.random() * 50) + 5
      }))
    } else if (timeRange.value === '7d') {
      // 周数据 - 中等数值
      data = userRegionData.map(item => ({
        name: item.name,
        value: Math.floor(Math.random() * 300) + 50
      }))
    } else {
      // 月数据 - 原始数值
      data = userRegionData.map(item => ({
        name: item.name,
        value: Math.floor(Math.random() * 800) + 100
      }))
    }
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data
      }]
    }
    chartInstances.userRegion.setOption(option)
  }
}

// 更新图表
const updateCharts = () => {
  // 根据时间范围重新生成数据并更新图表
  console.log('Time range changed:', timeRange.value)
  
  // 重新初始化所有图表
  initUserGrowthChart()
  initDownloadTrendChart()
  initAdRevenueChart()
  initUserActivityChart()
  initCategoryDistributionChart()
  initUserRegionChart()
}

// 更新分类图表
const updateCategoryChart = () => {
  initCategoryDistributionChart()
}

// 路由
const router = useRouter()

// 快捷操作
const handleQuickUpload = () => {
  // 跳转到资料上传页面
  router.push('/materials')
}

const handleQuickSync = () => {
  // 触发GitHub同步
  ElMessage.info('正在同步GitHub仓库...')
  setTimeout(() => {
    ElMessage.success('GitHub仓库同步成功')
  }, 1500)
}

const handleQuickCard = () => {
  // 跳转到卡密生成页面
  router.push('/cards')
}

const handleQuickNotice = () => {
  // 跳转到公告发布页面
  router.push('/notices')
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

/* 实时数据 */
.realtime-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.realtime-card {
  height: 110px;
  background-color: #f0f9eb;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
}

/* 核心指标 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  height: 130px;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
}

.stat-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

/* 图表容器 */
.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.chart-card {
  height: 320px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
}

.chart {
  width: 100%;
  height: calc(100% - 48px);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 热门搜索词 */
.hot-search-card {
  margin-bottom: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
}

.hot-search-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  padding: 16px;
}

.hot-search-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.hot-search-item:hover {
  background-color: #ecf5ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
}

.rank {
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background-color: #409EFF;
  color: #fff;
  border-radius: 6px;
  margin-right: 12px;
  font-size: 14px;
  font-weight: bold;
}

.keyword {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.count {
  font-size: 13px;
  color: #909399;
  font-weight: 400;
}

/* 快捷操作 */
.quick-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

/* 数据概览区域 */
.overview-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 32px;
}

/* 最新动态 */
.latest-news-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
}

/* 热门搜索词 */
.hot-search-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
}

/* 滚动内容区域 */
.scrollable-content {
  max-height: 300px;
  overflow-y: auto;
  padding: 0 8px;
}

/* 滚动条样式 */
.scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* 图表控制 */
.chart-controls {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .charts-container {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
  
  .overview-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .realtime-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    height: 300px;
  }
  
  .overview-section {
    grid-template-columns: 1fr;
  }
  
  .hot-search-list {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .quick-actions button {
    width: 100%;
  }
}
</style>
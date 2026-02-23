<template>
  <div class="users-container">
    <h2>用户管理</h2>
    
    <!-- 标签页 -->
    <el-tabs v-model="activeTab" class="users-tabs">
      <!-- 用户列表 -->
      <el-tab-pane label="用户列表" name="userList">
        <el-card class="users-card">
          <template #header>
            <div class="card-header">
              <span>用户管理</span>
              <div class="header-actions">
                <el-button type="primary" @click="handleSetPermanentUser">
                  <el-icon><Key /></el-icon>
                  设置永久用户
                </el-button>
                <el-button @click="handleExportUsers">
                  <el-icon><Download /></el-icon>
                  导出用户数据
                </el-button>
              </div>
            </div>
          </template>
          <div class="search-bar">
            <el-input v-model="userSearchKeyword" placeholder="请输入用户昵称或OpenID" class="search-input"></el-input>
            <el-select v-model="userStatusFilter" placeholder="用户状态" class="status-filter">
              <el-option label="全部" value=""></el-option>
              <el-option label="活跃" value="active"></el-option>
              <el-option label="禁用" value="disabled"></el-option>
            </el-select>
            <el-select v-model="userTypeFilter" placeholder="用户类型" class="type-filter">
              <el-option label="全部" value=""></el-option>
              <el-option label="永久用户" value="permanent"></el-option>
              <el-option label="普通用户" value="normal"></el-option>
            </el-select>
            <el-button type="primary" @click="handleSearchUsers">搜索</el-button>
          </div>
          <el-table :data="users" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="nickname" label="用户昵称" min-width="150">
              <template #default="scope">
                <div class="user-info">
                  <el-avatar :size="32" :src="scope.row.avatarUrl"></el-avatar>
                  <span class="nickname">{{ scope.row.nickname }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="openid" label="OpenID" min-width="200"></el-table-column>
            <el-table-column prop="registerDate" label="注册时间" width="180"></el-table-column>
            <el-table-column prop="lastLogin" label="最后登录" width="180"></el-table-column>
            <el-table-column prop="userType" label="用户类型" width="120">
              <template #default="scope">
                <el-tag :type="scope.row.userType === 'permanent' ? 'warning' : 'info'">
                  {{ scope.row.userType === 'permanent' ? '永久用户' : '普通用户' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
                  {{ scope.row.status === 'active' ? '活跃' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="scope">
                <el-button size="small" type="primary" @click="handleViewUser(scope.row)">
                  <el-icon><View /></el-icon>
                  查看
                </el-button>
                <el-button 
                  size="small" 
                  :type="scope.row.userType === 'permanent' ? 'info' : 'warning'"
                  @click="handleToggleUserType(scope.row)"
                >
                  <el-icon><Key /></el-icon>
                  {{ scope.row.userType === 'permanent' ? '取消永久' : '设为永久' }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              layout="prev, pager, next"
              :total="usersTotal"
              :page-size="pageSize"
              :current-page="currentPage"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </el-card>
      </el-tab-pane>
      
      <!-- 卡密管理 -->
      <el-tab-pane label="卡密管理" name="cardManagement">
        <el-card class="cards-card">
          <template #header>
            <div class="card-header">
              <span>卡密管理</span>
              <div class="header-actions">
                <el-button type="primary" @click="handleGenerateCards">
                  <el-icon><Tickets /></el-icon>
                  批量生成卡密
                </el-button>
                <el-button type="danger" @click="handleDisableExpiredCards">
                  <el-icon><Delete /></el-icon>
                  禁用过期卡密
                </el-button>
                <el-button @click="handleExportCards">
                  <el-icon><Download /></el-icon>
                  导出卡密数据
                </el-button>
              </div>
            </div>
          </template>
          <div class="search-bar">
            <el-input v-model="cardSearchKeyword" placeholder="请输入卡密编号" class="search-input"></el-input>
            <el-select v-model="cardStatusFilter" placeholder="卡密状态" class="status-filter">
              <el-option label="全部" value=""></el-option>
              <el-option label="未使用" value="unused"></el-option>
              <el-option label="已使用" value="used"></el-option>
              <el-option label="已禁用" value="disabled"></el-option>
            </el-select>
            <el-select v-model="cardTypeFilter" placeholder="卡密类型" class="type-filter">
              <el-option label="全部" value=""></el-option>
              <el-option label="永久" value="permanent"></el-option>
              <el-option label="7天" value="7days"></el-option>
            </el-select>
            <el-button type="primary" @click="handleSearchCards">搜索</el-button>
          </div>
          <el-table :data="cards" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="cardNumber" label="卡密编号" min-width="200"></el-table-column>
            <el-table-column prop="type" label="卡密类型" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.type === 'permanent' ? 'warning' : 'info'">
                  {{ scope.row.type === 'permanent' ? '永久' : '7天' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag 
                  :type="scope.row.status === 'unused' ? 'info' : (scope.row.status === 'used' ? 'success' : 'danger')"
                >
                  {{ scope.row.status === 'unused' ? '未使用' : (scope.row.status === 'used' ? '已使用' : '已禁用') }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="expireDate" label="过期时间" width="180"></el-table-column>
            <el-table-column prop="usedAt" label="使用时间" width="180"></el-table-column>
            <el-table-column prop="userId" label="使用用户" width="120">
              <template #default="scope">
                <span v-if="scope.row.userId">
                  <el-button type="text" @click="handleViewUserById(scope.row.userId)">
                    查看用户
                  </el-button>
                </span>
                <span v-else>未使用</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="scope">
                <el-button 
                  size="small" 
                  type="danger" 
                  @click="handleDisableCard(scope.row)"
                  v-if="scope.row.status === 'unused'"
                >
                  <el-icon><Delete /></el-icon>
                  禁用
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              layout="prev, pager, next"
              :total="cardsTotal"
              :page-size="pageSize"
              :current-page="currentPage"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </el-card>
      </el-tab-pane>
      
      <!-- 用户分析 -->
      <el-tab-pane label="用户分析" name="userAnalysis">
        <el-card class="analysis-card">
          <template #header>
            <div class="card-header">
              <span>用户数据分析</span>
              <el-select v-model="analysisTimeRange" size="small" @change="handleTimeRangeChange">
                <el-option label="近7天" value="7d"></el-option>
                <el-option label="近30天" value="30d"></el-option>
                <el-option label="近90天" value="90d"></el-option>
                <el-option label="近1年" value="1y"></el-option>
              </el-select>
            </div>
          </template>
          
          <!-- 分析图表 -->
          <div class="analysis-charts">
            <!-- 注册趋势 -->
            <el-card class="chart-card">
              <template #header>
                <div class="chart-header">
                  <span>用户注册趋势</span>
                </div>
              </template>
              <div ref="registerTrendChart" class="chart"></div>
            </el-card>
            
            <!-- 用户类型分布 -->
            <el-card class="chart-card">
              <template #header>
                <div class="chart-header">
                  <span>用户类型分布</span>
                </div>
              </template>
              <div ref="userTypeChart" class="chart"></div>
            </el-card>
            
            <!-- 用户活跃度 -->
            <el-card class="chart-card">
              <template #header>
                <div class="chart-header">
                  <span>用户活跃度</span>
                </div>
              </template>
              <div ref="userActivityChart" class="chart"></div>
            </el-card>
            
            <!-- 下载偏好 -->
            <el-card class="chart-card">
              <template #header>
                <div class="chart-header">
                  <span>用户下载偏好</span>
                </div>
              </template>
              <div ref="downloadPreferenceChart" class="chart"></div>
            </el-card>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 批量生成卡密对话框 -->
    <el-dialog
      v-model="generateCardsDialogVisible"
      title="批量生成卡密"
      width="500px"
    >
      <el-form
        ref="generateCardsForm"
        :model="generateCardsForm"
        :rules="generateCardsRules"
        label-width="120px"
      >
        <el-form-item label="卡密类型" prop="type">
          <el-select v-model="generateCardsForm.type" placeholder="请选择卡密类型">
            <el-option label="永久" value="permanent"></el-option>
            <el-option label="7天" value="7days"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生成数量" prop="count">
          <el-input-number v-model="generateCardsForm.count" :min="1" :max="1000"></el-input-number>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="generateCardsForm.note" type="textarea" placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="generateCardsDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleGenerateCardsSubmit">生成</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 设置永久用户对话框 -->
    <el-dialog
      v-model="setPermanentUserDialogVisible"
      title="设置永久用户"
      width="500px"
    >
      <el-form
        ref="setPermanentUserForm"
        :model="setPermanentUserForm"
        :rules="setPermanentUserRules"
        label-width="120px"
      >
        <el-form-item label="用户ID/OpenID" prop="userId">
          <el-input v-model="setPermanentUserForm.userId" placeholder="请输入用户ID或OpenID"></el-input>
        </el-form-item>
        <el-form-item label="设置类型">
          <el-radio-group v-model="setPermanentUserForm.setType">
            <el-radio label="permanent">设置为永久用户</el-radio>
            <el-radio label="normal">取消永久用户</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setPermanentUserDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSetPermanentUserSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import * as echarts from 'echarts'
import { 
  Key, Download, View, Tickets, Delete 
} from '@element-plus/icons-vue'

// 标签页
const activeTab = ref('userList')

// 用户列表
const users = reactive([
  { 
    id: 1, 
    nickname: '张三', 
    openid: 'o123456789', 
    avatarUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    registerDate: '2024-01-01', 
    lastLogin: '2024-01-15', 
    status: 'active',
    userType: 'permanent'
  },
  { 
    id: 2, 
    nickname: '李四', 
    openid: 'o987654321', 
    avatarUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    registerDate: '2024-01-02', 
    lastLogin: '2024-01-14', 
    status: 'active',
    userType: 'normal'
  },
  { 
    id: 3, 
    nickname: '王五', 
    openid: 'o567891234', 
    avatarUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    registerDate: '2024-01-03', 
    lastLogin: '2024-01-13', 
    status: 'active',
    userType: 'normal'
  },
  { 
    id: 4, 
    nickname: '赵六', 
    openid: 'o432198765', 
    avatarUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    registerDate: '2024-01-04', 
    lastLogin: '2024-01-12', 
    status: 'disabled',
    userType: 'normal'
  },
  { 
    id: 5, 
    nickname: '钱七', 
    openid: 'o678912345', 
    avatarUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    registerDate: '2024-01-05', 
    lastLogin: '2024-01-11', 
    status: 'active',
    userType: 'normal'
  }
])

const usersTotal = ref(100)
const currentPage = ref(1)
const pageSize = ref(10)
const userSearchKeyword = ref('')
const userStatusFilter = ref('')
const userTypeFilter = ref('')

// 卡密列表
const cards = reactive([
  { 
    id: 1, 
    cardNumber: 'KM202401010001', 
    type: 'permanent', 
    status: 'unused', 
    expireDate: '永久', 
    usedAt: '', 
    userId: '' 
  },
  { 
    id: 2, 
    cardNumber: 'KM202401010002', 
    type: 'permanent', 
    status: 'used', 
    expireDate: '永久', 
    usedAt: '2024-01-10 10:30:00', 
    userId: '1' 
  },
  { 
    id: 3, 
    cardNumber: 'KM202401010003', 
    type: '7days', 
    status: 'unused', 
    expireDate: '2024-01-15', 
    usedAt: '', 
    userId: '' 
  },
  { 
    id: 4, 
    cardNumber: 'KM202401010004', 
    type: '7days', 
    status: 'disabled', 
    expireDate: '2024-01-10', 
    usedAt: '', 
    userId: '' 
  },
  { 
    id: 5, 
    cardNumber: 'KM202401010005', 
    type: 'permanent', 
    status: 'unused', 
    expireDate: '永久', 
    usedAt: '', 
    userId: '' 
  }
])

const cardsTotal = ref(100)
const cardSearchKeyword = ref('')
const cardStatusFilter = ref('')
const cardTypeFilter = ref('')

// 批量生成卡密表单
const generateCardsDialogVisible = ref(false)
const generateCardsForm = reactive({
  type: 'permanent',
  count: 10,
  note: ''
})

const generateCardsRules = {
  type: [
    { required: true, message: '请选择卡密类型', trigger: 'blur' }
  ],
  count: [
    { required: true, message: '请输入生成数量', trigger: 'blur' },
    { min: 1, max: 1000, message: '生成数量在 1 到 1000 之间', trigger: 'blur' }
  ]
}

// 设置永久用户表单
const setPermanentUserDialogVisible = ref(false)
const setPermanentUserForm = reactive({
  userId: '',
  setType: 'permanent'
})

const setPermanentUserRules = {
  userId: [
    { required: true, message: '请输入用户ID或OpenID', trigger: 'blur' }
  ]
}

// 用户分析
const analysisTimeRange = ref('30d')
const registerTrendChart = ref(null)
const userTypeChart = ref(null)
const userActivityChart = ref(null)
const downloadPreferenceChart = ref(null)

// 初始化图表
onMounted(() => {
  // 当切换到用户分析标签页时初始化图表
  // 这里可以在标签页切换时初始化
})

// 标签页切换
const handleTabChange = (tab) => {
  if (tab === 'userAnalysis') {
    // 初始化分析图表
    setTimeout(() => {
      initRegisterTrendChart()
      initUserTypeChart()
      initUserActivityChart()
      initDownloadPreferenceChart()
    }, 100)
  }
}

// 初始化注册趋势图表
const initRegisterTrendChart = () => {
  if (!registerTrendChart.value) return
  
  const chart = echarts.init(registerTrendChart.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [120, 190, 300, 450, 600, 800, 1000],
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
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 初始化用户类型分布图表
const initUserTypeChart = () => {
  if (!userTypeChart.value) return
  
  const chart = echarts.init(userTypeChart.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [{
      type: 'pie',
      radius: '60%',
      data: [
        { name: '普通用户', value: 95 },
        { name: '永久用户', value: 5 }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 初始化用户活跃度图表
const initUserActivityChart = () => {
  if (!userActivityChart.value) return
  
  const chart = echarts.init(userActivityChart.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [1200, 1900, 1500, 2100, 1800, 2500, 2800],
      type: 'bar',
      itemStyle: {
        color: '#67C23A'
      }
    }]
  }
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 初始化下载偏好图表
const initDownloadPreferenceChart = () => {
  if (!downloadPreferenceChart.value) return
  
  const chart = echarts.init(downloadPreferenceChart.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { name: '试卷', value: 35 },
        { name: '练习', value: 25 },
        { name: '知识点总结', value: 20 },
        { name: '寒假', value: 10 },
        { name: '暑假', value: 10 }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 分页
const handleCurrentChange = (current) => {
  currentPage.value = current
  // 这里可以实现分页加载数据
}

// 搜索用户
const handleSearchUsers = () => {
  console.log('Search users:', userSearchKeyword.value, userStatusFilter.value, userTypeFilter.value)
  // 这里可以实现搜索功能
}

// 搜索卡密
const handleSearchCards = () => {
  console.log('Search cards:', cardSearchKeyword.value, cardStatusFilter.value, cardTypeFilter.value)
  // 这里可以实现搜索功能
}

// 查看用户
const handleViewUser = (user) => {
  console.log('View user:', user)
  // 实现查看用户详情
  ElMessage.info(`查看用户: ${user.nickname}`)
  // 这里可以打开用户详情对话框
}

// 查看用户（通过ID）
const handleViewUserById = (userId) => {
  console.log('View user by ID:', userId)
  // 实现查看用户详情
  ElMessage.info(`查看用户ID: ${userId}`)
  // 这里可以打开用户详情对话框
}

// 切换用户类型
const handleToggleUserType = (user) => {
  console.log('Toggle user type:', user)
  // 实现切换用户类型
  user.userType = user.userType === 'permanent' ? 'normal' : 'permanent'
  ElMessage.success(`${user.nickname} ${user.userType === 'permanent' ? '已设置为永久用户' : '已设置为普通用户'}`)
}

// 设置永久用户
const handleSetPermanentUser = () => {
  setPermanentUserDialogVisible.value = true
}

// 设置永久用户提交
const handleSetPermanentUserSubmit = () => {
  console.log('Set permanent user:', setPermanentUserForm)
  // 这里可以实现设置永久用户
  setPermanentUserDialogVisible.value = false
}

// 导出用户数据
const handleExportUsers = () => {
  console.log('Export users')
  // 这里可以实现导出用户数据
}

// 批量生成卡密
const handleGenerateCards = () => {
  generateCardsDialogVisible.value = true
}

// 批量生成卡密提交
const handleGenerateCardsSubmit = () => {
  console.log('Generate cards:', generateCardsForm)
  
  // 生成卡密
  const generateCardNumber = () => {
    const prefix = 'KM' + new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const suffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return prefix + suffix
  }
  
  const newCards = []
  const currentLength = cards.length
  
  for (let i = 0; i < generateCardsForm.count; i++) {
    const cardNumber = generateCardNumber()
    const expireDate = generateCardsForm.type === 'permanent' ? '永久' : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    
    newCards.push({
      id: currentLength + i + 1,
      cardNumber: cardNumber,
      type: generateCardsForm.type,
      status: 'unused',
      expireDate: expireDate,
      usedAt: '',
      userId: ''
    })
  }
  
  // 添加到卡密列表（新卡密显示在前面）
  for (let i = newCards.length - 1; i >= 0; i--) {
    cards.unshift(newCards[i])
  }
  
  generateCardsDialogVisible.value = false
  ElMessage.success(`成功生成 ${generateCardsForm.count} 张卡密`)
}

// 禁用过期卡密
const handleDisableExpiredCards = () => {
  console.log('Disable expired cards')
  // 实现禁用过期卡密
  let disabledCount = 0
  cards.forEach(card => {
    if (card.status === 'unused' && card.expireDate !== '永久' && new Date(card.expireDate) < new Date()) {
      card.status = 'disabled'
      disabledCount++
    }
  })
  ElMessage.success(`已禁用 ${disabledCount} 张过期卡密`)
}

// 禁用卡密
const handleDisableCard = (card) => {
  console.log('Disable card:', card)
  // 实现禁用卡密
  if (card.status === 'disabled') {
    ElMessage.warning('该卡密已经被禁用')
    return
  }
  card.status = 'disabled'
  ElMessage.success(`卡密 ${card.cardNumber} 已成功禁用`)
}

// 导出卡密数据
const handleExportCards = () => {
  console.log('Export cards')
  // 这里可以实现导出卡密数据
}

// 时间范围变化
const handleTimeRangeChange = (range) => {
  console.log('Time range changed:', range)
  // 这里可以根据时间范围更新图表
}
</script>

<style scoped>
.users-container {
  padding: 20px;
}

.users-tabs {
  margin-bottom: 24px;
}

.users-card,
.cards-card,
.analysis-card {
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.search-bar {
  margin: 20px 0;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
}

.search-input {
  width: 320px;
  border-radius: 6px;
}

.status-filter,
.type-filter {
  width: 160px;
  border-radius: 6px;
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nickname {
  font-size: 14px;
}

/* 分析图表 */
.analysis-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 20px;
}

.chart-card {
  height: 300px;
}

.chart {
  width: 100%;
  height: calc(100% - 40px);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .analysis-charts {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .header-actions {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .search-bar {
    flex-direction: column;
  }
  
  .search-input,
  .status-filter,
  .type-filter {
    width: 100%;
  }
  
  .analysis-charts {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    height: 250px;
  }
}
</style>
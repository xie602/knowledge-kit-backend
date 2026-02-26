<template>
  <div class="ads-container">
    <h2>广告管理</h2>
    
    <el-tabs v-model="activeTab">
      <!-- 微信广告组件配置 -->
      <el-tab-pane label="广告组件配置" name="components">
        <el-card class="ads-card">
          <template #header>
            <div class="card-header">
              <span>微信广告组件配置</span>
              <el-button type="primary" @click="handleSaveComponents">
                <el-icon><Check /></el-icon>
                保存配置
              </el-button>
            </div>
          </template>
          <div class="components-content">
            <div class="components-main">
              <el-form :model="adComponentsForm" label-width="150px">
                <el-form-item label="开屏广告">
                  <el-switch v-model="adComponentsForm.splashAd.enabled" @change="handleSplashAdChange">
                  </el-switch>
                  <div v-if="adComponentsForm.splashAd.enabled" class="ad-details">
                    <el-form-item label="广告ID" style="margin-left: 30px">
                      <el-input v-model="adComponentsForm.splashAd.adUnitId" placeholder="请输入开屏广告ID"></el-input>
                    </el-form-item>
                    <el-form-item label="显示时间" style="margin-left: 30px">
                      <el-input-number v-model="adComponentsForm.splashAd.displayTime" :min="1" :max="10" :step="1"></el-input-number>
                      <span class="unit">秒</span>
                    </el-form-item>
                  </div>
                </el-form-item>
                
                <el-form-item label="Banner广告">
                  <el-switch v-model="adComponentsForm.bannerAd.enabled" @change="handleBannerAdChange">
                  </el-switch>
                  <div v-if="adComponentsForm.bannerAd.enabled" class="ad-details">
                    <el-form-item label="广告ID" style="margin-left: 30px">
                      <el-input v-model="adComponentsForm.bannerAd.adUnitId" placeholder="请输入Banner广告ID"></el-input>
                    </el-form-item>
                    <el-form-item label="显示位置" style="margin-left: 30px">
                      <el-select v-model="adComponentsForm.bannerAd.position" placeholder="请选择显示位置">
                        <el-option label="顶部" value="top"></el-option>
                        <el-option label="底部" value="bottom"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-form-item>
                
                <el-form-item label="插屏广告">
                  <el-switch v-model="adComponentsForm.interstitialAd.enabled" @change="handleInterstitialAdChange">
                  </el-switch>
                  <div v-if="adComponentsForm.interstitialAd.enabled" class="ad-details">
                    <el-form-item label="广告ID" style="margin-left: 30px">
                      <el-input v-model="adComponentsForm.interstitialAd.adUnitId" placeholder="请输入插屏广告ID"></el-input>
                    </el-form-item>
                    <el-form-item label="触发条件" style="margin-left: 30px">
                      <el-select v-model="adComponentsForm.interstitialAd.trigger" placeholder="请选择触发条件">
                        <el-option label="页面切换" value="pageChange"></el-option>
                        <el-option label="定时显示" value="timed"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-form-item>
                
                <el-form-item label="激励视频广告">
                  <el-switch v-model="adComponentsForm.rewardedVideoAd.enabled" @change="handleRewardedVideoAdChange">
                  </el-switch>
                  <div v-if="adComponentsForm.rewardedVideoAd.enabled" class="ad-details">
                    <el-form-item label="广告ID" style="margin-left: 30px">
                      <el-input v-model="adComponentsForm.rewardedVideoAd.adUnitId" placeholder="请输入激励视频广告ID"></el-input>
                    </el-form-item>
                    <el-form-item label="奖励内容" style="margin-left: 30px">
                      <el-input v-model="adComponentsForm.rewardedVideoAd.reward" placeholder="请输入奖励内容"></el-input>
                    </el-form-item>
                  </div>
                </el-form-item>
                
                <el-form-item label="原生广告">
                  <el-switch v-model="adComponentsForm.nativeAd.enabled" @change="handleNativeAdChange">
                  </el-switch>
                  <div v-if="adComponentsForm.nativeAd.enabled" class="ad-details">
                    <el-form-item label="广告ID" style="margin-left: 30px">
                      <el-input v-model="adComponentsForm.nativeAd.adUnitId" placeholder="请输入原生广告ID"></el-input>
                    </el-form-item>
                  </div>
                </el-form-item>
                
                <el-form-item label="格子广告">
                  <el-switch v-model="adComponentsForm.gridAd.enabled" @change="handleGridAdChange">
                  </el-switch>
                  <div v-if="adComponentsForm.gridAd.enabled" class="ad-details">
                    <el-form-item label="广告ID" style="margin-left: 30px">
                      <el-input v-model="adComponentsForm.gridAd.adUnitId" placeholder="请输入格子广告ID"></el-input>
                    </el-form-item>
                  </div>
                </el-form-item>
              </el-form>
            </div>
            
            <!-- 右侧真机模拟 -->
            <div class="components-preview">
              <PhoneSimulator>
                <AdSimulator :adComponents="adComponentsForm" />
              </PhoneSimulator>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
      
      <!-- 广告位管理 -->
      <el-tab-pane label="广告位管理" name="positions">
        <el-card class="ads-card">
          <template #header>
            <div class="card-header">
              <span>广告位管理</span>
              <el-button type="primary" @click="handleAddPosition">
                <el-icon><Plus /></el-icon>
                添加广告位
              </el-button>
            </div>
          </template>
          <div class="positions-content">
            <el-table :data="adPositions" style="width: 100%" border>
              <el-table-column type="index" label="序号" width="60"></el-table-column>
              <el-table-column prop="name" label="广告位名称" min-width="150"></el-table-column>
              <el-table-column prop="page" label="所属页面" width="150"></el-table-column>
              <el-table-column prop="position" label="显示位置" width="120"></el-table-column>
              <el-table-column prop="adType" label="广告类型" width="120"></el-table-column>
              <el-table-column prop="displayCondition" label="显示条件" min-width="150"></el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-switch v-model="row.status" @change="handlePositionStatusChange(row)"></el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="{ row }">
                  <el-button size="small" type="primary" @click="handleEditPosition(row)" style="margin-right: 5px">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-button>
                  <el-button size="small" type="danger" @click="handleDeletePosition(row)">
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination
                layout="total, prev, pager, next, jumper"
                :total="adPositions.length"
                :page-size="10"
                :current-page="1"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
      
      <!-- 广告数据统计 -->
      <el-tab-pane label="数据统计" name="stats">
        <el-card class="ads-card">
          <template #header>
            <div class="card-header">
              <span>广告数据统计</span>
              <div class="header-actions">
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="handleDateRangeChange"
                ></el-date-picker>
                <el-button type="primary" @click="handleExportStats">
                  <el-icon><Download /></el-icon>
                  导出数据
                </el-button>
              </div>
            </div>
          </template>
          <div class="stats-content">
            <!-- 数据概览 -->
            <el-row :gutter="20" style="margin-bottom: 20px">
              <el-col :span="6">
                <el-card class="stat-card">
                  <div class="stat-item">
                    <div class="stat-value">{{ totalImpressions }}</div>
                    <div class="stat-label">总曝光量</div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card class="stat-card">
                  <div class="stat-item">
                    <div class="stat-value">{{ totalClicks }}</div>
                    <div class="stat-label">总点击量</div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card class="stat-card">
                  <div class="stat-item">
                    <div class="stat-value">{{ totalCtr }}%</div>
                    <div class="stat-label">平均点击率</div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card class="stat-card">
                  <div class="stat-item">
                    <div class="stat-value">¥{{ totalRevenue }}</div>
                    <div class="stat-label">总收益</div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            
            <!-- 数据表格 -->
            <el-table :data="adStats" style="width: 100%" border>
              <el-table-column prop="date" label="日期" width="120"></el-table-column>
              <el-table-column prop="adUnitId" label="广告ID" min-width="180"></el-table-column>
              <el-table-column prop="position" label="广告位" min-width="150"></el-table-column>
              <el-table-column prop="impressions" label="曝光量" width="100"></el-table-column>
              <el-table-column prop="clicks" label="点击量" width="100"></el-table-column>
              <el-table-column prop="ctr" label="点击率" width="100">
                <template #default="{ row }">
                  <span>{{ row.ctr }}%</span>
                </template>
              </el-table-column>
              <el-table-column prop="revenue" label="收益" width="100">
                <template #default="{ row }">
                  <span>¥{{ row.revenue }}</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination
                layout="total, prev, pager, next, jumper"
                :total="adStats.length"
                :page-size="10"
                :current-page="1"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
      
      <!-- 广告效果分析 -->
      <el-tab-pane label="效果分析" name="analysis">
        <el-card class="ads-card">
          <template #header>
            <div class="card-header">
              <span>广告效果分析</span>
              <el-select v-model="analysisPeriod" @change="handleAnalysisPeriodChange">
                <el-option label="日" value="day"></el-option>
                <el-option label="周" value="week"></el-option>
                <el-option label="月" value="month"></el-option>
              </el-select>
            </div>
          </template>
          <div class="analysis-content">
            <!-- 收益趋势图 -->
            <el-card class="chart-card">
              <template #header>
                <span>广告收益趋势</span>
              </template>
              <div class="chart-container">
                <el-empty v-if="false" description="暂无数据"></el-empty>
                <div v-else style="height: 300px">
                  <!-- 这里将使用ECharts绘制图表 -->
                  <div class="chart-placeholder">收益趋势图表</div>
                </div>
              </div>
            </el-card>
            
            <!-- 广告位效果对比 -->
            <el-card class="chart-card" style="margin-top: 20px">
              <template #header>
                <span>广告位效果对比</span>
              </template>
              <div class="chart-container">
                <el-empty v-if="false" description="暂无数据"></el-empty>
                <div v-else style="height: 300px">
                  <!-- 这里将使用ECharts绘制图表 -->
                  <div class="chart-placeholder">广告位效果对比图表</div>
                </div>
              </div>
            </el-card>
            
            <!-- 广告类型效果分析 -->
            <el-card class="chart-card" style="margin-top: 20px">
              <template #header>
                <span>广告类型效果分析</span>
              </template>
              <div class="chart-container">
                <el-empty v-if="false" description="暂无数据"></el-empty>
                <div v-else style="height: 300px">
                  <!-- 这里将使用ECharts绘制图表 -->
                  <div class="chart-placeholder">广告类型效果分析图表</div>
                </div>
              </div>
            </el-card>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 添加/编辑广告位对话框 -->
    <el-dialog
      v-model="positionDialogVisible"
      :title="isEditPosition ? '编辑广告位' : '添加广告位'"
      width="600px"
    >
      <el-form :model="positionForm" label-width="120px">
        <el-form-item label="广告位名称" required>
          <el-input v-model="positionForm.name" placeholder="请输入广告位名称"></el-input>
        </el-form-item>
        <el-form-item label="所属页面" required>
          <el-select v-model="positionForm.page" placeholder="请选择所属页面">
            <el-option label="首页" value="home"></el-option>
            <el-option label="分类页" value="category"></el-option>
            <el-option label="资料详情页" value="detail"></el-option>
            <el-option label="个人中心" value="profile"></el-option>
            <el-option label="搜索结果页" value="search"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示位置" required>
          <el-select v-model="positionForm.position" placeholder="请选择显示位置">
            <el-option label="顶部" value="top"></el-option>
            <el-option label="中部" value="middle"></el-option>
            <el-option label="底部" value="bottom"></el-option>
            <el-option label="悬浮" value="float"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告类型" required>
          <el-select v-model="positionForm.adType" placeholder="请选择广告类型">
            <el-option label="Banner" value="banner"></el-option>
            <el-option label="插屏" value="interstitial"></el-option>
            <el-option label="激励视频" value="rewardedVideo"></el-option>
            <el-option label="原生" value="native"></el-option>
            <el-option label="格子" value="grid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示条件">
          <el-checkbox-group v-model="positionForm.displayCondition">
            <el-checkbox label="all">所有用户</el-checkbox>
            <el-checkbox label="onlyNormal">仅普通用户</el-checkbox>
            <el-checkbox label="onlyPermanent">仅永久用户</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="positionForm.status"></el-switch>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="positionForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="positionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSavePosition">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Plus, Edit, Delete, Check, Download, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PhoneSimulator from '../../components/PhoneSimulator.vue'
import AdSimulator from '../../components/simulators/AdSimulator.vue'

// 当前激活的标签页
const activeTab = ref('components')

// 广告组件配置表单
const adComponentsForm = reactive({
  splashAd: {
    enabled: true,
    adUnitId: 'adunit-1234567890',
    displayTime: 5
  },
  bannerAd: {
    enabled: true,
    adUnitId: 'adunit-0987654321',
    position: 'top'
  },
  interstitialAd: {
    enabled: false,
    adUnitId: '',
    trigger: 'pageChange'
  },
  rewardedVideoAd: {
    enabled: true,
    adUnitId: 'adunit-abcdefghij',
    reward: '下载权限'
  },
  nativeAd: {
    enabled: false,
    adUnitId: ''
  },
  gridAd: {
    enabled: false,
    adUnitId: ''
  }
})

// 广告位列表
const adPositions = ref([
  {
    id: 1,
    name: '首页顶部Banner',
    page: 'home',
    position: 'top',
    adType: 'banner',
    displayCondition: ['all'],
    status: true,
    remark: '首页顶部横幅广告'
  },
  {
    id: 2,
    name: '资料详情页激励视频',
    page: 'detail',
    position: 'middle',
    adType: 'rewardedVideo',
    displayCondition: ['onlyNormal'],
    status: true,
    remark: '资料详情页下载前激励视频广告'
  },
  {
    id: 3,
    name: '分类页插屏广告',
    page: 'category',
    position: 'float',
    adType: 'interstitial',
    displayCondition: ['all'],
    status: false,
    remark: '分类页切换时显示的插屏广告'
  },
  {
    id: 4,
    name: '个人中心原生广告',
    page: 'profile',
    position: 'middle',
    adType: 'native',
    displayCondition: ['all'],
    status: true,
    remark: '个人中心融入内容的原生广告'
  }
])

// 广告数据统计
const adStats = ref([
  {
    date: '2026-02-20',
    adUnitId: 'adunit-1234567890',
    position: '首页顶部Banner',
    impressions: 1234,
    clicks: 123,
    ctr: 9.97,
    revenue: 12.34
  },
  {
    date: '2026-02-20',
    adUnitId: 'adunit-abcdefghij',
    position: '资料详情页激励视频',
    impressions: 890,
    clicks: 234,
    ctr: 26.29,
    revenue: 23.40
  },
  {
    date: '2026-02-19',
    adUnitId: 'adunit-1234567890',
    position: '首页顶部Banner',
    impressions: 1123,
    clicks: 112,
    ctr: 9.97,
    revenue: 11.20
  },
  {
    date: '2026-02-19',
    adUnitId: 'adunit-abcdefghij',
    position: '资料详情页激励视频',
    impressions: 789,
    clicks: 210,
    ctr: 26.62,
    revenue: 21.00
  }
])

// 数据概览
const totalImpressions = computed(() => {
  return adStats.value.reduce((sum, item) => sum + item.impressions, 0)
})

const totalClicks = computed(() => {
  return adStats.value.reduce((sum, item) => sum + item.clicks, 0)
})

const totalCtr = computed(() => {
  if (totalImpressions.value === 0) return 0
  return (totalClicks.value / totalImpressions.value * 100).toFixed(2)
})

const totalRevenue = computed(() => {
  return adStats.value.reduce((sum, item) => sum + item.revenue, 0).toFixed(2)
})

// 日期范围
const dateRange = ref([])

// 分析周期
const analysisPeriod = ref('day')

// 广告位对话框
const positionDialogVisible = ref(false)
const isEditPosition = ref(false)
const positionForm = reactive({
  name: '',
  page: '',
  position: '',
  adType: '',
  displayCondition: ['all'],
  status: true,
  remark: ''
})

// 保存广告组件配置
const handleSaveComponents = () => {
  console.log('保存广告组件配置:', adComponentsForm)
  ElMessage.success('广告组件配置保存成功')
}

// 广告组件状态变更
const handleSplashAdChange = () => {
  console.log('开屏广告状态变更:', adComponentsForm.splashAd.enabled)
}

const handleBannerAdChange = () => {
  console.log('Banner广告状态变更:', adComponentsForm.bannerAd.enabled)
}

const handleInterstitialAdChange = () => {
  console.log('插屏广告状态变更:', adComponentsForm.interstitialAd.enabled)
}

const handleRewardedVideoAdChange = () => {
  console.log('激励视频广告状态变更:', adComponentsForm.rewardedVideoAd.enabled)
}

const handleNativeAdChange = () => {
  console.log('原生广告状态变更:', adComponentsForm.nativeAd.enabled)
}

const handleGridAdChange = () => {
  console.log('格子广告状态变更:', adComponentsForm.gridAd.enabled)
}

// 添加广告位
const handleAddPosition = () => {
  isEditPosition.value = false
  Object.assign(positionForm, {
    name: '',
    page: '',
    position: '',
    adType: '',
    displayCondition: ['all'],
    status: true,
    remark: ''
  })
  positionDialogVisible.value = true
}

// 编辑广告位
const handleEditPosition = (row) => {
  isEditPosition.value = true
  Object.assign(positionForm, {
    id: row.id,
    name: row.name,
    page: row.page,
    position: row.position,
    adType: row.adType,
    displayCondition: row.displayCondition || ['all'],
    status: row.status,
    remark: row.remark
  })
  positionDialogVisible.value = true
}

// 保存广告位
const handleSavePosition = () => {
  if (isEditPosition.value) {
    // 编辑现有广告位
    const index = adPositions.value.findIndex(item => item.id === positionForm.id)
    if (index !== -1) {
      adPositions.value[index] = { ...positionForm }
    }
    ElMessage.success('广告位编辑成功')
  } else {
    // 添加新广告位
    const newPosition = {
      id: adPositions.value.length + 1,
      ...positionForm
    }
    adPositions.value.push(newPosition)
    ElMessage.success('广告位添加成功')
  }
  positionDialogVisible.value = false
}

// 删除广告位
const handleDeletePosition = (row) => {
  ElMessageBox.confirm(
    `确定要删除广告位「${row.name}」吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = adPositions.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      adPositions.value.splice(index, 1)
    }
    ElMessage.success('广告位删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 广告位状态变更
const handlePositionStatusChange = (row) => {
  console.log('广告位状态变更:', row.name, row.status)
  ElMessage.info(`${row.name} 状态已${row.status ? '启用' : '禁用'}`)
}

// 日期范围变更
const handleDateRangeChange = (val) => {
  console.log('日期范围变更:', val)
  ElMessage.info('日期范围已更新')
}

// 导出数据
const handleExportStats = () => {
  ElMessage.success('广告数据导出成功，文件已下载')
}

// 分析周期变更
const handleAnalysisPeriodChange = (val) => {
  console.log('分析周期变更:', val)
  ElMessage.info('分析周期已更新')
}

// 分页处理
const handleCurrentChange = (current) => {
  console.log('当前页码:', current)
}
</script>

<style scoped>
.ads-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.ad-details {
  margin-top: 10px;
  padding-left: 30px;
  border-left: 2px solid #e0e0e0;
}

.unit {
  margin-left: 10px;
  color: #909399;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 广告组件配置布局 */
.components-content {
  display: flex;
  gap: 30px;
  min-height: 800px;
}

/* 左侧主要内容 */
.components-main {
  flex: 1;
}

/* 右侧真机模拟 */
.components-preview {
  flex: 0 0 500px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  min-height: 800px;
}

/* 数据统计样式 */
.stat-card {
  border-radius: 4px;
  overflow: hidden;
}

.stat-item {
  padding: 20px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

/* 图表样式 */
.chart-card {
  margin-bottom: 20px;
}

.chart-container {
  position: relative;
  height: 300px;
}

.chart-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #909399;
  font-size: 16px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 1200px) {
  .components-content {
    flex-direction: column;
  }
  
  .components-preview {
    flex: none;
    min-height: 600px;
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
    justify-content: space-between;
  }
  
  .ad-details {
    padding-left: 20px;
  }
  
  .components-content {
    flex-direction: column;
  }
  
  .components-preview {
    flex: none;
    min-height: 600px;
  }
}
</style>
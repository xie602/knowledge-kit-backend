<template>
  <div class="recommend-container">
    <h2>推荐管理</h2>
    
    <el-card class="recommend-card">
      <template #header>
        <div class="card-header">
          <span>推荐小程序管理</span>
          <div class="header-actions">
            <el-button type="primary" @click="handleAddMiniProgram">
              <el-icon><Plus /></el-icon>
              添加推荐
            </el-button>
          </div>
        </div>
      </template>
      <div class="recommend-content">
        <el-table :data="miniProgramList" style="width: 100%">
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column label="小程序图标" width="80">
            <template #default="{ row }">
              <el-image
                :src="row.iconUrl"
                fit="cover"
                style="width: 48px; height: 48px"
                round
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="小程序名称" min-width="150"></el-table-column>
          <el-table-column prop="appId" label="小程序AppID" min-width="200"></el-table-column>
          <el-table-column prop="path" label="跳转路径" min-width="150"></el-table-column>
          <el-table-column prop="description" label="描述" min-width="200"></el-table-column>
          <el-table-column prop="sort" label="显示顺序" width="100"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-switch v-model="row.status" @change="handleStatusChange(row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button size="small" type="primary" @click="handleEditMiniProgram(row)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="handleDeleteMiniProgram(row)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    
    <el-card class="recommend-card">
      <template #header>
        <div class="card-header">
          <span>相关资料推荐配置</span>
        </div>
      </template>
      <div class="recommend-content">
        <el-form :model="relatedForm" label-width="150px">
          <el-form-item label="推荐算法">
            <el-select v-model="relatedForm.algorithm" placeholder="请选择推荐算法">
              <el-option label="基于分类" value="category"></el-option>
              <el-option label="基于热门" value="hot"></el-option>
              <el-option label="基于相似" value="similar"></el-option>
              <el-option label="混合推荐" value="hybrid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推荐数量">
            <el-input-number v-model="relatedForm.recommendCount" :min="1" :max="20" :step="1" />
          </el-form-item>
          <el-form-item label="推荐范围">
            <el-select v-model="relatedForm.recommendScope" placeholder="请选择推荐范围">
              <el-option label="同年级" value="grade"></el-option>
              <el-option label="同学科" value="subject"></el-option>
              <el-option label="同类型" value="type"></el-option>
              <el-option label="全部范围" value="all"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推荐条件">
            <el-checkbox-group v-model="relatedForm.recommendConditions">
              <el-checkbox label="recent">最近上传</el-checkbox>
              <el-checkbox label="highDownload">高下载量</el-checkbox>
              <el-checkbox label="highFavorites">高收藏量</el-checkbox>
              <el-checkbox label="quality">优质资料</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="推荐位置">
            <el-checkbox-group v-model="relatedForm.recommendPositions">
              <el-checkbox label="detailPage">资料详情页</el-checkbox>
              <el-checkbox label="categoryPage">分类页面</el-checkbox>
              <el-checkbox label="searchResult">搜索结果页</el-checkbox>
              <el-checkbox label="homePage">首页推荐</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSaveRelatedConfig">保存配置</el-button>
            <el-button @click="handleResetRelatedConfig">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    
    <!-- 操作日志 -->
    <el-card class="logs-card">
      <template #header>
        <div class="card-header">
          <span>操作日志</span>
        </div>
      </template>
      <el-table :data="operationLogs" style="width: 100%">
        <el-table-column prop="time" label="操作时间" width="180"></el-table-column>
        <el-table-column prop="action" label="操作类型" width="120"></el-table-column>
        <el-table-column prop="content" label="操作内容" min-width="400"></el-table-column>
        <el-table-column prop="user" label="操作人" width="100"></el-table-column>
      </el-table>
    </el-card>
    
    <!-- 推荐小程序编辑对话框 -->
    <el-dialog
      v-model="miniProgramDialogVisible"
      :title="isEditMode ? '编辑推荐小程序' : '添加推荐小程序'"
      width="500px"
    >
      <el-form :model="miniProgramForm" label-width="100px">
        <el-form-item label="小程序名称">
          <el-input v-model="miniProgramForm.name" placeholder="请输入小程序名称" />
        </el-form-item>
        <el-form-item label="小程序AppID">
          <el-input v-model="miniProgramForm.appId" placeholder="请输入小程序AppID" />
        </el-form-item>
        <el-form-item label="跳转路径">
          <el-input v-model="miniProgramForm.path" placeholder="请输入跳转路径" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="miniProgramForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入小程序描述"
          />
        </el-form-item>
        <el-form-item label="显示顺序">
          <el-input-number v-model="miniProgramForm.sort" :min="1" :max="100" :step="1" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="miniProgramForm.status" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="miniProgramDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveMiniProgram">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 推荐小程序列表
const miniProgramList = ref([
  {
    id: '1',
    name: '学习助手',
    appId: 'wx1234567890abcdef',
    path: 'pages/index/index',
    iconUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=education%20app%20icon%20minimal%20design&image_size=square',
    description: '提供在线学习工具和资源',
    sort: 1,
    status: true
  },
  {
    id: '2',
    name: '作业批改',
    appId: 'wxabcdef1234567890',
    path: 'pages/home/home',
    iconUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=homework%20checking%20app%20icon%20minimal%20design&image_size=square',
    description: '智能作业批改和辅导',
    sort: 2,
    status: true
  },
  {
    id: '3',
    name: '错题本',
    appId: 'wx9876543210fedcba',
    path: 'pages/main/main',
    iconUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=error%20notebook%20app%20icon%20minimal%20design&image_size=square',
    description: '收集和管理错题',
    sort: 3,
    status: false
  }
])

// 相关资料推荐配置
const relatedForm = reactive({
  algorithm: 'hybrid',
  recommendCount: 6,
  recommendScope: 'all',
  recommendConditions: ['recent', 'highDownload', 'highFavorites'],
  recommendPositions: ['detailPage', 'categoryPage', 'searchResult']
})

// 操作日志
const operationLogs = ref([
  { time: '2026-02-21 15:30:00', action: '添加', content: '添加了推荐小程序 "学习助手"', user: '管理员' },
  { time: '2026-02-21 14:20:00', action: '编辑', content: '修改了推荐小程序 "作业批改" 的排序', user: '管理员' },
  { time: '2026-02-21 13:10:00', action: '删除', content: '删除了推荐小程序 "旧版工具"', user: '管理员' },
  { time: '2026-02-21 12:00:00', action: '配置', content: '更新了相关资料推荐配置', user: '管理员' }
])

// 对话框相关变量
const miniProgramDialogVisible = ref(false)
const isEditMode = ref(false)
const miniProgramForm = reactive({
  id: '',
  name: '',
  appId: '',
  path: '',
  description: '',
  sort: 1,
  status: true
})

// 初始化
onMounted(() => {
  loadRecommendData()
})

// 加载推荐数据
const loadRecommendData = () => {
  // 这里可以从API获取推荐数据
  console.log('Loading recommend data...')
}

// 添加推荐小程序
const handleAddMiniProgram = () => {
  isEditMode.value = false
  Object.assign(miniProgramForm, {
    id: '',
    name: '',
    appId: '',
    path: '',
    description: '',
    sort: miniProgramList.value.length + 1,
    status: true
  })
  miniProgramDialogVisible.value = true
}

// 编辑推荐小程序
const handleEditMiniProgram = (row) => {
  isEditMode.value = true
  Object.assign(miniProgramForm, { ...row })
  miniProgramDialogVisible.value = true
}

// 保存推荐小程序
const handleSaveMiniProgram = () => {
  if (!miniProgramForm.name || !miniProgramForm.appId) {
    ElMessage.warning('请填写必填字段')
    return
  }
  
  if (isEditMode.value) {
    // 编辑模式
    const index = miniProgramList.value.findIndex(item => item.id === miniProgramForm.id)
    if (index !== -1) {
      miniProgramList.value[index] = { ...miniProgramForm }
      
      // 添加操作日志
      operationLogs.value.unshift({
        time: new Date().toLocaleString('zh-CN'),
        action: '编辑',
        content: `修改了推荐小程序 "${miniProgramForm.name}" 的信息`,
        user: '管理员'
      })
      
      ElMessage.success('推荐小程序编辑成功')
    }
  } else {
    // 添加模式
    const newMiniProgram = {
      id: Date.now().toString(),
      name: miniProgramForm.name,
      appId: miniProgramForm.appId,
      path: miniProgramForm.path,
      iconUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=new%20app%20icon%20minimal%20design&image_size=square',
      description: miniProgramForm.description,
      sort: miniProgramForm.sort,
      status: miniProgramForm.status
    }
    miniProgramList.value.push(newMiniProgram)
    
    // 添加操作日志
    operationLogs.value.unshift({
      time: new Date().toLocaleString('zh-CN'),
      action: '添加',
      content: `添加了推荐小程序 "${newMiniProgram.name}"`,
      user: '管理员'
    })
    
    ElMessage.success('推荐小程序添加成功')
  }
  
  miniProgramDialogVisible.value = false
}

// 删除推荐小程序
const handleDeleteMiniProgram = (row) => {
  // 这里可以打开确认对话框
  ElMessage.confirm(`确定要删除推荐小程序 "${row.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除
    const index = miniProgramList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      miniProgramList.value.splice(index, 1)
    }
    
    // 添加操作日志
    operationLogs.value.unshift({
      time: new Date().toLocaleString('zh-CN'),
      action: '删除',
      content: `删除了推荐小程序 "${row.name}"`,
      user: '管理员'
    })
    
    ElMessage.success('推荐小程序删除成功')
  }).catch(() => {
    ElMessage.info('取消删除')
  })
}

// 状态变更
const handleStatusChange = (row) => {
  // 添加操作日志
  operationLogs.value.unshift({
    time: new Date().toLocaleString('zh-CN'),
    action: '状态变更',
    content: `将推荐小程序 "${row.name}" ${row.status ? '启用' : '禁用'}`,
    user: '管理员'
  })
  
  ElMessage.success(`推荐小程序 ${row.status ? '启用' : '禁用'} 成功`)
}

// 保存相关资料推荐配置
const handleSaveRelatedConfig = () => {
  // 这里可以保存配置
  console.log('Saving related recommend config:', relatedForm)
  
  // 添加操作日志
  operationLogs.value.unshift({
    time: new Date().toLocaleString('zh-CN'),
    action: '配置',
    content: '更新了相关资料推荐配置',
    user: '管理员'
  })
  
  ElMessage.success('相关资料推荐配置保存成功')
}

// 重置相关资料推荐配置
const handleResetRelatedConfig = () => {
  Object.assign(relatedForm, {
    algorithm: 'hybrid',
    recommendCount: 6,
    recommendScope: 'all',
    recommendConditions: ['recent', 'highDownload', 'highFavorites'],
    recommendPositions: ['detailPage', 'categoryPage', 'searchResult']
  })
  
  ElMessage.info('相关资料推荐配置已重置')
}
</script>

<style scoped>
.recommend-container {
  padding: 20px;
}

.recommend-card {
  margin-bottom: 30px;
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

.recommend-content {
  padding: 20px 0;
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
}
</style>
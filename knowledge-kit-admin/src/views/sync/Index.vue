<template>
  <div class="sync-container">
    <h2>内容同步</h2>
    
    <el-card class="sync-card">
      <template #header>
        <div class="card-header">
          <span>GitHub仓库同步</span>
        </div>
      </template>
      <div class="sync-content">
        <el-form :model="githubForm" label-width="150px">
          <el-form-item label="GitHub仓库地址">
            <el-input v-model="githubForm.repoUrl" placeholder="请输入GitHub仓库地址" />
          </el-form-item>
          <el-form-item label="分支名称">
            <el-input v-model="githubForm.branch" placeholder="请输入分支名称" />
          </el-form-item>
          <el-form-item label="同步内容">
            <el-checkbox-group v-model="githubForm.syncContent">
              <el-checkbox label="documents">资料数据</el-checkbox>
              <el-checkbox label="images">预览图片</el-checkbox>
              <el-checkbox label="categories">分类数据</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSyncGithub" :loading="githubSyncLoading">
              <el-icon><Refresh /></el-icon>
              开始同步
            </el-button>
            <el-button @click="handleTestConnection">测试连接</el-button>
          </el-form-item>
        </el-form>
        
        <div class="sync-log" v-if="githubSyncLog">
          <h4>同步日志</h4>
          <el-divider></el-divider>
          <pre>{{ githubSyncLog }}</pre>
        </div>
      </div>
    </el-card>
    
    <el-card class="sync-card">
      <template #header>
        <div class="card-header">
          <span>公众号文章同步</span>
        </div>
      </template>
      <div class="sync-content">
        <el-form :model="wechatForm" label-width="150px">
          <el-form-item label="公众号AppID">
            <el-input v-model="wechatForm.appId" placeholder="请输入公众号AppID" />
          </el-form-item>
          <el-form-item label="公众号AppSecret">
            <el-input v-model="wechatForm.appSecret" type="password" placeholder="请输入公众号AppSecret" />
          </el-form-item>
          <el-form-item label="同步数量">
            <el-input-number v-model="wechatForm.syncCount" :min="1" :max="100" :step="1" />
          </el-form-item>
          <el-form-item label="同步选项">
            <el-checkbox v-model="wechatForm.autoSync">启用自动同步</el-checkbox>
            <el-checkbox v-model="wechatForm.updateExisting">更新已存在文章</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSyncWechat" :loading="wechatSyncLoading">
              <el-icon><Refresh /></el-icon>
              开始同步
            </el-button>
            <el-button @click="handleTestWechatConnection">测试连接</el-button>
          </el-form-item>
        </el-form>
        
        <div class="sync-log" v-if="wechatSyncLog">
          <h4>同步日志</h4>
          <el-divider></el-divider>
          <pre>{{ wechatSyncLog }}</pre>
        </div>
      </div>
    </el-card>
    
    <el-card class="sync-card">
      <template #header>
        <div class="card-header">
          <span>数据备份与恢复</span>
        </div>
      </template>
      <div class="sync-content">
        <div class="backup-section">
          <h4>数据备份</h4>
          <el-form :model="backupForm" label-width="150px">
            <el-form-item label="备份内容">
              <el-checkbox-group v-model="backupForm.backupContent">
                <el-checkbox label="users">用户数据</el-checkbox>
                <el-checkbox label="documents">资料数据</el-checkbox>
                <el-checkbox label="categories">分类数据</el-checkbox>
                <el-checkbox label="cards">卡密数据</el-checkbox>
                <el-checkbox label="settings">系统设置</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleBackupData" :loading="backupLoading">
                <el-icon><Download /></el-icon>
                开始备份
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        
        <el-divider></el-divider>
        
        <div class="restore-section">
          <h4>数据恢复</h4>
          <el-form label-width="150px">
            <el-form-item label="备份文件">
              <el-upload
                class="upload-demo"
                action="#"
                :on-change="handleFileChange"
                :auto-upload="false"
                :show-file-list="true"
              >
                <el-button type="primary">
                  <el-icon><Upload /></el-icon>
                  选择备份文件
                </el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    请选择JSON格式的备份文件
                  </div>
                </template>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="warning" @click="handleRestoreData" :loading="restoreLoading">
                <el-icon><Upload /></el-icon>
                开始恢复
              </el-button>
              <el-button @click="handleClearFile">清空选择</el-button>
            </el-form-item>
          </el-form>
        </div>
        
        <div class="sync-log" v-if="backupRestoreLog">
          <h4>操作日志</h4>
          <el-divider></el-divider>
          <pre>{{ backupRestoreLog }}</pre>
        </div>
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
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : 'danger'">
              {{ row.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Refresh, Download, Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// GitHub同步表单
const githubForm = reactive({
  repoUrl: 'https://github.com/username/knowledge-kit-data',
  branch: 'main',
  syncContent: ['documents', 'images', 'categories']
})

// 公众号同步表单
const wechatForm = reactive({
  appId: '',
  appSecret: '',
  syncCount: 20,
  autoSync: false,
  updateExisting: true
})

// 备份表单
const backupForm = reactive({
  backupContent: ['users', 'documents', 'categories', 'cards', 'settings']
})

// 加载状态
const githubSyncLoading = ref(false)
const wechatSyncLoading = ref(false)
const backupLoading = ref(false)
const restoreLoading = ref(false)

// 日志
const githubSyncLog = ref('')
const wechatSyncLog = ref('')
const backupRestoreLog = ref('')

// 操作日志
const operationLogs = ref([
  { time: '2026-02-21 15:30:00', action: 'GitHub同步', content: '同步GitHub仓库资料数据，成功同步150条记录', status: 'success' },
  { time: '2026-02-21 14:20:00', action: '公众号同步', content: '同步公众号文章，成功同步10篇文章', status: 'success' },
  { time: '2026-02-21 13:10:00', action: '数据备份', content: '备份系统数据，包含用户、资料、分类数据', status: 'success' },
  { time: '2026-02-21 12:00:00', action: 'GitHub同步', content: '同步GitHub仓库分类数据，成功更新30个分类', status: 'success' }
])

// 选择的备份文件
const selectedFile = ref(null)

// 初始化
onMounted(() => {
  loadSyncConfig()
})

// 加载同步配置
const loadSyncConfig = () => {
  // 这里可以从API获取同步配置
  console.log('Loading sync config...')
}

// GitHub同步
const handleSyncGithub = () => {
  githubSyncLoading.value = true
  githubSyncLog.value = '开始同步GitHub仓库...\n'
  
  // 模拟同步过程
  setTimeout(() => {
    githubSyncLog.value += '连接GitHub仓库...\n'
    setTimeout(() => {
      githubSyncLog.value += '获取仓库文件列表...\n'
      setTimeout(() => {
        githubSyncLog.value += '同步资料数据...\n'
        setTimeout(() => {
          githubSyncLog.value += '同步预览图片...\n'
          setTimeout(() => {
            githubSyncLog.value += '同步分类数据...\n'
            setTimeout(() => {
              githubSyncLog.value += '同步完成！成功同步150条资料，30个分类\n'
              githubSyncLoading.value = false
              
              // 添加操作日志
              operationLogs.value.unshift({
                time: new Date().toLocaleString('zh-CN'),
                action: 'GitHub同步',
                content: `同步GitHub仓库资料数据，成功同步150条记录`,
                status: 'success'
              })
              
              ElMessage.success('GitHub仓库同步成功')
            }, 1000)
          }, 800)
        }, 1000)
      }, 800)
    }, 1000)
  }, 500)
}

// 测试GitHub连接
const handleTestConnection = () => {
  ElMessage.info('测试连接中...')
  setTimeout(() => {
    ElMessage.success('连接GitHub仓库成功')
  }, 1000)
}

// 公众号同步
const handleSyncWechat = () => {
  if (!wechatForm.appId || !wechatForm.appSecret) {
    ElMessage.error('请填写公众号AppID和AppSecret')
    return
  }
  
  wechatSyncLoading.value = true
  wechatSyncLog.value = '开始同步公众号文章...\n'
  
  // 模拟同步过程
  setTimeout(() => {
    wechatSyncLog.value += '获取访问令牌...\n'
    setTimeout(() => {
      wechatSyncLog.value += '获取文章列表...\n'
      setTimeout(() => {
        wechatSyncLog.value += '同步文章内容...\n'
        setTimeout(() => {
          wechatSyncLog.value += '同步完成！成功同步10篇文章\n'
          wechatSyncLoading.value = false
          
          // 添加操作日志
          operationLogs.value.unshift({
            time: new Date().toLocaleString('zh-CN'),
            action: '公众号同步',
            content: `同步公众号文章，成功同步${wechatForm.syncCount}篇文章`,
            status: 'success'
          })
          
          ElMessage.success('公众号文章同步成功')
        }, 1500)
      }, 1000)
    }, 1000)
  }, 500)
}

// 测试公众号连接
const handleTestWechatConnection = () => {
  if (!wechatForm.appId || !wechatForm.appSecret) {
    ElMessage.error('请填写公众号AppID和AppSecret')
    return
  }
  
  ElMessage.info('测试连接中...')
  setTimeout(() => {
    ElMessage.success('连接公众号成功')
  }, 1000)
}

// 数据备份
const handleBackupData = () => {
  backupLoading.value = true
  backupRestoreLog.value = '开始备份数据...\n'
  
  // 模拟备份过程
  setTimeout(() => {
    backupRestoreLog.value += '备份用户数据...\n'
    setTimeout(() => {
      backupRestoreLog.value += '备份资料数据...\n'
      setTimeout(() => {
        backupRestoreLog.value += '备份分类数据...\n'
        setTimeout(() => {
          backupRestoreLog.value += '备份卡密数据...\n'
          setTimeout(() => {
            backupRestoreLog.value += '备份系统设置...\n'
            setTimeout(() => {
              backupRestoreLog.value += '备份完成！生成备份文件：backup_20260221.json\n'
              backupLoading.value = false
              
              // 添加操作日志
              operationLogs.value.unshift({
                time: new Date().toLocaleString('zh-CN'),
                action: '数据备份',
                content: '备份系统数据，包含用户、资料、分类数据',
                status: 'success'
              })
              
              ElMessage.success('数据备份成功，文件已下载')
            }, 800)
          }, 800)
        }, 1000)
      }, 1000)
    }, 1000)
  }, 500)
}

// 文件选择
const handleFileChange = (file) => {
  selectedFile.value = file.raw
  ElMessage.info(`已选择文件：${file.name}`)
}

// 清空文件选择
const handleClearFile = () => {
  selectedFile.value = null
  ElMessage.info('已清空文件选择')
}

// 数据恢复
const handleRestoreData = () => {
  if (!selectedFile.value) {
    ElMessage.error('请选择备份文件')
    return
  }
  
  restoreLoading.value = true
  backupRestoreLog.value = '开始恢复数据...\n'
  
  // 模拟恢复过程
  setTimeout(() => {
    backupRestoreLog.value += '读取备份文件...\n'
    setTimeout(() => {
      backupRestoreLog.value += '验证文件格式...\n'
      setTimeout(() => {
        backupRestoreLog.value += '恢复用户数据...\n'
        setTimeout(() => {
          backupRestoreLog.value += '恢复资料数据...\n'
          setTimeout(() => {
            backupRestoreLog.value += '恢复分类数据...\n'
            setTimeout(() => {
              backupRestoreLog.value += '恢复完成！成功恢复100个用户，150条资料，30个分类\n'
              restoreLoading.value = false
              
              // 添加操作日志
              operationLogs.value.unshift({
                time: new Date().toLocaleString('zh-CN'),
                action: '数据恢复',
                content: '从备份文件恢复系统数据',
                status: 'success'
              })
              
              ElMessage.success('数据恢复成功')
            }, 1000)
          }, 1000)
        }, 1000)
      }, 800)
    }, 800)
  }, 500)
}
</script>

<style scoped>
.sync-container {
  padding: 20px;
}

.sync-card {
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sync-content {
  padding: 20px 0;
}

.sync-log {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.sync-log pre {
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
}

.backup-section,
.restore-section {
  margin-bottom: 20px;
}

.backup-section h4,
.restore-section h4 {
  margin-bottom: 15px;
  color: #303133;
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
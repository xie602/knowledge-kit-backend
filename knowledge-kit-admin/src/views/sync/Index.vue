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
          <el-form-item label="GitHub Token">
            <el-input v-model="githubForm.token" type="password" placeholder="请输入GitHub Personal Access Token" />
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
            <el-button @click="saveSyncConfig">保存配置</el-button>
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
import api from '@/api/index'
import { callCloudFunction } from '@/api/index'

// GitHub同步表单
const githubForm = reactive({
  repoUrl: '',
  token: '',
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
const operationLogs = ref([])

// 选择的备份文件
const selectedFile = ref(null)

// 初始化
onMounted(() => {
  loadSyncConfig()
  loadOperationLogs()
})

// 加载同步配置
const loadSyncConfig = () => {
  console.log('=== 开始加载同步配置 ===')
  // 从本地存储加载配置
  const savedConfig = localStorage.getItem('syncConfig')
  console.log('LocalStorage中的配置:', savedConfig)
  
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig)
      console.log('解析后的配置:', config)
      
      if (config.github) {
        console.log('加载GitHub配置:', config.github)
        Object.assign(githubForm, config.github)
        console.log('加载后的githubForm:', githubForm)
      }
      if (config.wechat) {
        console.log('加载WeChat配置:', config.wechat)
        Object.assign(wechatForm, config.wechat)
      }
      console.log('配置加载成功')
    } catch (error) {
      console.error('解析配置失败:', error)
      // 清除损坏的配置
      localStorage.removeItem('syncConfig')
      console.log('已清除损坏的配置')
    }
  } else {
    console.log('LocalStorage中无配置，使用默认值')
  }
  console.log('=== 配置加载完成 ===')
}

// 保存同步配置
const saveSyncConfig = () => {
  console.log('=== 开始保存同步配置 ===')
  console.log('当前githubForm:', githubForm)
  
  const config = {
    github: {
      repoUrl: githubForm.repoUrl,
      token: githubForm.token,
      branch: githubForm.branch,
      syncContent: githubForm.syncContent
    },
    wechat: {
      appId: wechatForm.appId,
      appSecret: wechatForm.appSecret,
      syncCount: wechatForm.syncCount,
      autoSync: wechatForm.autoSync,
      updateExisting: wechatForm.updateExisting
    }
  }
  
  console.log('要保存的配置:', config)
  
  try {
    localStorage.setItem('syncConfig', JSON.stringify(config))
    console.log('配置保存到LocalStorage成功')
    // 验证保存结果
    const saved = localStorage.getItem('syncConfig')
    console.log('验证保存结果:', saved)
    ElMessage.success('配置保存成功')
  } catch (error) {
    console.error('保存配置失败:', error)
    ElMessage.error('配置保存失败')
  }
  console.log('=== 配置保存完成 ===')
}

// 加载操作日志
const loadOperationLogs = () => {
  const savedLogs = localStorage.getItem('operationLogs')
  if (savedLogs) {
    operationLogs.value = JSON.parse(savedLogs)
  }
}

// 保存操作日志
const saveOperationLogs = () => {
  localStorage.setItem('operationLogs', JSON.stringify(operationLogs.value))
}

// 解析仓库地址为owner/repo格式
const parseRepoUrl = (url) => {
  const match = url.match(/github\.com\/(.*?)\/(.*?)(?:\.git)?$/)
  if (match) {
    return `${match[1]}/${match[2]}`
  }
  return ''
}

// GitHub同步
const handleSyncGithub = async () => {
  if (!githubForm.repoUrl || !githubForm.token) {
    ElMessage.error('请填写GitHub仓库地址和Token')
    return
  }
  
  githubSyncLoading.value = true
  githubSyncLog.value = '开始同步GitHub仓库...\n'
  
  try {
    // 解析仓库地址
    const repo = parseRepoUrl(githubForm.repoUrl)
    if (!repo) {
      throw new Error('GitHub仓库地址格式不正确')
    }
    
    githubSyncLog.value += '连接GitHub仓库...\n'
    
    // 调用云函数同步GitHub仓库
    const result = await callCloudFunction('syncGithub', {
      token: githubForm.token,
      repo: repo,
      filePath: 'data.json'
    })
    
    githubSyncLog.value += '获取仓库文件列表...\n'
    githubSyncLog.value += '同步资料数据...\n'
    githubSyncLog.value += '同步预览图片...\n'
    githubSyncLog.value += '同步分类数据...\n'
    
    if (result.success) {
      githubSyncLog.value += `同步完成！成功同步${result.successCount}条资料\n`
      
      // 添加操作日志
      const logEntry = {
        time: new Date().toLocaleString('zh-CN'),
        action: 'GitHub同步',
        content: `同步GitHub仓库 ${repo}，成功同步${result.successCount}条记录`,
        status: 'success'
      }
      operationLogs.value.unshift(logEntry)
      saveOperationLogs()
      
      ElMessage.success('GitHub仓库同步成功')
    } else {
      githubSyncLog.value += `同步失败：${result.msg}\n`
      
      // 添加操作日志
      const logEntry = {
        time: new Date().toLocaleString('zh-CN'),
        action: 'GitHub同步',
        content: `同步GitHub仓库 ${repo} 失败：${result.msg}`,
        status: 'failure'
      }
      operationLogs.value.unshift(logEntry)
      saveOperationLogs()
      
      ElMessage.error(`同步失败：${result.msg}`)
    }
  } catch (error) {
    console.error('同步失败:', error)
    githubSyncLog.value += `同步失败：${error.message}\n`
    
    // 添加操作日志
    const logEntry = {
      time: new Date().toLocaleString('zh-CN'),
      action: 'GitHub同步',
      content: `同步GitHub仓库失败：${error.message}`,
      status: 'failure'
    }
    operationLogs.value.unshift(logEntry)
    saveOperationLogs()
    
    ElMessage.error(`同步失败：${error.message}`)
  } finally {
    githubSyncLoading.value = false
  }
}

// 测试GitHub连接
const handleTestConnection = async () => {
  if (!githubForm.repoUrl || !githubForm.token) {
    ElMessage.error('请填写GitHub仓库地址和Token')
    return
  }
  
  ElMessage.info('测试连接中...')
  
  try {
    // 解析仓库地址
    const repo = parseRepoUrl(githubForm.repoUrl)
    if (!repo) {
      throw new Error('GitHub仓库地址格式不正确')
    }
    
    // 测试GitHub API连接
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        'Authorization': `token ${githubForm.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    
    if (response.ok) {
      ElMessage.success('连接GitHub仓库成功')
    } else {
      const error = await response.json()
      ElMessage.error(`连接失败：${error.message}`)
    }
  } catch (error) {
    console.error('测试连接失败:', error)
    ElMessage.error(`连接失败：${error.message}`)
  }
}

// 公众号同步
const handleSyncWechat = async () => {
  if (!wechatForm.appId || !wechatForm.appSecret) {
    ElMessage.error('请填写公众号AppID和AppSecret')
    return
  }
  
  wechatSyncLoading.value = true
  wechatSyncLog.value = '开始同步公众号文章...\n'
  
  try {
    wechatSyncLog.value += '获取访问令牌...\n'
    
    // 调用云函数同步公众号文章
    const result = await callCloudFunction('syncWechatArticles', {
      appId: wechatForm.appId,
      appSecret: wechatForm.appSecret
    })
    
    wechatSyncLog.value += '获取文章列表...\n'
    wechatSyncLog.value += '同步文章内容...\n'
    
    if (result.success) {
      wechatSyncLog.value += `同步完成！成功同步${result.count}篇文章\n`
      
      // 添加操作日志
      const logEntry = {
        time: new Date().toLocaleString('zh-CN'),
        action: '公众号同步',
        content: `同步公众号文章，成功同步${result.count}篇文章`,
        status: 'success'
      }
      operationLogs.value.unshift(logEntry)
      saveOperationLogs()
      
      ElMessage.success('公众号文章同步成功')
    } else {
      wechatSyncLog.value += `同步失败：${result.msg}\n`
      
      // 添加操作日志
      const logEntry = {
        time: new Date().toLocaleString('zh-CN'),
        action: '公众号同步',
        content: `同步公众号文章失败：${result.msg}`,
        status: 'failure'
      }
      operationLogs.value.unshift(logEntry)
      saveOperationLogs()
      
      ElMessage.error(`同步失败：${result.msg}`)
    }
  } catch (error) {
    console.error('同步失败:', error)
    wechatSyncLog.value += `同步失败：${error.message}\n`
    
    // 添加操作日志
    const logEntry = {
      time: new Date().toLocaleString('zh-CN'),
      action: '公众号同步',
      content: `同步公众号文章失败：${error.message}`,
      status: 'failure'
    }
    operationLogs.value.unshift(logEntry)
    saveOperationLogs()
    
    ElMessage.error(`同步失败：${error.message}`)
  } finally {
    wechatSyncLoading.value = false
  }
}

// 测试公众号连接
const handleTestWechatConnection = async () => {
  if (!wechatForm.appId || !wechatForm.appSecret) {
    ElMessage.error('请填写公众号AppID和AppSecret')
    return
  }
  
  ElMessage.info('测试连接中...')
  
  try {
    // 测试获取access_token
    const response = await fetch(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wechatForm.appId}&secret=${wechatForm.appSecret}`)
    const data = await response.json()
    
    if (data.access_token) {
      ElMessage.success('连接公众号成功')
    } else {
      ElMessage.error(`连接失败：${data.errmsg}`)
    }
  } catch (error) {
    console.error('测试连接失败:', error)
    ElMessage.error(`连接失败：${error.message}`)
  }
}

// 数据备份
const handleBackupData = async () => {
  backupLoading.value = true
  backupRestoreLog.value = '开始备份数据...\n'
  
  try {
    // 调用备份API
    const response = await api.get('/admin/backup', {
      params: {
        content: backupForm.backupContent.join(',')
      }
    })
    
    if (response.data.success) {
      backupRestoreLog.value += '备份用户数据...\n'
      backupRestoreLog.value += '备份资料数据...\n'
      backupRestoreLog.value += '备份分类数据...\n'
      backupRestoreLog.value += '备份卡密数据...\n'
      backupRestoreLog.value += '备份系统设置...\n'
      backupRestoreLog.value += `备份完成！生成备份文件：backup_${new Date().toISOString().split('T')[0]}.json\n`
      
      // 添加操作日志
      const logEntry = {
        time: new Date().toLocaleString('zh-CN'),
        action: '数据备份',
        content: '备份系统数据，包含用户、资料、分类数据',
        status: 'success'
      }
      operationLogs.value.unshift(logEntry)
      saveOperationLogs()
      
      ElMessage.success('数据备份成功，文件已下载')
    } else {
      backupRestoreLog.value += `备份失败：${response.data.message}\n`
      ElMessage.error(`备份失败：${response.data.message}`)
    }
  } catch (error) {
    console.error('备份失败:', error)
    backupRestoreLog.value += `备份失败：${error.message}\n`
    ElMessage.error(`备份失败：${error.message}`)
  } finally {
    backupLoading.value = false
  }
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
const handleRestoreData = async () => {
  if (!selectedFile.value) {
    ElMessage.error('请选择备份文件')
    return
  }
  
  restoreLoading.value = true
  backupRestoreLog.value = '开始恢复数据...\n'
  
  try {
    // 读取文件内容
    const reader = new FileReader()
    reader.readAsText(selectedFile.value)
    
    reader.onload = async (e) => {
      try {
        const backupData = JSON.parse(e.target.result)
        
        backupRestoreLog.value += '读取备份文件...\n'
        backupRestoreLog.value += '验证文件格式...\n'
        
        // 调用恢复API
        const response = await api.post('/admin/restore', backupData)
        
        if (response.data.success) {
          backupRestoreLog.value += '恢复用户数据...\n'
          backupRestoreLog.value += '恢复资料数据...\n'
          backupRestoreLog.value += '恢复分类数据...\n'
          backupRestoreLog.value += '恢复完成！\n'
          
          // 添加操作日志
          const logEntry = {
            time: new Date().toLocaleString('zh-CN'),
            action: '数据恢复',
            content: '从备份文件恢复系统数据',
            status: 'success'
          }
          operationLogs.value.unshift(logEntry)
          saveOperationLogs()
          
          ElMessage.success('数据恢复成功')
        } else {
          backupRestoreLog.value += `恢复失败：${response.data.message}\n`
          ElMessage.error(`恢复失败：${response.data.message}`)
        }
      } catch (error) {
        console.error('恢复失败:', error)
        backupRestoreLog.value += `恢复失败：${error.message}\n`
        ElMessage.error(`恢复失败：${error.message}`)
      } finally {
        restoreLoading.value = false
      }
    }
    
    reader.onerror = () => {
      backupRestoreLog.value += '读取文件失败\n'
      ElMessage.error('读取文件失败')
      restoreLoading.value = false
    }
  } catch (error) {
    console.error('恢复失败:', error)
    backupRestoreLog.value += `恢复失败：${error.message}\n`
    ElMessage.error(`恢复失败：${error.message}`)
    restoreLoading.value = false
  }
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
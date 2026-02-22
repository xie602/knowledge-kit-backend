<template>
  <div class="settings-container">
    <h2>系统设置</h2>
    
    <el-tabs v-model="activeTab">
      <!-- 基本设置 -->
      <el-tab-pane label="基本设置" name="basic">
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <span>基本设置</span>
              <el-button type="primary" @click="handleSaveBasicSettings">
                <el-icon><Check /></el-icon>
                保存设置
              </el-button>
            </div>
          </template>
          <el-form :model="basicSettings" label-width="150px">
            <el-form-item label="系统名称" required>
              <el-input v-model="basicSettings.systemName" placeholder="请输入系统名称"></el-input>
            </el-form-item>
            <el-form-item label="系统版本">
              <el-input v-model="basicSettings.systemVersion" placeholder="请输入系统版本" disabled></el-input>
            </el-form-item>
            <el-form-item label="系统描述">
              <el-input
                v-model="basicSettings.systemDescription"
                type="textarea"
                :rows="3"
                placeholder="请输入系统描述"
              ></el-input>
            </el-form-item>
            <el-form-item label="API地址" required>
              <el-input v-model="basicSettings.apiUrl" placeholder="请输入API地址"></el-input>
            </el-form-item>
            <el-form-item label="云开发环境ID" required>
              <el-input v-model="basicSettings.cloudEnvId" placeholder="请输入云开发环境ID"></el-input>
            </el-form-item>
            <el-form-item label="是否启用广告">
              <el-switch v-model="basicSettings.enableAds"></el-switch>
            </el-form-item>
            <el-form-item label="是否启用统计">
              <el-switch v-model="basicSettings.enableStats"></el-switch>
            </el-form-item>
            <el-form-item label="是否启用推荐">
              <el-switch v-model="basicSettings.enableRecommend"></el-switch>
            </el-form-item>
            <el-form-item label="是否启用卡密">
              <el-switch v-model="basicSettings.enableCards"></el-switch>
            </el-form-item>
            <el-form-item label="默认分页大小">
              <el-input-number v-model="basicSettings.defaultPageSize" :min="5" :max="100" :step="5"></el-input-number>
            </el-form-item>
            <el-form-item label="数据缓存时间">
              <el-input-number v-model="basicSettings.cacheTime" :min="1" :max="24" :step="1"></el-input-number>
              <span class="unit">小时</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      
      <!-- 权限管理 -->
      <el-tab-pane label="权限管理" name="permission">
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <span>权限管理</span>
              <el-button type="primary" @click="handleSavePermissions">
                <el-icon><Check /></el-icon>
                保存权限
              </el-button>
            </div>
          </template>
          <div class="permission-content">
            <el-table :data="permissionRoles" style="width: 100%" border>
              <el-table-column prop="id" label="角色ID" width="100"></el-table-column>
              <el-table-column prop="name" label="角色名称" min-width="150"></el-table-column>
              <el-table-column prop="description" label="角色描述" min-width="200"></el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-switch v-model="row.status" @change="handleRoleStatusChange(row)"></el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="{ row }">
                  <el-button size="small" type="primary" @click="handleEditRole(row)" style="margin-right: 5px">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-button>
                  <el-button size="small" type="danger" @click="handleDeleteRole(row)">
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="permission-actions" style="margin-top: 20px">
              <el-button type="success" @click="handleAddRole">
                <el-icon><Plus /></el-icon>
                添加角色
              </el-button>
            </div>
            
            <!-- 权限详情 -->
            <el-card class="permission-detail-card" style="margin-top: 30px">
              <template #header>
                <span>权限详情 - {{ selectedRole ? selectedRole.name : '请选择角色' }}</span>
              </template>
              <div v-if="selectedRole" class="permission-detail">
                <el-checkbox-group v-model="selectedRolePermissions">
                  <el-row :gutter="20">
                    <el-col :span="8" v-for="(permission, index) in allPermissions" :key="index">
                      <el-checkbox :label="permission.value">{{ permission.label }}</el-checkbox>
                    </el-col>
                  </el-row>
                </el-checkbox-group>
              </div>
              <div v-else class="empty-permission">
                <el-empty description="请选择一个角色查看权限详情"></el-empty>
              </div>
            </el-card>
          </div>
        </el-card>
      </el-tab-pane>
      
      <!-- 日志管理 -->
      <el-tab-pane label="日志管理" name="logs">
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <span>操作日志</span>
              <div class="header-actions">
                <el-date-picker
                  v-model="logDateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="handleLogDateRangeChange"
                ></el-date-picker>
                <el-button type="primary" @click="handleExportLogs">
                  <el-icon><Download /></el-icon>
                  导出日志
                </el-button>
                <el-button type="danger" @click="handleClearLogs">
                  <el-icon><Delete /></el-icon>
                  清空日志
                </el-button>
              </div>
            </div>
          </template>
          <div class="logs-content">
            <el-table :data="operationLogs" style="width: 100%" border>
              <el-table-column prop="time" label="操作时间" width="180"></el-table-column>
              <el-table-column prop="user" label="操作人" width="120"></el-table-column>
              <el-table-column prop="action" label="操作类型" width="120"></el-table-column>
              <el-table-column prop="content" label="操作内容" min-width="400"></el-table-column>
              <el-table-column prop="ip" label="操作IP" width="150"></el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'success' ? 'success' : 'danger'">
                    {{ row.status === 'success' ? '成功' : '失败' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination
                layout="total, prev, pager, next, jumper"
                :total="operationLogs.length"
                :page-size="10"
                :current-page="1"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
      
      <!-- API管理 -->
      <el-tab-pane label="API管理" name="api">
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <span>API管理</span>
            </div>
          </template>
          <div class="api-content">
            <el-table :data="apiList" style="width: 100%" border>
              <el-table-column prop="path" label="API路径" min-width="200"></el-table-column>
              <el-table-column prop="method" label="请求方法" width="120">
                <template #default="{ row }">
                  <el-tag :type="getMethodType(row.method)">
                    {{ row.method }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="description" label="API描述" min-width="200"></el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-switch v-model="row.status" @change="handleApiStatusChange(row)"></el-switch>
                </template>
              </el-table-column>
              <el-table-column prop="access" label="访问权限" width="120">
                <template #default="{ row }">
                  <el-tag :type="row.access === 'public' ? 'info' : 'warning'">
                    {{ row.access === 'public' ? '公开' : '需认证' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template #default="{ row }">
                  <el-button size="small" type="primary" @click="handleTestApi(row)">
                    <el-icon><Check /></el-icon>
                    测试
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- API测试 -->
            <el-card class="api-test-card" style="margin-top: 30px">
              <template #header>
                <span>API测试工具</span>
              </template>
              <div class="api-test-content">
                <el-form :model="apiTestForm" label-width="100px">
                  <el-form-item label="API路径">
                    <el-input v-model="apiTestForm.path" placeholder="请输入API路径"></el-input>
                  </el-form-item>
                  <el-form-item label="请求方法">
                    <el-select v-model="apiTestForm.method" placeholder="请选择请求方法">
                      <el-option label="GET" value="GET"></el-option>
                      <el-option label="POST" value="POST"></el-option>
                      <el-option label="PUT" value="PUT"></el-option>
                      <el-option label="DELETE" value="DELETE"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="请求参数">
                    <el-input
                      v-model="apiTestForm.params"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入JSON格式的请求参数"
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="handleRunApiTest">
                      <el-icon><Play /></el-icon>
                      运行测试
                    </el-button>
                  </el-form-item>
                </el-form>
                <div class="api-test-result" v-if="apiTestResult">
                  <h4>测试结果</h4>
                  <el-divider></el-divider>
                  <pre>{{ apiTestResult }}</pre>
                </div>
              </div>
            </el-card>
          </div>
        </el-card>
      </el-tab-pane>
      
      <!-- 安全设置 -->
      <el-tab-pane label="安全设置" name="security">
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <span>安全设置</span>
              <el-button type="primary" @click="handleSaveSecuritySettings">
                <el-icon><Check /></el-icon>
                保存设置
              </el-button>
            </div>
          </template>
          <el-form :model="securitySettings" label-width="150px">
            <el-form-item label="登录失败限制">
              <el-switch v-model="securitySettings.enableLoginLimit"></el-switch>
              <div v-if="securitySettings.enableLoginLimit" class="security-details">
                <el-form-item label="最大失败次数" style="margin-left: 30px">
                  <el-input-number v-model="securitySettings.maxLoginFailures" :min="1" :max="10" :step="1"></el-input-number>
                </el-form-item>
                <el-form-item label="锁定时间" style="margin-left: 30px">
                  <el-input-number v-model="securitySettings.lockoutTime" :min="1" :max="24" :step="1"></el-input-number>
                  <span class="unit">小时</span>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="IP白名单">
              <el-switch v-model="securitySettings.enableIpWhitelist"></el-switch>
              <div v-if="securitySettings.enableIpWhitelist" class="security-details">
                <el-form-item label="白名单IP" style="margin-left: 30px">
                  <el-input
                    v-model="securitySettings.ipWhitelist"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入IP地址，每行一个"
                  ></el-input>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="API请求限制">
              <el-switch v-model="securitySettings.enableApiLimit"></el-switch>
              <div v-if="securitySettings.enableApiLimit" class="security-details">
                <el-form-item label="每分钟请求数" style="margin-left: 30px">
                  <el-input-number v-model="securitySettings.apiLimitPerMinute" :min="10" :max="1000" :step="10"></el-input-number>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="HTTPS强制">
              <el-switch v-model="securitySettings.forceHttps"></el-switch>
            </el-form-item>
            <el-form-item label="密码强度要求">
              <el-select v-model="securitySettings.passwordStrength" placeholder="请选择密码强度要求">
                <el-option label="弱" value="weak"></el-option>
                <el-option label="中" value="medium"></el-option>
                <el-option label="强" value="strong"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="会话超时时间">
              <el-input-number v-model="securitySettings.sessionTimeout" :min="1" :max="24" :step="1"></el-input-number>
              <span class="unit">小时</span>
            </el-form-item>
            <el-form-item label="数据加密">
              <el-switch v-model="securitySettings.enableEncryption"></el-switch>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      
      <!-- 客服设置 -->
      <el-tab-pane label="客服设置" name="customer-service">
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <span>客服设置</span>
              <el-button type="primary" @click="handleSaveCustomerServiceSettings">
                <el-icon><Check /></el-icon>
                保存设置
              </el-button>
            </div>
          </template>
          <el-form :model="customerServiceSettings" label-width="150px">
            <el-form-item label="客服微信号" required>
              <el-input v-model="customerServiceSettings.wechatId" placeholder="请输入客服微信号"></el-input>
            </el-form-item>
            <el-form-item label="微信二维码" required>
              <el-upload
                class="upload-demo"
                action="#"
                :auto-upload="false"
                :on-change="handleQrCodeUpload"
                :show-file-list="false"
                accept="image/*"
              >
                <template #trigger>
                  <el-button type="primary">
                    <el-icon><Upload /></el-icon>
                    上传二维码
                  </el-button>
                </template>
                <template #tip>
                  <div class="el-upload__tip">
                    请上传微信二维码图片
                  </div>
                </template>
              </el-upload>
              <div v-if="customerServiceSettings.wechatQrCode" class="qr-code-preview">
                <img :src="customerServiceSettings.wechatQrCode" alt="微信二维码" class="qr-code-image">
                <el-button type="danger" size="small" @click="clearQrCode">
                  <el-icon><Delete /></el-icon>
                  清除
                </el-button>
              </div>
            </el-form-item>
            <el-form-item label="客服提示语">
              <el-input
                v-model="customerServiceSettings.tipText"
                type="textarea"
                :rows="3"
                placeholder="请输入客服提示语"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 添加/编辑角色对话框 -->
    <el-dialog
      v-model="roleDialogVisible"
      :title="isEditRole ? '编辑角色' : '添加角色'"
      width="500px"
    >
      <el-form :model="roleForm" label-width="100px">
        <el-form-item label="角色名称" required>
          <el-input v-model="roleForm.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="roleForm.status"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveRole">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Plus, Edit, Delete, Check, Download, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 当前激活的标签页
const activeTab = ref('basic')

// 基本设置
const basicSettings = reactive({
  systemName: '知识锦囊后台管理系统',
  systemVersion: '1.0.0',
  systemDescription: '知识锦囊小程序的后台管理系统，用于管理资料、用户、广告等内容',
  apiUrl: 'http://localhost:3002/api',
  cloudEnvId: 'knowledge-kit-xxxxxx',
  enableAds: true,
  enableStats: true,
  enableRecommend: true,
  enableCards: true,
  defaultPageSize: 10,
  cacheTime: 24
})

// 安全设置
const securitySettings = reactive({
  enableLoginLimit: true,
  maxLoginFailures: 5,
  lockoutTime: 1,
  enableIpWhitelist: false,
  ipWhitelist: '',
  enableApiLimit: true,
  apiLimitPerMinute: 100,
  forceHttps: true,
  passwordStrength: 'medium',
  sessionTimeout: 2,
  enableEncryption: true
})

// 角色管理
const permissionRoles = ref([
  {
    id: 1,
    name: '超级管理员',
    description: '拥有系统所有权限',
    status: true
  },
  {
    id: 2,
    name: '内容管理员',
    description: '管理资料和分类',
    status: true
  },
  {
    id: 3,
    name: '用户管理员',
    description: '管理用户和卡密',
    status: true
  },
  {
    id: 4,
    name: '广告管理员',
    description: '管理广告和数据分析',
    status: true
  }
])

// 所有权限
const allPermissions = [
  { label: '系统设置', value: 'system:settings' },
  { label: '资料管理', value: 'documents:manage' },
  { label: '分类管理', value: 'categories:manage' },
  { label: '用户管理', value: 'users:manage' },
  { label: '卡密管理', value: 'cards:manage' },
  { label: '广告管理', value: 'ads:manage' },
  { label: '轮播图管理', value: 'carousel:manage' },
  { label: '内容同步', value: 'sync:manage' },
  { label: '推荐管理', value: 'recommend:manage' },
  { label: '权限管理', value: 'permission:manage' },
  { label: '日志管理', value: 'logs:manage' },
  { label: 'API管理', value: 'api:manage' },
  { label: '安全设置', value: 'security:settings' }
]

// 选中的角色
const selectedRole = ref(null)
const selectedRolePermissions = ref([])

// 操作日志
const operationLogs = ref([
  {
    time: '2026-02-21 15:30:00',
    user: '管理员',
    action: '登录',
    content: '管理员登录系统',
    ip: '192.168.1.100',
    status: 'success'
  },
  {
    time: '2026-02-21 14:20:00',
    user: '管理员',
    action: '资料上传',
    content: '上传了资料《初中物理力学知识点总结》',
    ip: '192.168.1.100',
    status: 'success'
  },
  {
    time: '2026-02-21 13:10:00',
    user: '管理员',
    action: '用户管理',
    content: '设置用户ID为123的用户为永久用户',
    ip: '192.168.1.100',
    status: 'success'
  },
  {
    time: '2026-02-21 12:00:00',
    user: '管理员',
    action: '广告配置',
    content: '更新了开屏广告配置',
    ip: '192.168.1.100',
    status: 'success'
  },
  {
    time: '2026-02-21 11:30:00',
    user: '测试用户',
    action: '登录',
    content: '测试用户登录系统',
    ip: '192.168.1.101',
    status: 'fail'
  }
])

// 日志日期范围
const logDateRange = ref([])

// API列表
const apiList = ref([
  {
    path: '/api/documents',
    method: 'GET',
    description: '获取资料列表',
    status: true,
    access: 'public'
  },
  {
    path: '/api/documents',
    method: 'POST',
    description: '上传资料',
    status: true,
    access: 'private'
  },
  {
    path: '/api/documents/:id',
    method: 'PUT',
    description: '更新资料',
    status: true,
    access: 'private'
  },
  {
    path: '/api/documents/:id',
    method: 'DELETE',
    description: '删除资料',
    status: true,
    access: 'private'
  },
  {
    path: '/api/users',
    method: 'GET',
    description: '获取用户列表',
    status: true,
    access: 'private'
  },
  {
    path: '/api/cards/verify',
    method: 'POST',
    description: '验证卡密',
    status: true,
    access: 'public'
  },
  {
    path: '/api/ads/stats',
    method: 'GET',
    description: '获取广告统计数据',
    status: true,
    access: 'private'
  }
])

// API测试
const apiTestForm = reactive({
  path: '/api/documents',
  method: 'GET',
  params: '{}'
})

const apiTestResult = ref('')

// 角色对话框
const roleDialogVisible = ref(false)
const isEditRole = ref(false)
const roleForm = reactive({
  name: '',
  description: '',
  status: true
})

// 客服设置
const customerServiceSettings = reactive({
  wechatId: '',
  wechatQrCode: '',
  tipText: '联系客服免费获取永久卡密'
})

// 保存基本设置
const handleSaveBasicSettings = () => {
  console.log('保存基本设置:', basicSettings)
  ElMessage.success('基本设置保存成功')
}

// 保存安全设置
const handleSaveSecuritySettings = () => {
  console.log('保存安全设置:', securitySettings)
  ElMessage.success('安全设置保存成功')
}

// 保存权限
const handleSavePermissions = () => {
  console.log('保存权限:', selectedRolePermissions.value)
  ElMessage.success('权限保存成功')
}

// 添加角色
const handleAddRole = () => {
  isEditRole.value = false
  Object.assign(roleForm, {
    name: '',
    description: '',
    status: true
  })
  roleDialogVisible.value = true
}

// 编辑角色
const handleEditRole = (row) => {
  isEditRole.value = true
  Object.assign(roleForm, {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status
  })
  selectedRole.value = row
  // 模拟角色权限
  selectedRolePermissions.value = allPermissions.slice(0, 3).map(p => p.value)
  roleDialogVisible.value = true
}

// 保存角色
const handleSaveRole = () => {
  if (isEditRole.value) {
    // 编辑现有角色
    const index = permissionRoles.value.findIndex(item => item.id === roleForm.id)
    if (index !== -1) {
      permissionRoles.value[index] = { ...roleForm }
    }
    ElMessage.success('角色编辑成功')
  } else {
    // 添加新角色
    const newRole = {
      id: permissionRoles.value.length + 1,
      ...roleForm
    }
    permissionRoles.value.push(newRole)
    ElMessage.success('角色添加成功')
  }
  roleDialogVisible.value = false
}

// 删除角色
const handleDeleteRole = (row) => {
  ElMessageBox.confirm(
    `确定要删除角色「${row.name}」吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = permissionRoles.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      permissionRoles.value.splice(index, 1)
    }
    ElMessage.success('角色删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 角色状态变更
const handleRoleStatusChange = (row) => {
  console.log('角色状态变更:', row.name, row.status)
  ElMessage.info(`${row.name} 状态已${row.status ? '启用' : '禁用'}`)
}

// 日志日期范围变更
const handleLogDateRangeChange = (val) => {
  console.log('日志日期范围变更:', val)
  ElMessage.info('日志日期范围已更新')
}

// 导出日志
const handleExportLogs = () => {
  ElMessage.success('日志导出成功，文件已下载')
}

// 清空日志
const handleClearLogs = () => {
  ElMessageBox.confirm(
    '确定要清空所有操作日志吗？此操作不可恢复。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(() => {
    operationLogs.value = []
    ElMessage.success('日志清空成功')
  }).catch(() => {
    ElMessage.info('已取消清空')
  })
}

// API状态变更
const handleApiStatusChange = (row) => {
  console.log('API状态变更:', row.path, row.status)
  ElMessage.info(`${row.path} 状态已${row.status ? '启用' : '禁用'}`)
}

// 获取方法类型
const getMethodType = (method) => {
  const typeMap = {
    'GET': 'success',
    'POST': 'primary',
    'PUT': 'warning',
    'DELETE': 'danger'
  }
  return typeMap[method] || 'info'
}

// 运行API测试
const handleRunApiTest = () => {
  console.log('运行API测试:', apiTestForm)
  // 模拟API测试结果
  apiTestResult.value = JSON.stringify({
    status: 200,
    message: '测试成功',
    data: {
      total: 100,
      list: [
        { id: 1, title: '测试资料1' },
        { id: 2, title: '测试资料2' }
      ]
    },
    responseTime: '123ms'
  }, null, 2)
  ElMessage.success('API测试完成')
}

// 测试API
const handleTestApi = (row) => {
  Object.assign(apiTestForm, {
    path: row.path,
    method: row.method,
    params: '{}'
  })
  handleRunApiTest()
}

// 分页处理
const handleCurrentChange = (current) => {
  console.log('当前页码:', current)
}

// 保存客服设置
const handleSaveCustomerServiceSettings = () => {
  console.log('保存客服设置:', customerServiceSettings)
  ElMessage.success('客服设置保存成功')
}

// 处理二维码上传
const handleQrCodeUpload = (file) => {
  // 模拟上传成功，实际项目中需要调用上传接口
  const reader = new FileReader()
  reader.onload = (e) => {
    customerServiceSettings.wechatQrCode = e.target.result
    ElMessage.success('二维码上传成功')
  }
  reader.readAsDataURL(file.raw)
}

// 清除二维码
const clearQrCode = () => {
  customerServiceSettings.wechatQrCode = ''
  ElMessage.success('二维码已清除')
}
</script>

<style scoped>
.settings-container {
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

.security-details {
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

.permission-detail-card,
.api-test-card {
  border-radius: 4px;
}

.empty-permission {
  padding: 40px 0;
  text-align: center;
}

.api-test-result {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.api-test-result pre {
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
  
  .security-details {
    padding-left: 20px;
  }
}

/* 二维码预览样式 */
.qr-code-preview {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.qr-code-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
</style>
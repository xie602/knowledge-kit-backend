<template>
  <div class="categories-container">
    <h2>分类管理</h2>
    
    <!-- 标签页 -->
    <el-tabs v-model="activeTab" type="border-card" class="categories-tabs">
      <!-- 年级管理标签 -->
      <el-tab-pane label="年级管理" name="grades">
        <el-card class="grades-card">
          <template #header>
            <div class="card-header">
              <span>年级列表</span>
              <div class="header-actions">
                <el-button type="primary" @click="handleAddGrade">
                  <el-icon><Plus /></el-icon>
                  添加年级
                </el-button>
                <el-button @click="loadGrades">
                  <el-icon><Refresh /></el-icon>
                  刷新
                </el-button>
              </div>
            </div>
          </template>
          
          <div class="grades-content">
            <div class="grades-main">
              <!-- 左侧年级表格 -->
              <div class="grades-table-container">
                <el-table :data="grades" style="width: 100%" border>
                  <el-table-column prop="id" label="ID" width="80"></el-table-column>
                  <el-table-column prop="name" label="年级名称" min-width="120"></el-table-column>
                  <el-table-column prop="order" label="显示顺序" width="100">
                    <template #default="{ row }">
                      <el-input-number v-model="row.order" :min="0" :max="9999" @change="handleGradeOrderChange(row)"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column prop="status" label="状态" width="100">
                    <template #default="{ row }">
                      <el-switch v-model="row.status" @change="handleGradeStatusChange(row)"></el-switch>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createdAt" label="创建时间" width="180"></el-table-column>
                  <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                      <el-button size="small" @click="handleEditGrade(row)">编辑</el-button>
                      <el-button size="small" type="danger" @click="handleDeleteGrade(row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            
            <!-- 右侧真机模拟 -->
            <div class="category-preview">
              <PhoneSimulator>
                <CategorySimulator :categoryList="grades" />
              </PhoneSimulator>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
      
      <!-- 分类树结构标签 -->
      <el-tab-pane label="分类树结构" name="tree">
        <el-card class="categories-card">
          <template #header>
            <div class="card-header">
              <span>分类树结构</span>
              <div class="header-actions">
                <el-button type="primary" @click="handleAddCategory">
                  <el-icon><Plus /></el-icon>
                  添加分类
                </el-button>
                <el-button @click="handleRefresh">
                  <el-icon><Refresh /></el-icon>
                  刷新
                </el-button>
              </div>
            </div>
          </template>
          <div class="categories-content">
            <div class="categories-main">
              <!-- 左侧分类树 -->
              <div class="category-tree">
                <el-tree
                  ref="categoryTree"
                  :data="categoryTreeData"
                  :props="treeProps"
                  node-key="id"
                  default-expand-all
                  @node-click="handleNodeClick"
                  @node-contextmenu="handleNodeContextMenu"
                >
                  <template #default="{ node, data }">
                    <div class="tree-node">
                      <span>{{ node.label }}</span>
                      <span class="node-count" v-if="data.count > 0">({{ data.count }})</span>
                    </div>
                  </template>
                </el-tree>
              </div>
              
              <!-- 中间分类编辑 -->
              <div class="category-edit">
                <div v-if="!selectedCategory" class="empty-state">
                <el-icon class="empty-icon"><Grid /></el-icon>
                <p>请选择一个分类进行编辑</p>
              </div>
                <div v-else class="edit-form">
                  <el-form
                    ref="categoryForm"
                    :model="categoryForm"
                    :rules="categoryRules"
                    label-width="120px"
                    class="form"
                  >
                    <el-form-item label="分类名称" prop="name">
                      <el-input v-model="categoryForm.name" placeholder="请输入分类名称"></el-input>
                    </el-form-item>
                    <el-form-item label="父分类">
                      <el-select v-model="categoryForm.parentId" placeholder="请选择父分类">
                        <el-option label="顶级分类" value="0"></el-option>
                        <el-option
                          v-for="item in parentCategoryOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="分类类型">
                      <el-select v-model="categoryForm.type" placeholder="请选择分类类型">
                        <el-option label="年级" value="grade"></el-option>
                        <el-option label="学期" value="semester"></el-option>
                        <el-option label="科目" value="subject"></el-option>
                        <el-option label="教材版本" value="version"></el-option>
                        <el-option label="资料类型" value="type"></el-option>
                        <el-option label="自定义" value="custom"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="显示顺序" prop="sort">
                      <el-input-number v-model="categoryForm.sort" :min="0" :max="9999"></el-input-number>
                    </el-form-item>
                    <el-form-item label="状态">
                      <el-switch v-model="categoryForm.status"></el-switch>
                    </el-form-item>
                    <el-form-item label="分类描述">
                      <el-input
                        v-model="categoryForm.description"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入分类描述"
                      ></el-input>
                    </el-form-item>
                    <el-form-item>
                      <div class="form-actions">
                        <el-button type="primary" @click="handleSaveCategory">保存</el-button>
                        <el-button @click="handleCancelEdit">取消</el-button>
                        <el-button type="danger" @click="handleDeleteCategory" v-if="selectedCategory.id !== '0'">删除</el-button>
                      </div>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </div>
            
            <!-- 右侧真机模拟 -->
            <div class="category-preview">
              <PhoneSimulator>
                <CategorySimulator :categoryList="activeTab === 'grades' ? grades : formatCategoriesForPreview()" />
              </PhoneSimulator>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    
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
    
    <!-- 年级编辑弹窗 -->
    <el-dialog
      v-model="gradeDialogVisible"
      :title="editingGrade ? '编辑年级' : '添加年级'"
      width="500px"
    >
      <el-form
        ref="gradeFormRef"
        :model="gradeForm"
        :rules="gradeRules"
        label-width="100px"
      >
        <el-form-item label="年级名称" prop="name">
          <el-input v-model="gradeForm.name" placeholder="请输入年级名称"></el-input>
        </el-form-item>
        <el-form-item label="显示顺序" prop="order">
          <el-input-number v-model="gradeForm.order" :min="0" :max="9999"></el-input-number>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="gradeForm.status"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="gradeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveGrade">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Refresh, Delete, Edit, ArrowUp, ArrowDown, Grid } from '@element-plus/icons-vue'
import PhoneSimulator from '../../components/PhoneSimulator.vue'
import CategorySimulator from '../../components/simulators/CategorySimulator.vue'

// 激活的标签页
const activeTab = ref('grades')

// 分类树数据
const categoryTreeData = ref([
  {
    id: '1',
    name: '年级分类',
    type: 'grade',
    count: 4,
    children: [
      { id: '1-1', name: '幼小衔接', type: 'grade', count: 100 },
      { id: '1-2', name: '小学', type: 'grade', count: 500 },
      { id: '1-3', name: '初中', type: 'grade', count: 300 },
      { id: '1-4', name: '高中', type: 'grade', count: 200 }
    ]
  },
  {
    id: '2',
    name: '学期分类',
    type: 'semester',
    count: 2,
    children: [
      { id: '2-1', name: '上学期', type: 'semester', count: 500 },
      { id: '2-2', name: '下学期', type: 'semester', count: 600 }
    ]
  },
  {
    id: '3',
    name: '科目分类',
    type: 'subject',
    count: 10,
    children: [
      { id: '3-1', name: '语文', type: 'subject', count: 300 },
      { id: '3-2', name: '数学', type: 'subject', count: 350 },
      { id: '3-3', name: '英语', type: 'subject', count: 250 },
      { id: '3-4', name: '物理', type: 'subject', count: 150 },
      { id: '3-5', name: '化学', type: 'subject', count: 120 },
      { id: '3-6', name: '生物', type: 'subject', count: 100 },
      { id: '3-7', name: '历史', type: 'subject', count: 90 },
      { id: '3-8', name: '地理', type: 'subject', count: 80 },
      { id: '3-9', name: '道德与法治', type: 'subject', count: 70 },
      { id: '3-10', name: '思想政治', type: 'subject', count: 60 }
    ]
  },
  {
    id: '4',
    name: '教材版本',
    type: 'version',
    count: 5,
    children: [
      { id: '4-1', name: '人教版', type: 'version', count: 400 },
      { id: '4-2', name: '北师大版', type: 'version', count: 200 },
      { id: '4-3', name: '苏教版', type: 'version', count: 150 },
      { id: '4-4', name: '统编版', type: 'version', count: 300 },
      { id: '4-5', name: '其他版本', type: 'version', count: 100 }
    ]
  },
  {
    id: '5',
    name: '资料类型',
    type: 'type',
    count: 5,
    children: [
      { id: '5-1', name: '试卷', type: 'type', count: 200 },
      { id: '5-2', name: '练习', type: 'type', count: 180 },
      { id: '5-3', name: '知识点总结', type: 'type', count: 150 },
      { id: '5-4', name: '寒假', type: 'type', count: 80 },
      { id: '5-5', name: '暑假', type: 'type', count: 70 }
    ]
  },
  {
    id: '6',
    name: '自定义分类',
    type: 'custom',
    count: 2,
    children: [
      { id: '6-1', name: '专项练习', type: 'custom', count: 50 },
      { id: '6-2', name: '升学资料', type: 'custom', count: 40 }
    ]
  }
])

// 年级数据
const grades = ref([])

// 树结构配置
const treeProps = {
  children: 'children',
  label: 'name'
}

// 选中的分类
const selectedCategory = ref(null)
const categoryForm = reactive({
  id: '',
  name: '',
  parentId: '0',
  type: 'grade',
  sort: 0,
  status: true,
  description: ''
})

// 分类表单验证规则
const categoryRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '分类名称长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入显示顺序', trigger: 'blur' }
  ]
}

// 年级编辑相关
const gradeDialogVisible = ref(false)
const editingGrade = ref(null)
const gradeFormRef = ref(null)
const gradeForm = reactive({
  id: '',
  name: '',
  order: 0,
  status: true
})

// 年级表单验证规则
const gradeRules = {
  name: [
    { required: true, message: '请输入年级名称', trigger: 'blur' },
    { min: 1, max: 50, message: '年级名称长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  order: [
    { type: 'number', min: 0, message: '显示顺序必须大于等于 0', trigger: 'blur' }
  ]
}

// 父分类选项
const parentCategoryOptions = computed(() => {
  const options = []
  // 递归遍历分类树，生成父分类选项
  const traverse = (data, level = 0) => {
    data.forEach(item => {
      options.push({
        id: item.id,
        name: ' '.repeat(level * 2) + item.name
      })
      if (item.children) {
        traverse(item.children, level + 1)
      }
    })
  }
  traverse(categoryTreeData.value)
  return options
})

// 操作日志
const operationLogs = ref([
  { time: '2026-02-21 15:30:00', action: '添加', content: '添加了分类 "幼小衔接"', user: '管理员' },
  { time: '2026-02-21 14:20:00', action: '编辑', content: '修改了分类 "小学" 的显示顺序', user: '管理员' },
  { time: '2026-02-21 13:10:00', action: '删除', content: '删除了分类 "旧人教版"', user: '管理员' },
  { time: '2026-02-21 12:00:00', action: '添加', content: '添加了分类 "统编版"', user: '管理员' }
])

// 初始化
onMounted(() => {
  loadCategoryData()
  loadGrades()
})

// 加载分类数据
const loadCategoryData = () => {
  // 这里可以从API获取分类数据
  console.log('Loading category data...')
}

// 加载年级数据
const loadGrades = async () => {
  try {
    const response = await fetch('/api/categories/grades')
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        grades.value = data.data
      }
    }
  } catch (error) {
    console.error('加载年级数据失败:', error)
  }
}

// 处理节点点击
const handleNodeClick = (data) => {
  selectedCategory.value = data
  // 填充表单
  categoryForm.id = data.id
  categoryForm.name = data.name
  categoryForm.parentId = data.parentId || '0'
  categoryForm.type = data.type
  categoryForm.sort = data.sort || 0
  categoryForm.status = data.status !== false
  categoryForm.description = data.description || ''
}

// 处理节点右键菜单
const handleNodeContextMenu = (event, node, data) => {
  event.preventDefault()
  // 这里可以实现右键菜单
  console.log('Context menu for node:', data)
}

// 添加分类
const handleAddCategory = () => {
  selectedCategory.value = null
  // 重置表单
  Object.assign(categoryForm, {
    id: '',
    name: '',
    parentId: '0',
    type: 'grade',
    sort: 0,
    status: true,
    description: ''
  })
}

// 保存分类
const handleSaveCategory = () => {
  // 这里可以实现保存分类的逻辑
  console.log('Saving category:', categoryForm)
  // 模拟保存成功
  if (categoryForm.id) {
    // 编辑分类
    operationLogs.value.unshift({
      time: new Date().toLocaleString('zh-CN'),
      action: '编辑',
      content: `修改了分类 "${categoryForm.name}"`,
      user: '管理员'
    })
  } else {
    // 添加分类
    operationLogs.value.unshift({
      time: new Date().toLocaleString('zh-CN'),
      action: '添加',
      content: `添加了分类 "${categoryForm.name}"`,
      user: '管理员'
    })
  }
}

// 取消编辑
const handleCancelEdit = () => {
  if (selectedCategory.value) {
    // 重新填充表单
    handleNodeClick(selectedCategory.value)
  } else {
    // 重置表单
    Object.assign(categoryForm, {
      id: '',
      name: '',
      parentId: '0',
      type: 'grade',
      sort: 0,
      status: true,
      description: ''
    })
  }
}

// 删除分类
const handleDeleteCategory = () => {
  if (!selectedCategory.value) return
  
  // 这里可以实现删除分类的逻辑
  console.log('Deleting category:', selectedCategory.value)
  
  // 模拟删除成功
  operationLogs.value.unshift({
    time: new Date().toLocaleString('zh-CN'),
    action: '删除',
    content: `删除了分类 "${selectedCategory.value.name}"`,
    user: '管理员'
  })
  
  // 清空选择
  selectedCategory.value = null
  Object.assign(categoryForm, {
    id: '',
    name: '',
    parentId: '0',
    type: 'grade',
    sort: 0,
    status: true,
    description: ''
  })
}

// 刷新
const handleRefresh = () => {
  loadCategoryData()
  if (activeTab.value === 'grades') {
    loadGrades()
  }
}

// 处理添加年级
const handleAddGrade = () => {
  editingGrade.value = null
  Object.assign(gradeForm, {
    id: '',
    name: '',
    order: 0,
    status: true
  })
  gradeDialogVisible.value = true
}

// 处理编辑年级
const handleEditGrade = (grade) => {
  editingGrade.value = grade
  Object.assign(gradeForm, {
    id: grade.id,
    name: grade.name,
    order: grade.order,
    status: grade.status
  })
  gradeDialogVisible.value = true
}

// 处理保存年级
const handleSaveGrade = () => {
  console.log('开始保存年级...')
  console.log('gradeFormRef:', gradeFormRef.value)
  console.log('gradeForm:', gradeForm)
  
  // 验证表单
  if (gradeFormRef.value) {
    console.log('执行表单验证...')
    gradeFormRef.value.validate((valid, fields) => {
      console.log('表单验证结果:', valid, fields)
      if (!valid) {
        console.error('表单验证失败:', fields)
        return
      }
      
      // 表单验证通过，继续保存
      const saveGrade = async () => {
        try {
          console.log('开始发送保存请求...')
          let response
          let url
          let method
          
          if (gradeForm.id) {
            // 编辑年级
            url = `/api/categories/grades/${gradeForm.id}`
            method = 'PUT'
          } else {
            // 添加年级
            url = '/api/categories/grades'
            method = 'POST'
          }
          
          console.log('请求URL:', url)
          console.log('请求方法:', method)
          console.log('请求数据:', gradeForm)
          
          response = await fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(gradeForm)
          })
          
          console.log('响应状态:', response.status, response.statusText)
          
          if (response.ok) {
            const data = await response.json()
            console.log('响应数据:', data)
            if (data.success) {
              // 重新加载年级数据
              console.log('保存成功，重新加载年级数据...')
              await loadGrades()
              gradeDialogVisible.value = false
              
              // 添加操作日志
              operationLogs.value.unshift({
                time: new Date().toLocaleString('zh-CN'),
                action: gradeForm.id ? '编辑' : '添加',
                content: `${gradeForm.id ? '修改了' : '添加了'}年级 "${gradeForm.name}"`,
                user: '管理员'
              })
              console.log('保存完成')
            } else {
              // 显示错误消息
              console.error('保存失败:', data.message)
              alert(data.message || '保存失败')
            }
          } else {
            // 显示错误消息
            try {
              const errorData = await response.json()
              console.error('保存失败:', errorData)
              alert(errorData.message || '保存失败')
            } catch (e) {
              console.error('解析错误响应失败:', e)
              alert('保存失败，请稍后重试')
            }
          }
        } catch (error) {
          console.error('保存年级失败:', error)
          alert('保存失败，请稍后重试')
        }
      }
      
      saveGrade()
    })
  } else {
    console.error('gradeFormRef is null')
    alert('保存失败，请稍后重试')
  }
}

// 处理删除年级
const handleDeleteGrade = async (grade) => {
  try {
    const response = await fetch(`/api/categories/grades/${grade.id}`, {
      method: 'DELETE'
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        // 重新加载年级数据
        await loadGrades()
        
        // 添加操作日志
        operationLogs.value.unshift({
          time: new Date().toLocaleString('zh-CN'),
          action: '删除',
          content: `删除了年级 "${grade.name}"`,
          user: '管理员'
        })
      }
    }
  } catch (error) {
    console.error('删除年级失败:', error)
  }
}

// 处理年级顺序变化
const handleGradeOrderChange = async (grade) => {
  try {
    const response = await fetch(`/api/categories/grades/${grade.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(grade)
    })
  } catch (error) {
    console.error('更新年级顺序失败:', error)
  }
}

// 处理年级状态变化
const handleGradeStatusChange = async (grade) => {
  try {
    const response = await fetch(`/api/categories/grades/${grade.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(grade)
    })
  } catch (error) {
    console.error('更新年级状态失败:', error)
  }
}

// 格式化分类数据用于预览
const formatCategoriesForPreview = () => {
  const categories = []
  
  // 递归遍历分类树，提取顶级分类
  const traverse = (data) => {
    data.forEach(item => {
      // 只提取顶级分类用于预览
      if (!item.parentId || item.parentId === '0') {
        categories.push({
          id: item.id,
          name: item.name,
          order: item.sort || 0,
          status: item.status !== false
        })
      }
      
      if (item.children) {
        traverse(item.children)
      }
    })
  }
  
  traverse(categoryTreeData.value)
  
  // 按排序字段排序
  return categories.sort((a, b) => (a.order || 0) - (b.order || 0))
}
</script>

<style scoped>
.categories-container {
  padding: 20px;
}

.categories-tabs {
  margin-bottom: 24px;
}

.categories-card {
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.grades-card {
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 分类管理内容布局 */
.categories-content {
  display: flex;
  gap: 30px;
  min-height: 800px;
  padding: 0 24px 24px;
}

/* 分类管理主要内容 */
.categories-main {
  display: flex;
  gap: 24px;
  flex: 1;
  min-height: 800px;
}

/* 年级管理内容 */
.grades-content {
  display: flex;
  gap: 30px;
  min-height: 800px;
  padding: 0 24px 24px;
}

/* 年级管理主要内容 */
.grades-main {
  flex: 1;
  min-height: 800px;
}

/* 左侧分类树 */
.category-tree {
  flex: 0 0 280px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
}

/* 左侧年级表格 */
.grades-table-container {
  flex: 1;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
}

/* 真机模拟 */
.category-preview {
  flex: 0 0 500px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  min-height: 800px;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.tree-node:hover {
  background-color: #f5f7fa;
}

.node-count {
  font-size: 12px;
  color: #909399;
  background-color: #ecf5ff;
  padding: 0 8px;
  border-radius: 10px;
}

/* 中间分类编辑 */
.category-edit {
  flex: 1;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 24px;
  min-height: 800px;
  background-color: #ffffff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
}

.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #909399;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.edit-form {
  width: 100%;
}

.form {
  max-width: 600px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

/* 操作日志 */
.logs-card {
  margin-bottom: 30px;
}

/* 年级表格样式 */
.el-table {
  border-radius: 8px;
  overflow: hidden;
}

.el-table th {
  background-color: #f7f7f7;
  font-weight: bold;
}

.el-table tr:hover {
  background-color: #f5f7fa;
}

/* 年级编辑弹窗样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .categories-content {
    flex-direction: column;
  }
  
  .category-tree {
    flex: none;
    height: 300px;
  }
  
  .category-edit {
    min-height: 400px;
  }
  
  .el-table {
    font-size: 14px;
  }
  
  .el-table th,
  .el-table td {
    padding: 10px;
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
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions button {
    width: 100%;
  }
  
  .dialog-footer {
    flex-direction: column;
  }
  
  .dialog-footer button {
    width: 100%;
  }
}
</style>
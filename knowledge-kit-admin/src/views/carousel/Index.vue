<template>
  <div class="carousel-container">
    <h2>轮播图管理</h2>
    <el-card class="carousel-card">
      <template #header>
        <div class="card-header">
          <span>轮播图列表</span>
          <div class="header-actions">
            <el-button type="primary" @click="handleAddCarousel">
              <el-icon><Plus /></el-icon>
              添加轮播图
            </el-button>
            <el-button @click="handleRefresh">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </div>
      </template>
      <div class="carousel-content">
        <!-- 左侧轮播图列表 -->
        <div class="carousel-list">
          <el-table :data="carouselList" style="width: 100%">
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column label="轮播图" width="120">
              <template #default="{ row }">
                <el-image
                  :src="row.imageUrl"
                  fit="cover"
                  style="width: 100px; height: 60px"
                  :preview-src-list="[row.imageUrl]"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="150"></el-table-column>
            <el-table-column prop="linkUrl" label="跳转链接" min-width="200">
              <template #default="{ row }">
                <el-tooltip :content="row.linkUrl" placement="top">
                  <span class="link-text">{{ row.linkUrl }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="显示顺序" width="100"></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-switch v-model="row.status" @change="handleStatusChange(row)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button size="small" type="primary" @click="handleEditCarousel(row)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button size="small" type="danger" @click="handleDeleteCarousel(row)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <!-- 右侧真机模拟 -->
        <div class="carousel-preview">
          <PhoneSimulator>
            <CarouselSimulator :carouselList="carouselList" />
          </PhoneSimulator>
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
        <el-table-column prop="user" label="操作人" width="100"></el-table-column>
      </el-table>
    </el-card>
    
    <!-- 轮播图编辑对话框 -->
    <el-dialog
      v-model="carouselDialogVisible"
      :title="selectedCarousel ? '编辑轮播图' : '添加轮播图'"
      width="600px"
    >
      <el-form
        ref="carouselFormRef"
        :model="carouselForm"
        :rules="carouselRules"
        label-width="120px"
        class="form"
      >
        <el-form-item label="轮播图标题" prop="title">
          <el-input v-model="carouselForm.title" placeholder="请输入轮播图标题"></el-input>
        </el-form-item>
        <el-form-item label="图片来源">
          <el-radio-group v-model="imageSource" @change="handleImageSourceChange">
            <el-radio label="url">图片链接</el-radio>
            <el-radio label="upload">本地图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图片链接" prop="imageUrl" v-if="imageSource === 'url'">
          <el-input v-model="carouselForm.imageUrl" placeholder="请输入轮播图图片链接"></el-input>
        </el-form-item>
        <el-form-item label="本地图片" v-else>
          <el-upload
            class="avatar-uploader"
            action="#"
            :auto-upload="false"
            :on-change="handleImageUpload"
            :show-file-list="true"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                请上传 JPG、PNG 格式的图片
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转链接" prop="linkUrl">
          <el-input v-model="carouselForm.linkUrl" placeholder="请输入跳转链接"></el-input>
        </el-form-item>
        <el-form-item label="链接类型">
          <el-radio-group v-model="carouselForm.linkType">
            <el-radio label="internal">内部链接</el-radio>
            <el-radio label="external">外部链接</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input-number v-model="carouselForm.sort" :min="0" :max="9999"></el-input-number>
        </el-form-item>
        <el-form-item label="自动轮播">
          <el-switch v-model="carouselForm.autoPlay" @change="handleAutoPlayChange"></el-switch>
        </el-form-item>
        <el-form-item label="轮播间隔" v-if="carouselForm.autoPlay">
          <el-input-number v-model="carouselForm.interval" :min="1000" :max="10000" :step="1000"></el-input-number>
          <span class="unit">毫秒</span>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="carouselForm.status" @change="handleFormStatusChange"></el-switch>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="carouselForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入轮播图描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancelEdit">取消</el-button>
          <el-button type="primary" @click="handleSaveCarousel">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Refresh, Delete, Edit, Picture } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PhoneSimulator from '../../components/PhoneSimulator.vue'
import CarouselSimulator from '../../components/simulators/CarouselSimulator.vue'

// 从localStorage加载轮播图数据
const loadCarouselFromStorage = () => {
  const storedData = localStorage.getItem('carouselList')
  if (storedData) {
    return JSON.parse(storedData)
  }
  // 默认数据
  return [
    {
      id: '1',
      title: '暑期学习资料推荐',
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=summer%20study%20materials%20banner%20for%20education%20app&image_size=landscape_16_9',
      linkUrl: '/documents?category=暑假',
      linkType: 'internal',
      sort: 1,
      autoPlay: true,
      interval: 3000,
      status: true,
      description: '暑期学习资料专题推荐'
    },
    {
      id: '2',
      title: '中考复习攻略',
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=high%20school%20entrance%20exam%20review%20banner&image_size=landscape_16_9',
      linkUrl: '/documents?category=中考',
      linkType: 'internal',
      sort: 2,
      autoPlay: true,
      interval: 3000,
      status: true,
      description: '中考复习资料汇总'
    },
    {
      id: '3',
      title: '新学期教材抢先看',
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=new%20semester%20textbooks%20preview%20banner&image_size=landscape_16_9',
      linkUrl: '/documents?category=新学期',
      linkType: 'internal',
      sort: 3,
      autoPlay: true,
      interval: 3000,
      status: false,
      description: '新学期教材预览'
    }
  ]
}

// 保存轮播图数据到localStorage
const saveCarouselToStorage = (data) => {
  localStorage.setItem('carouselList', JSON.stringify(data))
}

// 轮播图列表数据
const carouselList = ref(loadCarouselFromStorage())

// 选中的轮播图
const selectedCarousel = ref(null)
const carouselDialogVisible = ref(false)
const carouselFormRef = ref(null) // 表单引用
const imageSource = ref('url') // 图片来源：url或upload
const carouselForm = reactive({
  id: '',
  title: '',
  imageUrl: '',
  linkUrl: '',
  linkType: 'internal',
  sort: 0,
  autoPlay: true,
  interval: 3000,
  status: true,
  description: ''
})

// 轮播图表单验证规则
const carouselRules = {
  title: [
    { required: true, message: '请输入轮播图标题', trigger: 'blur' },
    { min: 1, max: 50, message: '轮播图标题长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  imageUrl: [
    { required: true, message: '请输入轮播图图片链接', trigger: 'blur' }
  ],
  linkUrl: [
    // 跳转链接不再必填
  ],
  sort: [
    { required: true, message: '请输入显示顺序', trigger: 'blur' }
  ]
}

// 操作日志
const operationLogs = ref([
  { time: '2026-02-21 15:30:00', action: '添加', content: '添加了轮播图 "暑期学习资料推荐"', user: '管理员' },
  { time: '2026-02-21 14:20:00', action: '编辑', content: '修改了轮播图 "中考复习攻略" 的跳转链接', user: '管理员' },
  { time: '2026-02-21 13:10:00', action: '删除', content: '删除了轮播图 "旧学期资料"', user: '管理员' },
  { time: '2026-02-21 12:00:00', action: '添加', content: '添加了轮播图 "新学期教材抢先看"', user: '管理员' }
])

// 初始化
onMounted(() => {
  loadCarouselData()
})

// 加载轮播图数据
const loadCarouselData = () => {
  // 从localStorage加载轮播图数据
  console.log('Loading carousel data from localStorage...')
  
  try {
    const storedData = localStorage.getItem('carouselList')
    if (storedData) {
      carouselList.value = JSON.parse(storedData)
      console.log('轮播图数据加载成功:', carouselList.value.length)
    } else {
      console.log('No carousel data found in localStorage, using default data')
    }
  } catch (error) {
    console.error('加载轮播图数据出错:', error)
  }
}

// 添加轮播图
const handleAddCarousel = () => {
  selectedCarousel.value = null
  // 重置表单
  Object.assign(carouselForm, {
    id: '',
    title: '',
    imageUrl: '',
    linkUrl: '',
    linkType: 'internal',
    sort: 0,
    autoPlay: true,
    interval: 3000,
    status: true,
    description: ''
  })
  // 显示编辑对话框
  carouselDialogVisible.value = true
}

// 编辑轮播图
const handleEditCarousel = (row) => {
  selectedCarousel.value = row
  // 填充表单
  Object.assign(carouselForm, {
    id: row.id,
    title: row.title,
    imageUrl: row.imageUrl,
    linkUrl: row.linkUrl,
    linkType: row.linkType || 'internal',
    sort: row.sort || 0,
    autoPlay: row.autoPlay !== false,
    interval: row.interval || 3000,
    status: row.status !== false,
    description: row.description || ''
  })
  // 根据图片URL设置图片源类型
  if (row.imageUrl && row.imageUrl.startsWith('data:')) {
    imageSource.value = 'upload'
  } else {
    imageSource.value = 'url'
  }
  // 显示编辑对话框
  carouselDialogVisible.value = true
}

// 保存轮播图
const handleSaveCarousel = async () => {
  // 这里可以实现保存轮播图的逻辑
  console.log('Saving carousel:', carouselForm)
  
  try {
    // 验证图片是否已设置
    if (!carouselForm.imageUrl) {
      ElMessage.error('请设置轮播图图片')
      return
    }
    
    // 准备请求数据
    const requestData = {
      imageUrl: carouselForm.imageUrl,
      title: carouselForm.title,
      linkUrl: carouselForm.linkUrl,
      linkType: carouselForm.linkType,
      order: carouselForm.sort,
      status: carouselForm.status ? 'active' : 'inactive',
      description: carouselForm.description
    }
    
    // 模拟保存成功，直接操作本地数据
    if (carouselForm.id) {
      // 编辑轮播图
      const index = carouselList.value.findIndex(item => item.id === carouselForm.id)
      if (index !== -1) {
        carouselList.value[index] = { ...carouselForm }
        ElMessage.success('轮播图编辑成功')
      } else {
        ElMessage.error('轮播图不存在')
        return
      }
      operationLogs.value.unshift({
        time: new Date().toLocaleString('zh-CN'),
        action: '编辑',
        content: `修改了轮播图 "${carouselForm.title}"`,
        user: '管理员'
      })
    } else {
      // 添加轮播图
      const newCarousel = {
        ...carouselForm,
        id: Date.now().toString()
      }
      carouselList.value.unshift(newCarousel)
      ElMessage.success('轮播图添加成功')
      operationLogs.value.unshift({
        time: new Date().toLocaleString('zh-CN'),
        action: '添加',
        content: `添加了轮播图 "${carouselForm.title}"`,
        user: '管理员'
      })
    }
    
    // 重新排序轮播图
    carouselList.value.sort((a, b) => a.sort - b.sort)
    // 保存到localStorage
    saveCarouselToStorage(carouselList.value)
    // 重置状态
    selectedCarousel.value = null
    imageSource.value = 'url' // 重置图片源为链接
    Object.assign(carouselForm, {
      id: '',
      title: '',
      imageUrl: '',
      linkUrl: '',
      linkType: 'internal',
      sort: 0,
      autoPlay: true,
      interval: 3000,
      status: true,
      description: ''
    })
    // 隐藏编辑对话框
    carouselDialogVisible.value = false
  } catch (error) {
    console.error('保存轮播图失败:', error)
    ElMessage.error('保存失败，请重试')
  }
}

// 取消编辑
const handleCancelEdit = () => {
  // 重置状态
  selectedCarousel.value = null
  imageSource.value = 'url' // 重置图片源为链接
  Object.assign(carouselForm, {
    id: '',
    title: '',
    imageUrl: '',
    linkUrl: '',
    linkType: 'internal',
    sort: 0,
    autoPlay: true,
    interval: 3000,
    status: true,
    description: ''
  })
  // 隐藏编辑对话框
  carouselDialogVisible.value = false
}

// 删除轮播图
const handleDeleteCarousel = (row) => {
  // 这里可以实现删除轮播图的逻辑
  console.log('Deleting carousel:', row)
  
  ElMessageBox.confirm(
    `确定要删除轮播图「${row.title}」吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 直接删除本地数据
    const index = carouselList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      carouselList.value.splice(index, 1)
      // 保存到localStorage
      saveCarouselToStorage(carouselList.value)
      ElMessage.success('轮播图删除成功')
    } else {
      ElMessage.error('轮播图不存在')
      return
    }
    
    operationLogs.value.unshift({
      time: new Date().toLocaleString('zh-CN'),
      action: '删除',
      content: `删除了轮播图 "${row.title}"`,
      user: '管理员'
    })
    
    // 如果删除的是当前选中的轮播图，清空选择
    if (selectedCarousel.value && selectedCarousel.value.id === row.id) {
      selectedCarousel.value = null
      Object.assign(carouselForm, {
        id: '',
        title: '',
        imageUrl: '',
        linkUrl: '',
        linkType: 'internal',
        sort: 0,
        autoPlay: true,
        interval: 3000,
        status: true,
        description: ''
      })
    }
  }).catch(() => {
    // 用户取消删除
    ElMessage.info('已取消删除')
  })
}

// 状态变更
const handleStatusChange = (row) => {
  console.log('Status changed:', row)
  try {
    // 直接保存到localStorage
    saveCarouselToStorage(carouselList.value)
    operationLogs.value.unshift({
      time: new Date().toLocaleString('zh-CN'),
      action: '状态变更',
      content: `将轮播图 "${row.title}" ${row.status ? '启用' : '禁用'}`,
      user: '管理员'
    })
    ElMessage.success(`轮播图 "${row.title}" ${row.status ? '已启用' : '已禁用'}`)
  } catch (error) {
    console.error('状态变更失败:', error)
    ElMessage.error('状态变更失败，请重试')
  }
}

// 处理图片源切换
const handleImageSourceChange = () => {
  if (imageSource.value === 'upload') {
    // 切换到上传模式时，清空图片链接
    carouselForm.imageUrl = ''
  }
}

// 处理图片上传
const handleImageUpload = (file) => {
  // 这里可以实现图片上传逻辑
  console.log('Uploading image:', file)
  
  // 模拟上传成功，使用临时URL
  const reader = new FileReader()
  reader.onload = (e) => {
    carouselForm.imageUrl = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

// 处理自动轮播变更
const handleAutoPlayChange = (value) => {
  console.log('Auto play changed:', value)
  carouselForm.autoPlay = value
}

// 处理表单状态变更
const handleFormStatusChange = (value) => {
  console.log('Status changed:', value)
  carouselForm.status = value
}

// 刷新
const handleRefresh = () => {
  loadCarouselData()
}
</script>

<style scoped>
.carousel-container {
  padding: 20px;
}

.carousel-card {
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

.carousel-content {
  display: flex;
  gap: 30px;
  min-height: 800px;
}

/* 左侧轮播图列表 */
.carousel-list {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

/* 右侧真机模拟 */
.carousel-preview {
  flex: 0 0 500px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  min-height: 800px;
}

.link-text {
  color: #409eff;
  text-decoration: underline;
  word-break: break-all;
  font-size: 12px;
}

/* 右侧轮播图编辑 */
.carousel-edit {
  flex: 0 0 450px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  min-height: 500px;
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
  max-width: 100%;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.unit {
  margin-left: 10px;
  color: #909399;
}

/* 操作日志 */
.logs-card {
  margin-bottom: 30px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .carousel-content {
    flex-direction: column;
  }
  
  .carousel-edit {
    flex: none;
    min-height: 400px;
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
}
</style>
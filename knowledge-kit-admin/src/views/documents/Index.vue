<template>
  <div class="documents-container">
    <h2>资料管理</h2>
    
    <el-card class="documents-card">
      <template #header>
        <div class="card-header">
          <span>资料列表</span>
          <div class="header-actions">
            <el-button type="primary" @click="handleSingleUpload">
              <el-icon><Upload /></el-icon>
              单个上传
            </el-button>
            <el-button type="success" @click="handleBatchUpload">
              <el-icon><Picture /></el-icon>
              批量上传
            </el-button>
            <el-button @click="handleExportData">
              <el-icon><Download /></el-icon>
              导出数据
            </el-button>
          </div>
        </div>
      </template>
      
      <!-- 搜索和筛选 -->
      <div class="search-filter">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchForm.keyword" placeholder="请输入资料标题" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="6">
            <el-select v-model="searchForm.grade" placeholder="年级">
              <el-option label="全部" value=""></el-option>
              <el-option label="幼小衔接" value="幼小衔接"></el-option>
              <el-option label="小学" value="小学"></el-option>
              <el-option label="初中" value="初中"></el-option>
              <el-option label="高中" value="高中"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="searchForm.subject" placeholder="科目">
              <el-option label="全部" value=""></el-option>
              <el-option label="语文" value="语文"></el-option>
              <el-option label="数学" value="数学"></el-option>
              <el-option label="英语" value="英语"></el-option>
              <el-option label="物理" value="物理"></el-option>
              <el-option label="化学" value="化学"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </div>
      
      <!-- 资料列表 -->
      <el-table :data="documentsList" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column label="预览图" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.previewUrl"
              fit="cover"
              style="width: 80px; height: 60px"
              :preview-src-list="[row.previewUrl]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="资料标题" min-width="200"></el-table-column>
        <el-table-column prop="grade" label="年级" width="100"></el-table-column>
        <el-table-column prop="subject" label="科目" width="100"></el-table-column>
        <el-table-column prop="type" label="类型" width="100"></el-table-column>
        <el-table-column prop="version" label="版本" width="100"></el-table-column>
        <el-table-column prop="downloadCount" label="下载量" width="100"></el-table-column>
        <el-table-column prop="favoritesCount" label="收藏量" width="100"></el-table-column>
        <el-table-column prop="uploadDate" label="上传时间" width="180"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '活跃' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handlePreview(row)" style="margin-right: 5px">
              <el-icon><View /></el-icon>
              预览
            </el-button>
            <el-button size="small" type="warning" @click="handleEdit(row)" style="margin-right: 5px">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </el-card>
    
    <!-- 单个上传对话框 -->
    <el-dialog
      v-model="singleUploadDialogVisible"
      title="单个资料上传"
      width="600px"
    >
      <el-form :model="uploadForm" label-width="120px">
        <el-form-item label="资料标题" required>
          <el-input v-model="uploadForm.title" placeholder="请输入资料标题"></el-input>
        </el-form-item>
        <el-form-item label="年级" required>
          <el-select v-model="uploadForm.grade" placeholder="请选择年级">
            <el-option label="幼小衔接" value="幼小衔接"></el-option>
            <el-option label="小学" value="小学"></el-option>
            <el-option label="初中" value="初中"></el-option>
            <el-option label="高中" value="高中"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科目" required>
          <el-select v-model="uploadForm.subject" placeholder="请选择科目">
            <el-option label="语文" value="语文"></el-option>
            <el-option label="数学" value="数学"></el-option>
            <el-option label="英语" value="英语"></el-option>
            <el-option label="物理" value="物理"></el-option>
            <el-option label="化学" value="化学"></el-option>
            <el-option label="生物" value="生物"></el-option>
            <el-option label="历史" value="历史"></el-option>
            <el-option label="地理" value="地理"></el-option>
            <el-option label="道德与法治" value="道德与法治"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资料类型" required>
          <el-select v-model="uploadForm.type" placeholder="请选择资料类型">
            <el-option label="试卷" value="试卷"></el-option>
            <el-option label="练习" value="练习"></el-option>
            <el-option label="知识点总结" value="知识点总结"></el-option>
            <el-option label="寒假" value="寒假"></el-option>
            <el-option label="暑假" value="暑假"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教材版本" required>
          <el-select v-model="uploadForm.version" placeholder="请选择教材版本">
            <el-option label="人教版" value="人教版"></el-option>
            <el-option label="北师大版" value="北师大版"></el-option>
            <el-option label="苏教版" value="苏教版"></el-option>
            <el-option label="统编版" value="统编版"></el-option>
            <el-option label="其他版本" value="其他版本"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="网盘链接" required>
          <el-input v-model="uploadForm.downloadUrl" placeholder="请输入网盘链接"></el-input>
        </el-form-item>
        <el-form-item label="预览图">
          <el-upload
            class="upload-demo"
            action="#"
            :on-change="handlePreviewUpload"
            :auto-upload="false"
            :show-file-list="true"
          >
            <el-button type="primary">
              <el-icon><Upload /></el-icon>
              选择图片
            </el-button>
            <template #tip>
              <div class="el-upload__tip">
                请选择JPG、PNG格式的图片，大小不超过2MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="资料描述">
          <el-input
            v-model="uploadForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入资料描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="singleUploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitUpload">确定上传</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 批量上传对话框 -->
    <el-dialog
      v-model="batchUploadDialogVisible"
      title="批量上传"
      width="600px"
    >
      <div class="batch-upload-content">
        <h4>批量上传说明</h4>
        <ol>
          <li>准备包含资料信息的JSON文件</li>
          <li>确保文件格式正确，包含必要字段</li>
          <li>上传JSON文件和对应的预览图片</li>
        </ol>
        
        <el-form label-width="120px">
          <el-form-item label="JSON文件">
            <el-upload
              class="upload-demo"
              action="#"
              :on-change="handleJsonUpload"
              :auto-upload="false"
              :show-file-list="true"
            >
              <el-button type="primary">
                <el-icon><Document /></el-icon>
                选择JSON文件
              </el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="预览图片">
            <el-upload
              class="upload-demo"
              action="#"
              :on-change="handleImagesUpload"
              :auto-upload="false"
              :multiple="true"
              :show-file-list="true"
            >
              <el-button type="primary">
                <el-icon><Picture /></el-icon>
                选择图片文件
              </el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchUploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitBatchUpload">开始批量上传</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="资料预览"
      width="800px"
    >
      <div class="preview-content" v-if="selectedDocument">
        <h3>{{ selectedDocument.title }}</h3>
        <el-divider></el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-image
              :src="selectedDocument.previewUrl"
              fit="cover"
              style="width: 100%; height: 200px"
              :preview-src-list="[selectedDocument.previewUrl]"
            ></el-image>
          </el-col>
          <el-col :span="16">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="年级">{{ selectedDocument.grade }}</el-descriptions-item>
              <el-descriptions-item label="科目">{{ selectedDocument.subject }}</el-descriptions-item>
              <el-descriptions-item label="类型">{{ selectedDocument.type }}</el-descriptions-item>
              <el-descriptions-item label="版本">{{ selectedDocument.version }}</el-descriptions-item>
              <el-descriptions-item label="下载量">{{ selectedDocument.downloadCount }}</el-descriptions-item>
              <el-descriptions-item label="收藏量">{{ selectedDocument.favoritesCount }}</el-descriptions-item>
              <el-descriptions-item label="上传时间">{{ selectedDocument.uploadDate }}</el-descriptions-item>
              <el-descriptions-item label="状态">{{ selectedDocument.status === 'active' ? '活跃' : '禁用' }}</el-descriptions-item>
            </el-descriptions>
            <div class="download-link" style="margin-top: 20px">
              <el-button type="primary" @click="copyDownloadLink(selectedDocument.downloadUrl)">
                <el-icon><Link /></el-icon>
                复制下载链接
              </el-button>
              <el-input v-model="selectedDocument.downloadUrl" readonly style="margin-top: 10px"></el-input>
            </div>
          </el-col>
        </el-row>
        <div class="description" style="margin-top: 20px">
          <h4>资料描述</h4>
          <p>{{ selectedDocument.description }}</p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="previewDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Upload, Download, View, Edit, Delete, Document, Picture, Link, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 资料列表数据
const documentsList = ref([
  {
    id: 1,
    title: '小学三年级数学上册单元测试卷',
    grade: '小学',
    subject: '数学',
    type: '试卷',
    version: '人教版',
    downloadUrl: 'https://pan.baidu.com/s/1234567890',
    previewUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=math%20test%20paper%20for%20primary%20school&image_size=square',
    downloadCount: 1234,
    favoritesCount: 567,
    uploadDate: '2026-02-20 14:30:00',
    status: 'active',
    description: '小学三年级数学上册第一单元测试卷，包含基础题和提高题'
  },
  {
    id: 2,
    title: '初中物理力学知识点总结',
    grade: '初中',
    subject: '物理',
    type: '知识点总结',
    version: '北师大版',
    downloadUrl: 'https://pan.baidu.com/s/0987654321',
    previewUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=physics%20mechanics%20notes%20for%20middle%20school&image_size=square',
    downloadCount: 987,
    favoritesCount: 345,
    uploadDate: '2026-02-19 10:15:00',
    status: 'active',
    description: '初中物理力学部分详细知识点总结，包含公式和例题'
  },
  {
    id: 3,
    title: '高中语文古诗词默写练习',
    grade: '高中',
    subject: '语文',
    type: '练习',
    version: '统编版',
    downloadUrl: 'https://pan.baidu.com/s/abcdefghij',
    previewUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20poetry%20practice%20for%20high%20school&image_size=square',
    downloadCount: 765,
    favoritesCount: 234,
    uploadDate: '2026-02-18 09:45:00',
    status: 'active',
    description: '高中语文必背古诗词默写练习，包含易错字提示'
  },
  {
    id: 4,
    title: '幼小衔接数学启蒙教材',
    grade: '幼小衔接',
    subject: '数学',
    type: '知识点总结',
    version: '其他版本',
    downloadUrl: 'https://pan.baidu.com/s/jihgfedcba',
    previewUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=math%20enlightenment%20for%20preschool&image_size=square',
    downloadCount: 543,
    favoritesCount: 123,
    uploadDate: '2026-02-17 16:20:00',
    status: 'active',
    description: '幼小衔接数学启蒙教材，包含数字认知和基础运算'
  },
  {
    id: 5,
    title: '初中化学实验视频教程',
    grade: '初中',
    subject: '化学',
    type: '知识点总结',
    version: '人教版',
    downloadUrl: 'https://pan.baidu.com/s/klmnopqrst',
    previewUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chemistry%20experiment%20video%20tutorial&image_size=square',
    downloadCount: 321,
    favoritesCount: 67,
    uploadDate: '2026-02-16 11:30:00',
    status: 'disabled',
    description: '初中化学重要实验视频教程，包含实验步骤和注意事项'
  }
])

// 分页数据
const total = ref(100)
const currentPage = ref(1)
const pageSize = ref(10)

// 搜索和筛选表单
const searchForm = reactive({
  keyword: '',
  grade: '',
  subject: ''
})

// 上传表单
const uploadForm = reactive({
  title: '',
  grade: '',
  subject: '',
  type: '',
  version: '',
  downloadUrl: '',
  previewUrl: '',
  description: ''
})

// 对话框状态
const singleUploadDialogVisible = ref(false)
const batchUploadDialogVisible = ref(false)
const previewDialogVisible = ref(false)

// 选中的文档
const selectedDocument = ref(null)

// 搜索处理
const handleSearch = () => {
  console.log('搜索条件:', searchForm)
  ElMessage.info('搜索功能已触发')
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    grade: '',
    subject: ''
  })
  ElMessage.info('搜索条件已重置')
}

// 分页处理
const handleCurrentChange = (current) => {
  currentPage.value = current
  console.log('当前页码:', current)
}

const handleSizeChange = (size) => {
  pageSize.value = size
  console.log('每页条数:', size)
}

// 单个上传
const handleSingleUpload = () => {
  // 重置上传表单
  Object.assign(uploadForm, {
    title: '',
    grade: '',
    subject: '',
    type: '',
    version: '',
    downloadUrl: '',
    previewUrl: '',
    description: ''
  })
  singleUploadDialogVisible.value = true
}

// 批量上传
const handleBatchUpload = () => {
  batchUploadDialogVisible.value = true
}

// 预览图片上传
const handlePreviewUpload = (file) => {
  // 模拟上传
  uploadForm.previewUrl = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=document%20preview%20image&image_size=square'
  ElMessage.success('预览图片已选择')
}

// JSON文件上传
const handleJsonUpload = (file) => {
  ElMessage.info(`已选择JSON文件: ${file.name}`)
}

// 图片上传
const handleImagesUpload = (file) => {
  ElMessage.info(`已选择图片文件: ${file.name}`)
}

// 提交上传
const handleSubmitUpload = () => {
  // 模拟上传
  singleUploadDialogVisible.value = false
  ElMessage.success('资料上传成功')
  
  // 添加到列表
  const newDocument = {
    id: documentsList.value.length + 1,
    title: uploadForm.title,
    grade: uploadForm.grade,
    subject: uploadForm.subject,
    type: uploadForm.type,
    version: uploadForm.version,
    downloadUrl: uploadForm.downloadUrl,
    previewUrl: uploadForm.previewUrl || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20preview%20image&image_size=square',
    downloadCount: 0,
    favoritesCount: 0,
    uploadDate: new Date().toLocaleString('zh-CN'),
    status: 'active',
    description: uploadForm.description
  }
  documentsList.value.unshift(newDocument)
}

// 批量上传提交
const handleSubmitBatchUpload = () => {
  batchUploadDialogVisible.value = false
  ElMessage.success('批量上传已开始处理')
}

// 资料预览
const handlePreview = (row) => {
  selectedDocument.value = { ...row }
  previewDialogVisible.value = true
}

// 编辑资料
const handleEdit = (row) => {
  console.log('编辑资料:', row)
  // 填充表单
  Object.assign(uploadForm, {
    title: row.title,
    grade: row.grade,
    subject: row.subject,
    type: row.type,
    version: row.version,
    downloadUrl: row.downloadUrl,
    previewUrl: row.previewUrl,
    description: row.description
  })
  // 打开编辑对话框
  singleUploadDialogVisible.value = true
  ElMessage.info(`编辑资料: ${row.title}`)
}

// 删除资料
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除资料「${row.title}」吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = documentsList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      documentsList.value.splice(index, 1)
    }
    ElMessage.success('资料删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 导出数据
const handleExportData = () => {
  ElMessage.success('数据导出成功，文件已下载')
}

// 复制下载链接
const copyDownloadLink = (link) => {
  navigator.clipboard.writeText(link).then(() => {
    ElMessage.success('下载链接已复制到剪贴板')
  })
}
</script>

<style scoped>
.documents-container {
  padding: 20px;
}

.documents-card {
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

.search-filter {
  margin: 20px 24px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
}

.pagination {
  margin: 20px 24px;
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
}

.batch-upload-content {
  padding: 20px 0;
}

.batch-upload-content h4 {
  margin-bottom: 10px;
}

.batch-upload-content ol {
  margin-bottom: 20px;
  padding-left: 20px;
}

.batch-upload-content li {
  margin-bottom: 5px;
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
  
  .search-filter {
    padding: 10px;
  }
}
</style>
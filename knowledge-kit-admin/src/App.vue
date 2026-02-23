<template>
  <div class="app-container">
    <el-container class="main-container">
      <el-aside width="200px" class="sidebar">
        <div class="logo">知识锦囊</div>
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="/dashboard">
            <el-icon><House /></el-icon>
            <span>控制台</span>
          </el-menu-item>
          <el-menu-item index="/documents">
            <el-icon><Document /></el-icon>
            <span>文档管理</span>
          </el-menu-item>
          <el-menu-item index="/categories">
            <el-icon><Grid /></el-icon>
            <span>分类管理</span>
          </el-menu-item>
          <el-menu-item index="/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/carousel">
            <el-icon><Picture /></el-icon>
            <span>轮播图管理</span>
          </el-menu-item>
          <el-menu-item index="/ads">
            <el-icon><Coin /></el-icon>
            <span>广告管理</span>
          </el-menu-item>
          <el-menu-item index="/sync">
            <el-icon><Refresh /></el-icon>
            <span>内容同步</span>
          </el-menu-item>
          <el-menu-item index="/recommend">
            <el-icon><Star /></el-icon>
            <span>推荐管理</span>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="header-left">
            <el-button type="text" class="menu-toggle">
              <el-icon><Menu /></el-icon>
            </el-button>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="user-dropdown">
                <el-avatar size="small" :src="userAvatar"></el-avatar>
                <span class="user-name">管理员</span>
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main class="content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from './store/auth'
import { ElMessage } from 'element-plus'
import { House, Document, Grid, User, Picture, Coin, Refresh, Star, Setting, Menu, ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const activeMenu = computed(() => {
  return route.path
})

const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

const handleMenuSelect = (key) => {
  router.push(key)
}

const handleLogout = () => {
  authStore.logout()
  ElMessage.success('退出登录成功')
  router.push('/login')
}

onMounted(() => {
  // 检查登录状态
  if (!authStore.token && route.path !== '/login') {
    router.push('/login')
  }
})
</script>

<style scoped>
.app-container {
  height: 100vh;
  overflow: hidden;
}

.main-container {
  height: 100%;
}

.sidebar {
  background-color: #303133;
  color: #fff;
  overflow: hidden;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  padding: 20px 0;
  background-color: #202124;
}

.sidebar-menu {
  border-right: none;
  background-color: #303133;
}

.sidebar-menu .el-menu-item {
  color: #fff;
  height: 60px;
  line-height: 60px;
  margin: 0;
}

.sidebar-menu .el-menu-item:hover {
  background-color: #404143;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #409EFF;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.menu-toggle {
  margin-right: 20px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-name {
  margin-left: 10px;
  margin-right: 5px;
}

.content {
  background-color: #f5f7fa;
  padding: 20px;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .sidebar {
    width: 60px !important;
  }
  
  .logo {
    font-size: 14px;
    padding: 15px 0;
  }
  
  .sidebar-menu .el-menu-item span {
    display: none;
  }
}
</style>
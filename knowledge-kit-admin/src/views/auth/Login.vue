<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <h2>知识锦囊后台管理系统</h2>
      <div class="login-form">
        <div class="form-item">
          <label>用户名</label>
          <input 
            type="text" 
            v-model="username" 
            placeholder="请输入用户名"
            class="form-input"
            id="username-input"
          >
        </div>
        <div class="form-item">
          <label>密码</label>
          <input 
            type="password" 
            v-model="password" 
            placeholder="请输入密码"
            class="form-input"
            id="password-input"
          >
        </div>
        <div class="form-item">
          <button 
            class="login-button"
            @click="handleLogin"
            :disabled="loading"
          >
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import api from '../../api/index'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const username = ref('admin')
const password = ref('admin123')

const handleLogin = async () => {
  try {
    loading.value = true

    // 直接调用后端登录接口
    const response = await api.post('/users/admin/login', {
      username: username.value,
      password: password.value
    })

    const result = response.data
    
    if (result.success) {
      authStore.setToken(result.token)
      authStore.setUser({
        username: result.user.username,
        role: result.user.role,
        id: result.user.id
      })
      router.push('/dashboard')
    } else {
      alert(result.message || '登录失败')
    }
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-form-wrapper {
  width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-form-wrapper h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
  font-size: 20px;
}

.login-form {
  width: 100%;
}

.form-item {
  margin-bottom: 24px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.form-input {
  width: 100%;
  height: 40px;
  padding: 0 15px;
  font-size: 14px;
  color: #303133;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.form-input::placeholder {
  color: #c0c4cc;
}

.login-button {
  width: 100%;
  height: 40px;
  background-color: #409EFF;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #66b1ff;
}

.login-button:active {
  background-color: #3a8ee6;
}

.login-button:disabled {
  background-color: #c6e2ff;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-form-wrapper {
    width: 90%;
    padding: 20px;
  }
}
</style>
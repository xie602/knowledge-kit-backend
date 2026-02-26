import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 根据部署环境动态设置base路径
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  // 路径别名配置
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  // Vercel会自动处理路由，不需要设置admin路径
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})

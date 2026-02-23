import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/dashboard/Index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/documents',
    name: 'Documents',
    component: () => import('../views/documents/Index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('../views/categories/Index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/users/Index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/carousel',
    name: 'Carousel',
    component: () => import('../views/carousel/Index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ads',
    name: 'Ads',
    component: () => import('../views/ads/Index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/sync',
    name: 'Sync',
    component: () => import('../views/sync/Index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: () => import('../views/recommend/Index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/settings/Index.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  
  if (requiresAuth && !authStore.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
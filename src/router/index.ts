import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
          meta: { title: '数据看板' }
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('@/views/product/ProductListView.vue'),
          meta: { title: '商品列表' }
        },
        {
          path: 'products/add',
          name: 'product-add',
          component: () => import('@/views/product/ProductEditView.vue'),
          meta: { title: '新增商品' }
        },
        {
          path: 'products/:id/edit',
          name: 'product-edit',
          component: () => import('@/views/product/ProductEditView.vue'),
          meta: { title: '编辑商品' }
        },
        {
          path: 'products/categories',
          name: 'categories',
          component: () => import('@/views/product/CategoryView.vue'),
          meta: { title: '分类管理' }
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/views/order/OrderListView.vue'),
          meta: { title: '订单列表' }
        },
        {
          path: 'orders/:id',
          name: 'order-detail',
          component: () => import('@/views/order/OrderDetailView.vue'),
          meta: { title: '订单详情' }
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/views/user/UserListView.vue'),
          meta: { title: '用户列表' }
        },
        {
          path: 'users/:id',
          name: 'user-detail',
          component: () => import('@/views/user/UserDetailView.vue'),
          meta: { title: '用户详情' }
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const token = getToken()
  if (to.meta.requiresAuth === false) {
    // 已登录访问登录页，跳转首页
    if (token && to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (!token) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router

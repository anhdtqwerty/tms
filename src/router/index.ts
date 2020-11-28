import { getRootStore } from '@/stores'
import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: () => import('@/modules/containers/auth-container.vue'),
    children: [
      {
        path: 'signin',
        name: 'signIn',
        component: () => import('@/modules/auth/pages/signin-page.vue'),
        meta: {
          title: 'Sign In',
          auth: false
        }
      },
      {
        path: 'signup',
        name: 'signup',
        component: () => import('@/modules/auth/pages/signup-page.vue'),
        meta: {
          title: 'Sign Up',
          auth: false
        }
      },
      {
        path: 'forgot-password',
        name: 'forgotPassword',
        component: () => import('@/modules/auth/pages/forgot-password-page.vue'),
        meta: {
          title: 'Quên mật khẩu',
          auth: false
        }
      },
      {
        path: 'confirm-email',
        name: 'confirmEmail',
        component: () => import('@/modules/auth/pages/confirm-email-page.vue'),
        meta: {
          title: 'Xác nhận email',
          auth: false
        }
      },
      {
        path: 'reset-password',
        name: 'resetPassword',
        component: () => import('@/modules/auth/pages/reset-password-page.vue'),
        meta: {
          title: 'Tạo lại mật khẩu',
          auth: false
        }
      }
    ]
  },
  {
    path: '/',
    meta: {
      title: 'Dashboard'
    },
    component: () => import('@/modules/containers/main-container.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/modules/dashboard/dashboard-page.vue'),
        meta: {
          title: 'dashboard',
          auth: true
        }
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/modules/system-manager/pages/user-manager-page.vue'),
        meta: {
          title: 'users',
          auth: true
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (!to.name) {
    next('dashboard')
  } else {
    const store = getRootStore()
    const requriedAuth = to.matched.some(m => m.meta?.auth === true)
    const isAuthenticated = store.auth.authenticated

    if ((requriedAuth && isAuthenticated) || (!requriedAuth && !isAuthenticated)) {
      next()
    } else if (!requriedAuth && isAuthenticated) {
      next('dashboard')
    } else if (requriedAuth && !isAuthenticated) {
      next('signin')
    } else {
      console.error(`VueRouter error ${to.name} requriedAuth=${requriedAuth} isAuthenticated=${isAuthenticated}`)
    }
  }
})

export default router

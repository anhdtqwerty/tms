import { permissionHelper } from '@/helpers/permission-helper'
import { authStore } from '@/stores/auth-store'
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
          auth: true,
          permission: 'system.user.read'
        }
      },
      {
        path: 'user/:userid',
        name: 'user',
        component: () => import('@/modules/system-manager/pages/user-detail-page.vue'),
        meta: {
          title: 'user',
          auth: true,
          permission: 'system.user.edit'
        }
      },
      // {
      //   path: 'role-sections',
      //   name: 'role-sections',
      //   component: () => import('@/modules/system-manager/pages/role-sections-page.vue'),
      //   meta: {
      //     title: 'Vai trò',
      //     auth: true
      //   }
      // },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('@/modules/system-manager/pages/role-manager-page.vue'),
        meta: {
          title: 'Cài đặt vai trò',
          auth: true,
          permission: 'system.role.read'
        }
      },
      {
        path: 'departments',
        name: 'departments',
        component: () => import('@/modules/unit-manager/pages/department-manager-page.vue'),
        meta: {
          title: 'departments',
          auth: true,
          permission: 'system.unit.read'
        }
      },
      {
        path: 'department/:departmentid',
        name: 'department',
        component: () => import('@/modules/unit-manager/pages/department-detail-page.vue'),
        meta: {
          title: 'department',
          auth: true,
          permission: 'system.unit.read'
        }
      },
      {
        path: 'ministries',
        name: 'ministries',
        component: () => import('@/modules/unit-manager/pages/ministry-manager-page.vue'),
        meta: {
          title: 'ministries',
          auth: true,
          permission: 'system.unit.read'
        }
      },
      {
        path: 'units',
        name: 'units',
        component: () => import('@/modules/unit-manager/pages/unit-manager-page.vue'),
        meta: {
          title: 'units',
          auth: true,
          permission: 'system.unit.read'
        }
      },
      {
        path: 'unit/:unitid',
        name: 'unit',
        component: () => import('@/modules/unit-manager/pages/unit-detail-page.vue'),
        meta: {
          title: 'unit',
          auth: true,
          permission: 'system.unit.read'
        }
      },
      {
        path: 'tasks/:tasktype',
        name: 'tasks',
        component: () => import('@/modules/task-manager/pages/task-manager-page.vue'),
        meta: {
          title: 'task',
          auth: true
        }
      },
      {
        path: 'task/:taskid',
        name: 'task',
        component: () => import('@/modules/task-manager/pages/task-detail-page.vue'),
        meta: {
          title: 'task',
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
    const requriedAuth = to.matched.some(m => m.meta?.auth === true)
    const isAuthenticated = authStore.authenticated

    if ((requriedAuth && isAuthenticated) || (!requriedAuth && !isAuthenticated)) {
      if (permissionHelper.check(to.meta?.permission)) {
        next()
      } else {
        next('dashboard')
      }
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

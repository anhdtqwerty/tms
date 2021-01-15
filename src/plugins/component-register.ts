import Vue from 'vue'

export const componentRegister = () => {
  Vue.component('breadcrumbs', () => import('@/router/breadcumbs.vue'))
  Vue.component('text-link', () => import('@/components/text-link/text-link.vue'))
  Vue.component('app-text-field', () => import('@/components/vuetify/app-text-field.vue'))
  Vue.component('app-textarea', () => import('@/components/vuetify/app-text-area.vue'))
  Vue.component('app-file-input', () => import('@/components/vuetify/app-file-input.vue'))
  Vue.component('table-header-setting', () => import('@/components/tables/table-header-setting.vue'))
}

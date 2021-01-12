import { apiLogNames, ApiLogType } from '@/services/api-service'
import Vue from 'vue'

export const vueFilterRegister = () => {
  Vue.filter('logAction', (a: ApiLogType) => apiLogNames[a])
}

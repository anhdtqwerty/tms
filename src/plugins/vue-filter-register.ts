import { apiLogNames, ApiLogType } from '@/services/api-service'
import moment from 'moment'
import Vue from 'vue'

export const vueFilterRegister = () => {
  Vue.filter('logAction', (a: ApiLogType) => apiLogNames[a])
  Vue.filter('date', (isoStr: string, format: string) => (isoStr ? moment(isoStr).format(format) : ''))
  Vue.filter('mmddyyyy', (isoStr: string) => (isoStr ? moment(isoStr).format('DD/MM/YYYY') : ''))
  Vue.filter('mmddyyyyhhmmss', (isoStr: string) => (isoStr ? moment(isoStr).format('DD/MM/YYYY hh:mm:ss') : ''))
}

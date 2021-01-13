import { apiLogNames, ApiLogType } from '@/services/api-service'
import moment from 'moment'
import Vue from 'vue'

export const vueFilterRegister = () => {
  Vue.filter('logAction', (a: ApiLogType) => apiLogNames[a])
  Vue.filter('date', (isoStr: string, format: string) => {
    return isoStr ? moment(isoStr).format(format) : ''
  })
  Vue.filter('mmddyyyy', (isoStr: string) => moment(isoStr).format('DD/MM/YYYY'))
}

import {
  taskApprovementStatusNameMap,
  TaskApprovementStatusType,
  taskPriorityNameMap,
  TaskPriorityType
} from '@/models/task-model'
import { permissionHelper } from '@/helpers/permission-helper'
import { apiLogNames, ApiLogType } from '@/services/api-service'
import _ from 'lodash'
import moment from 'moment'
import Vue from 'vue'

export const vueFilterRegister = () => {
  Vue.filter('logAction', (a: ApiLogType) => apiLogNames[a])
  Vue.filter('taskStatus', (a: TaskApprovementStatusType) => taskApprovementStatusNameMap[a])
  Vue.filter('taskPriority', (a: TaskPriorityType) => taskPriorityNameMap[a])

  Vue.filter('date', (isoStr: string, format: string) => (isoStr ? moment(isoStr).format(format) : ''))
  Vue.filter('ddmmyyyy', (isoStr: string) => (isoStr ? moment(isoStr).format('DD/MM/YYYY') : ''))
  Vue.filter('ddmmyyyyhhmmss', (isoStr: string) => (isoStr ? moment(isoStr).format('DD/MM/YYYY hh:mm:ss') : ''))

  Vue.filter('_get', (any: any, path: string, defaultValue = '') => {
    return _.get(any, path, defaultValue)
  })

  Vue.filter('permission', (val: string) => permissionHelper.check(val))
}

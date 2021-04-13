import { textHelpers } from '@/helpers/text-helper'
import { authStore } from '@/stores/auth-store'
import _, { isEmpty } from 'lodash'
import moment from 'moment'
import { ComradeModel } from './comrade-model'
import { DepartmentModel } from './department-model'
import { FileModel } from './file-model'
import { TaskPermissionConfig } from './position-model'
import { canChangeRequest, RequestModel } from './request-model'
import { UnitModel } from './unit-model'

export interface TaskModel {
  id?: string
  title?: string
  code?: string
  description?: string
  priority?: TaskPriorityType
  state?: TaskStateType
  status?: TaskApprovementStatusType
  type?: TaskDeadlineType

  executedUnit?: string | UnitModel
  supportedUnits?: (string | UnitModel)[]
  supervisorUnit?: string | UnitModel

  executedDepartment?: string | DepartmentModel
  supportedDepartments?: (string | DepartmentModel)[]
  supervisorDepartment?: string | DepartmentModel

  supervisors?: (string | ComradeModel)[]
  executedComrade?: string | ComradeModel
  supportedComrades?: (string | ComradeModel)[]

  subtasks?: (string | TaskModel)[]
  parent?: string | TaskModel

  expiredDate?: string
  publishedDate?: string
  doneDate?: string

  files?: (string | FileModel)[]
  createdBy?: string | ComradeModel
  requests?: (string | Request)[]

  createdDepartment?: string | DepartmentModel
  createdUnit?: string | UnitModel

  explainState?: string
  documentInfo?: string
}

export type TaskPriorityType = 'level_1' | 'level_2' | 'level_3' | 'urgent'
export const taskPriorityNameMap: { [name in TaskPriorityType]: string } = {
  level_1: 'Mức 1',
  level_2: 'Mức 2',
  level_3: 'Mức 3',
  urgent: 'Cấp thiết'
}
export const taskPriorityNames: { type: TaskPriorityType; name: string }[] = Object.entries(taskPriorityNameMap).map(
  ([type, value]) =>
    ({
      type,
      value
    } as any)
)

export type TaskProcessingExpireType = 'inProcessing' | 'expired' | 'almostExpired'
export const taskProcessingExpireNameMap: { [name in TaskProcessingExpireType]: string } = {
  inProcessing: 'Trong hạn',
  expired: 'Quá hạn',
  almostExpired: 'Sắp hết hạn'
}
export const taskProcessingExpireNames: { type: TaskProcessingExpireType; name: string }[] = Object.entries(
  taskProcessingExpireNameMap
).map(
  ([type, value]) =>
    ({
      type,
      value
    } as any)
)

export type TaskDeadlineType = 'hasDeadline' | 'noDeadline'
export const taskDeadlineNameMap: { [name in TaskDeadlineType]: string } = {
  hasDeadline: 'Có thời hạn xử lý',
  noDeadline: 'Không có thời hạn xử lý'
}
export const taskDeadlineNames: { type: TaskDeadlineType; name: string }[] = Object.entries(taskDeadlineNameMap).map(
  ([type, value]) =>
    ({
      type,
      value
    } as any)
)

export type TaskApprovementStatusType = 'approving' | 'approved' | 'rejected' | 'reopen'
export const taskApprovementStatusNameMap: { [name in TaskApprovementStatusType]: string } = {
  approving: 'Chờ phê duyệt',
  approved: 'Đã phê duyệt',
  rejected: 'Trả lại',
  reopen: 'Mở lại'
}
export const taskApprovementStatusNames: { type: TaskApprovementStatusType; name: string }[] = Object.entries(
  taskApprovementStatusNameMap
).map(
  ([type, value]) =>
    ({
      type,
      value
    } as any)
)
export type RequestType = TaskStateType | 'returned' | 'extended' | TaskApprovementStatusType
export type TaskStateType = 'waiting' | 'todo' | 'doing' | 'done' | 'recovered'
export const taskStateNameMap: { [name in TaskStateType]: string } = {
  waiting: 'Chưa cập nhật tiến độ',
  todo: 'Chưa thực hiện',
  doing: 'Đang thực hiện',
  done: 'Đã hoàn thành',
  recovered: 'Bị thu hồi'
}
export const taskStateNames: { type: TaskStateType; name: string }[] = Object.entries(taskStateNameMap).map(
  ([type, value]) =>
    ({
      type,
      value
    } as any)
)

export type TaskRouteType =
  | 'task-created'
  | 'task-assigned'
  | 'task-following'
  | 'task-expired'
  | 'task-unfinished'
  | 'task-approving'
  | 'task-support'
  | 'task-done'
export const taskRouteNameMap: { [name in TaskRouteType]: string } = {
  'task-created': 'Nhiệm vụ giao',
  'task-assigned': 'Được giao',
  'task-expired': 'Đã quá hạn',
  'task-unfinished': 'Chưa hoàn thành',
  'task-approving': 'Chờ xác nhận',
  'task-following': 'Đang theo dõi',
  'task-support': 'Phối hợp',
  'task-done': 'Đã hoàn thành'
}
export const taskRouteNames: { type: TaskRouteType; name: string }[] = Object.entries(taskRouteNameMap).map(
  ([type, name]) =>
    ({
      type,
      name
    } as any)
)

export const createTaskBody = (task: TaskModel, changes: TaskModel) => {
  // calculate keywords only
  const t = { ...task, ...changes }
  const keywords = [t.code, t.description, t.documentInfo, t.title, t.explainState]
    .map(x => textHelpers.clearUnicode(x))
    .join(' | ')
  return { ...changes, keywords }
}
export const taskTypeToFilterParams = (taskType: TaskRouteType, includeChildren = true): any[] => {
  const resultParams = []

  const { department, unit, ministry } = authStore.unitParams
  const comradeUnitId = (authStore.comrade.unit as UnitModel)?.id

  const comradeOwnerAndAssigned = {}

  let leaderOwnerAndAssigned = {}
  let leaderOwnerParam = {}
  let leaderAssignedParam = {}
  let leaderSupervisosParam = {}
  let leaderSupportParam = {}
  let exlucdeChildren = {}
  if (authStore.isLeader) {
    if (department) {
      leaderOwnerParam = { _or: [{ createdDepartment: department }, { createdBy: authStore.comrade.id }] }
      leaderAssignedParam = { _or: [{ executedDepartment: department }, { executedComrade: authStore.comrade.id }] }
      leaderOwnerAndAssigned = {
        _or: [
          { createdDepartment: department },
          { createdBy: authStore.comrade.id },
          { executedDepartment: department },
          { executedComrade: authStore.comrade.id }
        ]
      }
      leaderSupervisosParam = {
        _or: [{ supervisorDepartment: department }, { supervisors_contains: authStore.comrade.id }]
      }
      leaderSupportParam = {
        _or: [{ supportedDepartments_contains: department }, { supportedComrades_contains: authStore.comrade.id }]
      }
    } else if (comradeUnitId) {
      leaderOwnerParam = { _or: [{ createdUnit: comradeUnitId }, { createdBy: authStore.comrade.id }] }
      leaderAssignedParam = { _or: [{ executedUnit: comradeUnitId }, { executedComrade: authStore.comrade.id }] }
      leaderOwnerAndAssigned = {
        _or: [
          { createdUnit: comradeUnitId },
          { createdBy: authStore.comrade.id },
          { executedUnit: comradeUnitId },
          { executedComrade: authStore.comrade.id }
        ]
      }
      leaderSupervisosParam = {
        _or: [{ supervisorUnit: comradeUnitId }, { supervisors_contains: authStore.comrade.id }]
      }
      leaderSupportParam = {
        _or: [{ supportedUnits_contains: comradeUnitId }, { supportedComrades_contains: authStore.comrade.id }]
      }
      exlucdeChildren = { createdDepartment_null: true }
    }
  }

  switch (taskType) {
    case 'task-created':
      if (authStore.isLeader) {
        resultParams.push(leaderOwnerParam)
      } else {
        resultParams.push({ createdBy: authStore.comrade.id })
      }
      if (!includeChildren && !isEmpty(exlucdeChildren)) resultParams.push(exlucdeChildren)
      break
    case 'task-assigned':
      if (authStore.isLeader) {
        resultParams.push(leaderAssignedParam)
      } else {
        resultParams.push({ executedComrade: authStore.comrade.id })
      }
      if (!includeChildren && !isEmpty(exlucdeChildren)) resultParams.push(exlucdeChildren)
      break
    case 'task-following':
      if (authStore.isLeader) {
        resultParams.push(leaderSupervisosParam)
      } else {
        resultParams.push({ supervisors_contains: authStore.comrade.id })
      }
      break
    case 'task-support':
      if (authStore.isLeader) {
        resultParams.push(leaderSupportParam)
      } else {
        resultParams.push({ supportedComrades_contains: authStore.comrade.id })
      }
      break
    case 'task-expired':
      resultParams.push({ type: 'hasDeadline', expiredDate_lt: moment().toISOString() })
      if (authStore.isLeader) {
        resultParams.push(leaderOwnerAndAssigned)
      } else {
        resultParams.push(comradeOwnerAndAssigned)
      }
      break
    case 'task-approving':
      resultParams.push({ state: 'done', status: 'approving' })
      if (authStore.isLeader) {
        resultParams.push(leaderOwnerAndAssigned)
      } else {
        resultParams.push(comradeOwnerAndAssigned)
      }
      break
    case 'task-done':
      resultParams.push({ state: 'done', status: 'approved' })
      if (authStore.isLeader) {
        resultParams.push(leaderOwnerAndAssigned)
      } else {
        resultParams.push(comradeOwnerAndAssigned)
      }
      break
    case 'task-unfinished':
      resultParams.push({ state_ne: 'done' })
      if (authStore.isLeader) {
        resultParams.push(leaderOwnerAndAssigned)
      } else {
        resultParams.push(comradeOwnerAndAssigned)
      }
      break
    default:
      console.error(`not support ${taskType}`)
      break
  }

  return resultParams
}

export const getLastRequest = (task: TaskModel) => {
  const updateTaskTypes: RequestType[] = ['doing', 'todo', 'waiting', 'done']
  const requestsFilter = task.requests.filter(r => updateTaskTypes.includes(_.get(r, 'type')))
  const lastest = _.maxBy(requestsFilter, r => moment(_.get(r, 'created_at'))) as RequestModel

  if (lastest && updateTaskTypes.includes(_.get(lastest, 'type')) && task.state === lastest.type) return lastest
  else return null
}

export const isAssignedTask = (task: TaskModel) => {
  // self created
  if ((task.executedComrade as ComradeModel)?.id === authStore.comrade.id) return true
  if (!authStore.isLeader) return false

  // leader
  const { department, unit, ministry } = authStore.unitParams
  if (department) return department === (task.executedDepartment as DepartmentModel)?.id
  if (unit) return unit === (task.executedUnit as UnitModel)?.id
  if (ministry) return ministry === (task.executedUnit as UnitModel)?.id
  return false
}

export const isOwnerTask = (task: TaskModel) => {
  // self created
  if ((task.createdBy as ComradeModel)?.id === authStore.comrade.id) return true
  if (!authStore.isLeader) return false

  // leader
  const { department, unit, ministry } = authStore.unitParams
  if (department) return department === (task.createdDepartment as DepartmentModel)?.id
  if (unit) return unit === (task.createdUnit as UnitModel)?.id
  if (ministry) return ministry === (task.createdUnit as UnitModel)?.id
  return false
}

export type TaskActionType =
  | 'edit'
  | 'revoke'
  | 'extend'
  | 'return'
  | 'assign'
  | 'approve'
  | 'update'
  | 'modify-update'
  | 'delete-update'
  | 'reopen'
  | 'delete'
  | 'read' // sub-task only

export interface TaskActionConfig {
  icon: string
  type: TaskActionType
  requiredLeader?: boolean
  title: string
  permission: keyof TaskPermissionConfig
  checkEnable: (task: TaskModel, route: TaskRouteType) => boolean
}

export const actionConfigs: TaskActionConfig[] = [
  {
    permission: 'edit',
    type: 'edit',
    icon: 'edit',
    title: 'Cập nhật thông tin',
    checkEnable: t => t.status !== 'approved' && isOwnerTask(t) && t.state === 'waiting'
  },
  {
    permission: 'revoke',
    type: 'revoke',
    icon: 'replay',
    title: 'Thu hồi nhiệm vụ',
    checkEnable: t => t.status !== 'approved' && isOwnerTask(t) && t.state !== 'recovered'
  },
  {
    permission: 'extend',
    type: 'extend',
    icon: 'access_time',
    title: 'Gia hạn nhiệm vụ',
    checkEnable: function(t) {
      return (
        t.status !== 'approved' &&
        isOwnerTask(t) &&
        t.type === 'hasDeadline' &&
        !['done', 'recovered'].includes(t.state)
      )
    }
  },
  {
    permission: 'return',
    type: 'return',
    icon: 'replay',
    title: 'Trả lại nhiệm vụ',
    checkEnable: t => t.status !== 'approved' && isAssignedTask(t) && t.state === 'waiting'
  },
  {
    permission: 'assign',
    type: 'assign',
    icon: 'pan_tool',
    title: 'Giao thực hiện',
    checkEnable: t => t.status !== 'approved' && t.state !== 'recovered' && isOwnerTask(t)
  },
  {
    permission: 'approve',
    type: 'approve',
    icon: 'offline_pin',
    title: 'Phê duyệt nhiệm vụ',
    checkEnable: t => t.status === 'approving' && isOwnerTask(t) && t.state === 'done'
  },
  {
    permission: 'update',
    type: 'update',
    icon: 'account_box',
    title: 'Cập nhật tiến độ',
    checkEnable: t => t.status !== 'approved' && t.state !== 'recovered' && isAssignedTask(t)
  },
  {
    permission: 'update',
    type: 'modify-update',
    icon: 'edit',
    title: 'Sửa cập nhật',
    checkEnable: t =>
      t.status !== 'approved' && t.state !== 'recovered' && isAssignedTask(t) && canChangeRequest(getLastRequest(t))
  },
  {
    permission: 'update',
    type: 'delete-update',
    icon: 'delete',
    title: 'Xóa cập nhật',
    checkEnable: t =>
      t.status !== 'approved' && t.state !== 'recovered' && isAssignedTask(t) && canChangeRequest(getLastRequest(t))
  },
  {
    permission: 'reopen',
    type: 'reopen',
    icon: 'lock_open',
    title: 'Mở lại nhiệm vụ',
    checkEnable: t => t.status === 'approved' && isOwnerTask(t) && t.state === 'done'
  },
  {
    permission: 'delete',
    type: 'delete',
    icon: 'delete',
    title: 'Xóa nhiệm vụ',
    checkEnable: task => _.isEmpty(task.executedUnit) && _.isEmpty(task.executedComrade) && task.status !== 'approved'
  }
]
// HACK: mock allow all
// actionConfigs.forEach(ac => (ac.checkEnable = () => true))

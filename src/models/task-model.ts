import { textHelpers } from '@/helpers/text-helper'
import { authStore } from '@/stores/auth-store'
import _ from 'lodash'
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
  supportedDepartment?: string | DepartmentModel
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

export type TaskApprovementStatusType = 'approving' | 'approved' | 'rejected'
export const taskApprovementStatusNameMap: { [name in TaskApprovementStatusType]: string } = {
  approving: 'Chờ phê duyệt',
  approved: 'Đã phê duyệt',
  rejected: 'Trả lại'
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
export type RequestType = TaskStateType | 'returned' | 'extended'
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
export const taskTypeToFilterParams = (taskType: TaskRouteType): any[] => {
  const unitPrams = authStore.unitParams

  const leaderParams = { _or: [] as any[] }
  if (authStore.isLeader) {
    if (unitPrams.department) {
      leaderParams._or = [{ createdDepartment: unitPrams.department }]
    } else if (unitPrams.unit) {
      leaderParams._or = [{ createdUnit: unitPrams.unit }, { executedUnit: unitPrams.unit }]
    } else if (unitPrams.ministry) {
      leaderParams._or = [{ createdUnit: unitPrams.ministry }]
    }
  }

  let params: any[] = []
  let taskParams: TaskModel = {}

  switch (taskType) {
    case 'task-created':
      if (authStore.isLeader) {
        params = [leaderParams]
      } else {
        taskParams = { createdBy: authStore.comrade.id }
      }
      break
    case 'task-assigned':
      taskParams.executedComrade = authStore.comrade.id
      break
    case 'task-following':
      _.set(taskParams, 'supervisors_contains', authStore.comrade.id)
      break
    case 'task-support':
      _.set(taskParams, 'supportedComrades_contains', authStore.comrade.id)
      break
    case 'task-expired':
      taskParams.type = 'hasDeadline'
      _.set(taskParams, 'expiredDate_lt', moment().toISOString())
      if (authStore.isLeader) {
        params = [leaderParams]
      } else {
        taskParams.createdBy = authStore.comrade.id
      }
      break
    case 'task-approving':
      taskParams.state = 'done'
      taskParams.status = 'approving'
      if (authStore.isLeader) {
        params = [leaderParams]
      } else {
        taskParams.createdBy = authStore.comrade.id
      }
      break
    case 'task-done':
      taskParams.state = 'done'
      if (authStore.isLeader) {
        params = [leaderParams]
      } else {
        taskParams.createdBy = authStore.comrade.id
      }
      break
    case 'task-unfinished':
      _.set(taskParams, 'state_ne', 'done')
      if (authStore.isLeader) {
        params = [leaderParams]
      } else {
        taskParams.createdBy = authStore.comrade.id
      }
      break
    default:
      console.error(`not support ${taskType}`)
      break
  }
  return _.isEmpty(taskParams) ? params : [...params, taskParams]
}

export const getLastRequest = (task: TaskModel) => {
  const updateTaskTypes: RequestType[] = ['doing', 'todo', 'waiting', 'done']
  const lastest = _.maxBy(task.requests, r => moment(_.get(r, 'created_at'))) as RequestModel

  if (lastest && updateTaskTypes.includes(_.get(lastest, 'type'))) return lastest
  else return null
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
    checkEnable: task => task.state === 'waiting'
  },
  {
    permission: 'revoke',
    type: 'revoke',
    icon: 'replay',
    title: 'Thu hồi nhiệm vụ',
    checkEnable: task => task.state !== 'recovered'
  },
  {
    permission: 'extend',
    type: 'extend',
    icon: 'access_time',
    title: 'Gia hạn nhiệm vụ',
    checkEnable: task => task.type === 'hasDeadline' && task.state !== 'done' && task.state !== 'recovered'
  },
  {
    permission: 'return',
    type: 'return',
    icon: 'replay',
    title: 'Trả lại nhiệm vụ',
    checkEnable: task => task.state === 'waiting' && (task.createdBy as ComradeModel).id !== authStore.comrade.id
  },
  {
    permission: 'assign',
    type: 'assign',
    icon: 'pan_tool',
    title: 'Giao thực hiện',
    checkEnable: () => true
  },
  {
    permission: 'approve',
    type: 'approve',
    icon: 'offline_pin',
    title: 'Phê duyệt nhiệm vụ',
    checkEnable: t => t.state === 'done' && t.status === 'approving'
  },
  {
    permission: 'update',
    type: 'update',
    icon: 'account_box',
    title: 'Cập nhật tiến độ',
    checkEnable: task => _.get(task.executedComrade, 'id') === authStore.comrade.id
  },
  {
    permission: 'update',
    type: 'modify-update',
    icon: 'edit',
    title: 'Sửa cập nhật',
    checkEnable: task =>
      _.get(task.executedComrade, 'id') === authStore.comrade.id && canChangeRequest(getLastRequest(task))
  },
  {
    permission: 'update',
    type: 'delete-update',
    icon: 'delete',
    title: 'Xóa cập nhật',
    checkEnable: task =>
      _.get(task.executedComrade, 'id') === authStore.comrade.id && canChangeRequest(getLastRequest(task))
  },
  {
    permission: 'reopen',
    type: 'reopen',
    icon: 'lock_open',
    title: 'Mở lại nhiệm vụ',
    checkEnable: task => task.state === 'done' && task.status === 'approved'
  },
  {
    permission: 'delete',
    type: 'delete',
    icon: 'delete',
    title: 'Xóa nhiệm vụ',
    checkEnable: task => _.isEmpty(task.executedUnit) && _.isEmpty(task.executedComrade)
  }
]

// HACK: mock allow all
// actionConfigs.forEach(ac => (ac.checkEnable = () => true))

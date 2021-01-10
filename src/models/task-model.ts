import { ComradeModel } from './comrade-model'
import { DepartmentModel } from './department-model'
import { UnitModel } from './unit-model'

export interface TaskModel {
  id?: string
  title?: string
  code?: string
  description?: string
  priority?: string | TaskPriorityType
  state?: TaskApprovementStateType
  status?: TaskStatusType
  type?: string

  executedUnit?: string | UnitModel
  supportedUnits?: string[] | UnitModel[]
  supervisorUnit?: string | UnitModel

  executeDepartment?: string | DepartmentModel
  supportedDepartment?: string | DepartmentModel
  supervisorDepartment?: string | DepartmentModel

  supervisors?: string[] | ComradeModel[]
  executedComrade?: string | ComradeModel
  supportedComrades?: string[] | ComradeModel[]

  subtasks?: string[] | TaskModel[]
  parent?: string | TaskModel

  expiredDate?: string
  publishedDate?: string

  files?: string[]
  // requests?: string[] | Request[]
}

export type TaskPriorityType = 'level_1' | 'level_2' | 'level_3' | 'urgent'
export const taskPriorityNames: { type: TaskPriorityType; name: string }[] = [
  { type: 'level_1', name: 'Mức 1' },
  { type: 'level_2', name: 'Mức 2' },
  { type: 'level_3', name: 'Mức 3' },
  { type: 'urgent', name: 'Cấp thiết' }
]

export type TaskProcessingExpireType = 'inProcessing' | 'expired' | 'almostExpired'
export const taskProcessingExpireNames: { type: TaskProcessingExpireType; name: string }[] = [
  { type: 'inProcessing', name: 'Trong hạn' },
  { type: 'expired', name: 'Quá hạn' },
  { type: 'almostExpired', name: 'Sắp hết hạn' }
]

export type TaskApprovementStateType = 'pending' | 'approved'
export const taskStateNames: { type: TaskApprovementStateType; name: string }[] = [
  { type: 'pending', name: 'Chờ phê duyệt' },
  { type: 'approved', name: 'Đã phê duyệt' }
]

export type TaskApprovementStatusType = 'approve' | 'return'

export type TaskStatusType = 'toDo' | 'open' | 'doing' | 'done'
export const taskStatusNames: { type: TaskStatusType; name: string }[] = [
  { type: 'toDo', name: 'Chưa thực hiện' },
  { type: 'open', name: 'Chưa cập nhật tiến độ' },
  { type: 'doing', name: 'Đang thực hiện' },
  { type: 'done', name: 'Đã hoàn thành' }
]

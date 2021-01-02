
export interface TaskModel {
    id?: string
    title: string
    description: string
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

export type TaskStateType = 'pending' | 'approved'
export const taskStateNames: { type: TaskStateType; name: string }[] = [
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

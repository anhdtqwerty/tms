
export interface TaskModel {
    id?: string
    title: string
    description: string
  }

export type TaskPriorityType = 'level_1' | 'level_2' | 'level_3' | 'urgent'
export type TaskProcessingExpireType = 'inProcessing' | 'expired' | 'almostExpired'
export type TaskStateType = 'pending' | 'approved'
export type TaskStatusType = 'toDo' | 'open' | 'doing' | 'done'

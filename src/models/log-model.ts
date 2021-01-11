import { ApiLogType, ApiRouteType } from '@/services/api-service'
import { ComradeModel } from './comrade-model'

export interface LogModel {
  id?: string
  comrade?: string | ComradeModel
  action?: ApiLogType
  feature?: ApiRouteType
  description?: string
  updated_at?: string
  created_at?: string
}

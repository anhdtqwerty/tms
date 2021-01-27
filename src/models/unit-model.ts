import { ComradeModel } from './comrade-model'
import { DepartmentModel } from './department-model'

export interface UnitModel {
  id?: string
  title: string
  code: string
  email: string
  phone: string
  description: string
  config?: {}
  metadata?: {}
  data?: {
    address?: string
  }
  departments?: string[] | DepartmentModel[]
  type?: 'ministry' | 'unit'
  comrades?: (string | ComradeModel)[]
}

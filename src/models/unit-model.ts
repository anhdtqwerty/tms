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
  data?: {}
  departments?: string[] | DepartmentModel[]
  type: 'ministry' | 'unit'
}

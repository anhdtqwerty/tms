import { UnitModel } from './unit-model'

export interface DepartmentModel {
  id?: string
  title: string
  code: string
  email: string
  phone?: string
  description: string
  comrades?: string[]
  unit?: string | UnitModel
  config?: {}
  metadata?: {}
}

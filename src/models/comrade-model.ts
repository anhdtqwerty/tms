import { UserModel } from './auth-model'
import { DepartmentModel } from './department-model'
import { FileModel } from './file-model'
import { PositionModel } from './position-model'
import { UnitModel } from './unit-model'

export class ComradeModel {
  id?: string
  name: string
  avatar?: string | FileModel
  code: string
  phone: string
  email: string
  data: {
    sex: ComradeSex
    title: string
    bod: string
  }
  department?: string | DepartmentModel
  unit?: string | UnitModel
  metadata?: any
  config?: any
  group?: string | PositionModel
  position?: string | PositionModel
  executeComrade?: string | ComradeModel
  suportComrade?: string | ComradeModel
  supervisorComrade?: string | ComradeModel
  user?: string | UserModel
}

export type ComradeSex = 'male' | 'female'

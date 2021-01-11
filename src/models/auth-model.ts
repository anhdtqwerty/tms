import { ComradeModel } from './comrade-model'

export interface UserModel {
  id?: string
  username?: string
  email?: string
  provider?: string
  password?: string
  blocked?: boolean
  createdAt?: Date
  updatedAt?: Date
  comrade?: string | ComradeModel
}

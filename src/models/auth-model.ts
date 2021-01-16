import { ComradeModel } from './comrade-model'

export interface UserModel {
  id?: string
  username?: string
  email?: string
  provider?: string
  password?: string
  blocked?: boolean
  updated_at?: string
  created_at?: string
  comrade?: string | ComradeModel
}

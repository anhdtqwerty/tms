export interface UserModel {
  id?: string
  username?: string
  email?: string
  provider?: string
  password?: string
  blocked?: boolean
  createdAt?: Date
  updatedAt?: Date
}

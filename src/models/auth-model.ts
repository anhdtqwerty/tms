export interface UserModel {
  confirmed?: boolean
  blocked?: boolean
  _id?: string
  username?: string
  status?: string
  email?: string
  provider?: string
  name?: string
  createdAt?: Date
  updatedAt?: Date
  __v?: number
  // department?: Department
  // role?: Role
  staff?: string
  username_indexing?: string
  username_no?: number
  id?: string
  // FIXME: fake
  comrade?: string
  position?: string
  department?: string
}

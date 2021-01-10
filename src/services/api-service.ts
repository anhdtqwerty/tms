import { UserModel } from '@/models/auth-model'
import Axios, { AxiosInstance } from 'axios'
import { reaction } from 'mobx'
import { UnitModel } from '@/models/unit-model'
import { DepartmentModel } from '@/models/department-model'
import { authStore } from '@/stores/auth-store'
import qs from 'qs'
import { PositionModel } from '@/models/position-model'
import { ComradeModel } from '@/models/comrade-model'
import { set } from 'vue/types/umd'
import { TaskModel } from '@/models/task-model'

export class ApiHandler<T> {
  constructor(private route: string, private axios: AxiosInstance) {}

  async count(params?: any): Promise<number> {
    const res = await this.axios.get(`${this.route}/count`, { params })
    return res.data
  }

  async create(model: T): Promise<T> {
    const res = await this.axios.post(this.route, model)
    return res.data
  }

  async delete(id: any): Promise<T> {
    const res = await this.axios.delete(`${this.route}/${id}`)
    return res.data
  }

  async find<T>(
    params?: any,
    settings: boolean | { _sort?: string; _limit?: number; _start?: number } = true
  ): Promise<T[]> {
    if (settings !== false) {
      const settingDefault = { _sort: 'created_at:DESC', _limit: 25, _start: 0 }
      params = { ...settingDefault, ...(params ?? {}) }
      if (typeof settings === 'object') {
        params = { ...settings, ...params }
      }
    }
    const res = await this.axios.get(this.route, { params })
    return res.data
  }

  async findOne<T>(id: any): Promise<T> {
    const res = await this.axios.get(`${this.route}/${id}`)
    return res.data
  }

  async update(id: any, model: T): Promise<T> {
    const res = await this.axios.put(`${this.route}/${id}`, model)
    return res.data
  }
}

export class ApiService {
  axios = Axios.create({ baseURL: process.env.VUE_APP_API_ENDPOINT })

  user = new ApiHandler<UserModel>('users', this.axios)
  unit = new ApiHandler<UnitModel>('units', this.axios)
  department = new ApiHandler<DepartmentModel>('departments', this.axios)
  position = new ApiHandler<PositionModel>('positions', this.axios)
  comarde = new ApiHandler<ComradeModel>('comrades', this.axios)
  task = new ApiHandler<TaskModel>('tasks', this.axios)

  constructor() {
    this.setupAuthInjector()
  }

  setupAuthInjector() {
    let jwtToken: string
    reaction(
      () => authStore.jwt,
      jwt => (jwtToken = jwt),
      { fireImmediately: true }
    )
    this.axios.interceptors.request.use(config => {
      if (jwtToken) {
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${jwtToken}`
        }
      }
      config.paramsSerializer = params => qs.stringify(params, { arrayFormat: 'repeat' })
      return config
    })
  }

  async login(username: string, password: string): Promise<{ jwt: string; user: UserModel }> {
    const res = await this.axios.post('/auth/local', { identifier: username, password })
    return res.data
  }

  async forgotPassword(email: string): Promise<any> {
    await this.axios.post('/auth/forgot-password', { email })
  }

  async resetPassword(code: string, password: string, passwordConfirmation: string): Promise<any> {
    await this.axios.post('/auth/reset-password', {
      code,
      password,
      passwordConfirmation
    })
  }
}

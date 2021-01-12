import { UserModel } from '@/models/auth-model'
import Axios, { AxiosInstance } from 'axios'
import { reaction } from 'mobx'
import { UnitModel } from '@/models/unit-model'
import { DepartmentModel } from '@/models/department-model'
import { authStore } from '@/stores/auth-store'
import qs from 'qs'
import { PositionModel } from '@/models/position-model'
import { ComradeModel } from '@/models/comrade-model'
import { TaskModel } from '@/models/task-model'
import { LogModel } from '@/models/log-model'
import _ from 'lodash'
import Bowser from 'bowser'

export type ApiLogType = 'create' | 'delete' | 'update'
export const apiLogNames: { [name in ApiLogType]: string } = {
  create: 'Thêm mới',
  delete: 'Xóa',
  update: 'Cập nhật'
}
export type ApiRouteType = 'users' | 'units' | 'departments' | 'positions' | 'comrades' | 'tasks' | 'logs'
export const ApiRouteNames: { [name in ApiRouteType]: string } = {
  users: 'người dùng',
  units: 'đơn vị',
  departments: 'phòng ban',
  positions: 'vai trò',
  comrades: 'người dùng',
  tasks: 'nhiệm vụ',
  logs: 'log'
}

const browser = Bowser.getParser(window.navigator.userAgent)
export class ApiHandler<T> {
  constructor(private route: ApiRouteType, private axios: AxiosInstance, private allowLog = true) {}

  async count(params?: any): Promise<number> {
    const res = await this.axios.get(`${this.route}/count`, { params })
    return res.data
  }

  async create(model: T, options?: { logMessage: string }): Promise<T> {
    const res = await this.axios.post(this.route, model)
    if (this.allowLog) {
      this.log('create', options?.logMessage, res.data)
    }
    return res.data
  }

  async delete(id: any, options?: { logMessage: string }): Promise<T> {
    const res = await this.axios.delete(`${this.route}/${id}`)
    if (this.allowLog) {
      this.log('delete', options?.logMessage, res.data)
    }
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

  async update(id: any, model: T, options?: { logMessage: string }): Promise<T> {
    const res = await this.axios.put(`${this.route}/${id}`, model)
    if (this.allowLog) {
      this.log('update', options?.logMessage, res.data)
    }
    return res.data
  }

  private async log(action: ApiLogType, description: string = undefined, model: any) {
    try {
      const id = _.get(model, 'id')
      const code = _.get(model, 'code')
      const title = _.get(model, 'title')
      const name = _.get(model, 'name')
      const ds = []
      if (id) ds.push(`id: ${id}`)
      if (code) ds.push(`code: ${code}`)
      if (title) ds.push(`title: ${title}`)
      if (name) ds.push(`name: ${name}`)
      await this.axios.post('logs', {
        action,
        feature: this.route,
        comrade: authStore.comrade?.id,
        description: description ?? ds.length > 0 ? ds.join(', ') : undefined,
        data: {
          ip: authStore.ipAdress,
          browser: browser.getBrowser().name
        }
      })
    } catch (error) {
      console.error('api-log', error)
    }
  }
}

export class ApiService {
  axios = Axios.create({ baseURL: process.env.VUE_APP_API_ENDPOINT })

  user = new ApiHandler<UserModel>('users', this.axios, false)
  log = new ApiHandler<LogModel>('logs', this.axios, false)

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

  async uploadFiles(files: any, model: ApiRouteType, modelId: string, modelField: string) {
    const formData = new FormData()
    formData.append('files', files)
    formData.append('refId', modelId)
    formData.append('ref', model)
    formData.append('field', modelField)
    const res = await this.axios.post('upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return res.data
  }

  async deleteFile(id: any) {
    const res = await this.axios.delete(`upload/files/${id}`)
    return res.data
  }

  async getFile(id: any) {
    const res = await this.axios.get(`upload/files/${id}`)
    return res.data
  }
}

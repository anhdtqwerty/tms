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
import { RequestModel } from '@/models/request-model'
import { TaskStatModel } from '@/models/report-model'
import { appProvider } from '@/app-provider'
import { MailModel } from '@/helpers/mail-helper'
import { ConfigModel } from '@/models/config-model'

export type ApiLogType = 'create' | 'delete' | 'update'
export const apiLogNames: { [name in ApiLogType]: string } = {
  create: 'Thêm mới',
  delete: 'Xóa',
  update: 'Cập nhật'
}
export type ApiTableType = 'user' | 'unit' | 'department' | 'position' | 'comrade' | 'task' | 'log' | 'request'
export type ApiRouteType =
  | 'users'
  | 'units'
  | 'departments'
  | 'positions'
  | 'comrades'
  | 'tasks'
  | 'logs'
  | 'requests'
  | 'config'
export const ApiRouteNames: { [name in ApiRouteType]: string } = {
  users: 'người dùng',
  units: 'đơn vị',
  departments: 'phòng ban',
  positions: 'vai trò',
  comrades: 'người dùng',
  tasks: 'nhiệm vụ',
  logs: 'log',
  requests: 'lịch sử',
  config: 'cấu hình hệ thống'
}

const browser = Bowser.getParser(window.navigator.userAgent)
let ipAddress = ''
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

  async find<T>(params?: any, settings: { _sort?: string; _limit?: number; _start?: number } = {}): Promise<T[]> {
    const settingDefault = { _sort: 'created_at:DESC', _limit: 25, _start: 0 }
    params = { ...settingDefault, ...settings, ...(params ?? {}) }
    const res = await this.axios.get(this.route, { params })
    return res.data
  }

  async findOne<T>(id: any): Promise<T> {
    let res: any
    if (id) {
      res = await this.axios.get(`${this.route}/${id}`)
    } else {
      res = await this.axios.get(`${this.route}`)
    }
    return res.data
  }

  async update(id: any, model: T, options?: { logMessage: string }): Promise<T> {
    let res: any
    if (id) {
      res = await this.axios.put(`${this.route}/${id}`, model)
    } else {
      res = await this.axios.put(`${this.route}`, model)
    }
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
          ip: ipAddress,
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
  request = new ApiHandler<RequestModel>('requests', this.axios, false)
  configs = new ApiHandler<{ data: any }>('config', this.axios, false)

  constructor() {
    this.setupAuthInjector()
    this.getIpAddress()
  }

  setupAuthInjector() {
    let jwtToken: string
    reaction(
      () => authStore.jwt,
      jwt => (jwtToken = jwt),
      { fireImmediately: true }
    )
    this.axios.interceptors.request.use(config => {
      appProvider.loading.increaseRequest()
      if (jwtToken) {
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${jwtToken}`
        }
      }
      config.paramsSerializer = params => {
        if ('_where' in params) return qs.stringify(params)
        else return qs.stringify(params, { arrayFormat: 'repeat' })
      }
      return config
    })
    this.axios.interceptors.response.use(
      res => {
        appProvider.loading.decreaseRequest()
        return res
      },
      err => {
        appProvider.loading.decreaseRequest()
        if (_.get(err, 'response.status') === 401) {
          appProvider.onLogout()
        }
        throw err
      }
    )
  }

  async login(username: string, password: string): Promise<{ jwt: string; user: UserModel }> {
    const res = await this.axios.post('/auth/local', { identifier: username, password })
    return res.data
  }

  async forgotPassword(email: string): Promise<any> {
    await this.axios.post('/auth/forgot-password', { email })
  }

  async resetPassword(code: string, password: string, passwordConfirmation: string): Promise<any> {
    const res = await this.axios.post('/auth/reset-password', {
      code,
      password,
      passwordConfirmation
    })
    return res.data
  }

  async uploadFiles(files: any, relation?: { model: ApiTableType; modelId: string; modelField: string }) {
    const formData = new FormData()
    formData.append('files', files)

    if (relation) {
      formData.append('refId', relation.modelId)
      formData.append('ref', relation.model)
      formData.append('field', relation.modelField)
    }

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

  async getDepartmentsTaskReport(params?: {
    from?: string
    to?: string
    unit?: string
    department?: string
    joinUnitBy?: 'executedUnit' | 'createdUnit'
    joinBy?: 'executedDepartment' | 'createdDepartment' | 'executedUnit' | 'createdUnit'
  }): Promise<TaskStatModel[]> {
    const res = await this.axios.get(`tasks/department/statistic`, { params })
    return res.data
  }

  async getUnitsTaskReport(params?: {
    from?: string
    to?: string
    joinUnitBy?: 'executedUnit' | 'createdUnit'
    joinBy?: 'executedUnit' | 'createdUnit'
    ministry: string
  }): Promise<TaskStatModel[]> {
    const res = await this.axios.get(`tasks/unit/statistic`, { params })
    return res.data
  }

  async getComradeTaskReport(params: {
    from?: string
    to?: string
    comrade?: string
    department?: string
    joinDepartmentBy?: 'executedDepartment' | 'createdDepartment'
    joinBy?: 'executedComrade' | 'createdBy'
  }): Promise<TaskStatModel[]> {
    const res = await this.axios.get(`tasks/comrade/statistic`, { params })
    return res.data
  }

  async getIpAddress() {
    try {
      const res = await this.axios.get('config/ip')
      ipAddress = _.get(res.data, 'request.header.x-forwarded-for')
    } catch (error) {
      console.error('getIpAddress', error)
    }
  }

  async sendMail(mail: MailModel) {
    if (process.env.NODE_ENV !== 'development') {
      const res = await this.axios.post('email', mail)
      return res.data
    }
    return null
  }

  async getConfig(): Promise<ConfigModel> {
    const res = await this.axios.get('config')
    return res.data
  }

  async updateConfig(model: ConfigModel) {
    const res = await this.axios.put('config', model)
    return res.data
  }

  async deleteUnit(unit: UnitModel) {
    const { api, snackbar, alert } = appProvider
    let err = ''

    if (await alert.confirmDelete('Đơn vị')) {
      try {
        if (unit.comrades.length) {
          err = 'người dùng'
        } else if (unit.departments.length) {
          err = 'phòng ban cấp dưới'
        } else {
          const tasks = await api.task.find<TaskModel>(
            {
              _where: {
                _or: [
                  { createdUnit: unit.id },
                  { executedUnit: unit.id },
                  { 'supportedUnits.id': unit.id },
                  { supervisorUnit: unit.id }
                ]
              }
            },
            { _limit: 1 }
          )

          if (tasks.length) {
            err = 'nhiệm vụ được giao'
          }
        }

        if (err) {
          snackbar.error(`Đơn vị đã có ${err}, bạn không thể xóa`)
        } else {
          await api.unit.delete(unit.id)
          snackbar.deleteSuccess()
          return true
        }
      } catch (error) {
        snackbar.commonError(error)
      }

      return false
    }
  }

  async deleteDepartment(department: DepartmentModel) {
    const { api, snackbar, alert } = appProvider

    if (await alert.confirmDelete('Phòng ban')) {
      try {
        if (!department.comrades.length) {
          await api.department.delete(department.id)
          snackbar.deleteSuccess()
          return true
        } else {
          snackbar.error('Phòng ban đã có người dùng, bạn không thể xóa')
        }
      } catch (error) {
        snackbar.commonError(error)
      }
    }

    return false
  }

  async deleteComrade(comrade: ComradeModel) {
    const { api, snackbar, alert } = appProvider
    let err = ''

    if (await alert.confirmDelete('Nhân viên')) {
      try {
        const tasks = await api.task.find<TaskModel>(
          {
            _where: {
              _or: [
                { createdBy: comrade.id },
                { executedComrade: comrade.id },
                { 'supportedComrades.id': comrade.id },
                { 'supervisors.id': comrade.id }
              ]
            }
          },
          { _limit: 1 }
        )

        if (tasks.length) {
          err = 'nhiệm vụ'
        } else {
          const request = await api.request.find<RequestModel>({ requestor: comrade.id, _limit: 1 })
          if (request.length) err = 'lịch sử hoạt động'
        }

        if (err) {
          snackbar.error(`Người dùng đã có ${err}, bạn không thể xóa`)
        } else {
          await Promise.all([api.comarde.delete(comrade.id), api.user.delete((comrade.user as UserModel).id)])
          snackbar.deleteSuccess()
          return true
        }
      } catch (error) {
        snackbar.commonError(error)
      }

      return false
    }
  }

  async deletePosition(position: PositionModel) {
    const { api, snackbar, alert } = appProvider

    if (await alert.confirmDelete('Vai trò')) {
      try {
        const comrades = await api.comarde.find<ComradeModel>({ position: position.id, _limit: 1 })
        if (comrades.length) {
          snackbar.error('Vai trò đã có người dùng, bạn không thể xóa')
        } else {
          await api.position.delete(position.id)
          snackbar.deleteSuccess()
          return true
        }
      } catch (error) {
        snackbar.commonError(error)
      }

      return false
    }
  }
}

export const apiService = new ApiService()

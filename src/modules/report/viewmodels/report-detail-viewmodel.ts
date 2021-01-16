import { AppProvider } from '@/app-provider'
import { textHelpers } from '@/helpers/text-helper'
import { TaskModel, TaskRouteType } from '@/models/task-model'
import _ from 'lodash'
import { observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import moment from 'moment'

export class ReportDetailViewModel {
  @observable tasks: TaskModel[] = []
  @observable totalTask = 0

  private _taskTypeParams: any = {}
  private _advanceParams: any = {}
  private _simpleParams: any = {}

  constructor(private provider: AppProvider) {
    //
  }

  changeTaskType(taskType: TaskRouteType) {
    const { authStore } = this.provider
    const params: TaskModel = {}
    switch (taskType) {
      case 'task-created':
        params.createdBy = authStore.comrade.id
        break
      case 'task-assigned':
        params.executedComrade = authStore.comrade.id
        break
      case 'task-following':
        _.set(params, 'supervisors_contains', authStore.comrade.id)
        break
      case 'task-support':
        _.set(params, 'supportedComrades_contains', authStore.comrade.id)
        break
      case 'task-expired':
        params.type = 'hasDeadline'
        _.set(params, 'expiredDate_lt', moment().toISOString())
        break
      case 'task-approving':
        params.state = 'done'
        params.status = 'approving'
        break
      case 'task-done':
        params.state = 'done'
        break
      default:
        console.error(`not support ${taskType}`)
        break
    }
    this._taskTypeParams = params
    this.search()
  }

  advanceSearch(params: any) {
    this._simpleParams = {}
    this._advanceParams = params
    this.search()
  }
  simpleSearch(keyword: string) {
    this._advanceParams = {}
    this._simpleParams = { keywords_contain: textHelpers.clearUnicode(keyword) }
    this.search()
  }

  @asyncAction *search(page = 1) {
    const params = {
      ...this._simpleParams,
      ...this._advanceParams,
      ...this._taskTypeParams,
      _start: (page - 1) * 25
    }
    const results = yield Promise.all([this.provider.api.task.find(params), this.provider.api.task.count(params)])
    this.tasks = results[0]
    this.totalTask = results[1]
  }
}

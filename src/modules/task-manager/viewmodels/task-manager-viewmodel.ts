import { AppProvider } from '@/app-provider'
import { textHelpers } from '@/helpers/text-helper'
import { TaskModel, TaskRouteType, taskTypeToFilterParams } from '@/models/task-model'
import { authStore } from '@/stores/auth-store'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class TaskManagerViewModel {
  @observable totalCount = 0
  @observable tasks: TaskModel[] = []

  private _taskTypeParams: any = {}
  private _advanceParams: any = {}
  private _simpleParams: any = {}

  constructor(private provider: AppProvider) {}

  // @asyncAction *loadData(val: TaskRouteType) {
  //   const params: any = {}
  //   switch (val) {
  //     case 'task-created':
  //       params['createdBy'] = authStore.comrade.id
  //       break
  //     case 'task-assigned':
  //       params['executedComrade'] = authStore.comrade.id
  //       break

  //     default:
  //       break
  //   }

  //   const results = yield Promise.all([this.provider.api.task.count(), this.provider.api.task.find<TaskModel>(params)])
  //   this.totalCount = results[0]
  //   this.tasks = results[1]
  // }

  changeTaskType(taskType: TaskRouteType) {
    this._taskTypeParams = taskTypeToFilterParams(taskType)
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
    this.totalCount = results[1]
  }

  @action.bound taskAdded(item: TaskModel) {
    this.tasks = [item, ...this.tasks]
    this.totalCount += 1
  }

  @action.bound taskUpdated(task: TaskModel) {
    this.tasks = this.tasks.map(t => (t.id === task.id ? task : t))
  }

  @action.bound taskDeleted(id: string) {
    this.tasks = this.tasks.filter(t => t.id !== id)
  }
}

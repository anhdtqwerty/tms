import { AppProvider } from '@/app-provider'
import { textHelpers } from '@/helpers/text-helper'
import { TaskModel } from '@/models/task-model'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class TaskDetailViewModel {
  @observable task: TaskModel = null

  @observable subtaskTotalCount = 0
  @observable subtasks: TaskModel[] = []
  private _advanceParams: any = {}
  private _simpleParams: any = {}

  constructor(private provider: AppProvider) {}

  @asyncAction *loadData(id: string) {
    console.log('detail load data', id)
    const api = this.provider.api
    const results = yield Promise.all([api.task.findOne(id)])
    this.task = results[0]

    //subtask
    const subtasksApi = yield Promise.all([
      this.provider.api.task.count({ parent: id }),
      this.provider.api.task.find<TaskModel>({ parent: id })
    ])
    this.subtaskTotalCount = subtasksApi[0]
    this.subtasks = subtasksApi[1]
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
      _start: (page - 1) * 25
    }
    const results = yield Promise.all([this.provider.api.task.find(params), this.provider.api.task.count(params)])
    this.subtasks = results[0]
    this.subtaskTotalCount = results[1]
  }

  @action.bound taskUpdated(item: TaskModel) {
    if (item.id === this.task.id) {
      // task parent
      this.task = item
    } else {
      this.subtasks = this.subtasks.map(t => (t.id === item.id ? item : t))
    }
  }

  @action.bound taskAdded(item: TaskModel) {
    this.subtasks = [item, ...this.subtasks]
    this.subtaskTotalCount += 1
  }

  @action.bound taskDeleted(id: string) {
    if (id === this.task.id) {
      // task parent
      this.provider.router.back()
    } else {
      this.subtasks = this.subtasks.filter(t => t.id !== id)
    }
  }
}

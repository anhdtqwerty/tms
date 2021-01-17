import { AppProvider } from '@/app-provider'
import { mailBuilder } from '@/helpers/mail-helper'
import { textHelpers } from '@/helpers/text-helper'
import { RequestModel } from '@/models/request-model'
import { RequestType, TaskModel, TaskStateType } from '@/models/task-model'
import { action, computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class TaskDetailViewModel {
  @observable task: TaskModel = null

  @observable subtaskTotalCount = 0
  @observable subtasks: TaskModel[] = []

  private _advanceParams: any = {}
  private _simpleParams: any = {}

  @observable requestHistories: RequestModel[] = []

  constructor(private provider: AppProvider) {
    //
  }

  @asyncAction *loadData(id: string) {
    const api = this.provider.api
    this.task = yield api.task.findOne(id)
    mailBuilder.createTask(this.task)
    this.search()
    this.loadHistories()
  }

  @asyncAction *loadHistories() {
    this.requestHistories = yield this.provider.api.request.find({ task: this.task.id }, { _limit: 100 })
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
      parent: this.task.id,
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

  @action.bound taskRecovered(item: TaskModel) {
    this.loadData(this.task.id)
  }

  @action.bound taskDeleted(id: string) {
    if (id === this.task.id) {
      // task parent
      this.provider.router.back()
    } else {
      this.subtasks = this.subtasks.filter(t => t.id !== id)
    }
  }

  @computed get progressHistory() {
    const progressTypes: RequestType[] = ['doing', 'done', 'recovered', 'todo']
    return this.requestHistories.filter(r => progressTypes.includes(r.type))
  }

  @computed get returnedHistory() {
    return this.requestHistories.filter(r => r.type === 'returned')
  }

  @computed get extendedHistory() {
    return this.requestHistories.filter(r => r.type === 'extended')
    // const progressTypes: TaskStateType[] = ['doing', 'done', 'recovered', 'todo']
    // return this.requestHistories.filter(r => progressTypes.includes(r.type))
  }
}

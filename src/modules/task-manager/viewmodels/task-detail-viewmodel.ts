import { AppProvider } from '@/app-provider'
import { excelHelper } from '@/helpers/excel-helper'
import { mailBuilder } from '@/helpers/mail-helper'
import { FileModel } from '@/models/file-model'
import { RequestModel } from '@/models/request-model'
import { createTaskBody, getLastRequest, RequestType, TaskModel, isAssignedTask } from '@/models/task-model'
import { action, computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class TaskDetailViewModel {
  @observable task: TaskModel = null

  @observable subtaskTotalCount = 0
  @observable subtasks: TaskModel[] = []

  private _advanceParams: any = {}
  private _simpleParams: any = {}

  @observable requestHistories: RequestModel[] = []
  @observable lastRequest: RequestModel = null

  constructor(private provider: AppProvider) {
    //
  }

  async exportExcel() {
    const tasks = await this.provider.api.task.find({
      ...this._simpleParams,
      ...this._advanceParams,
      parent: this.task.id,
      _limit: -1
    })
    excelHelper.task(tasks)
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
    this.lastRequest = getLastRequest(this.task)
  }

  advanceSearch(params: any) {
    this._simpleParams = {}
    this._advanceParams = params
    this.search()
  }

  simpleSearch(params: string) {
    this._advanceParams = {}
    this._simpleParams = params
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

  @action.bound fileDeleted(id: string) {
    if (this.task.files?.find(f => (f as FileModel).id === id)) {
      this.task = { ...this.task, files: (this.task.files as FileModel[]).filter(f => f.id !== id) }
    } else {
      for (const request of this.requestHistories ?? []) {
        if (request?.files?.find(f => (f as FileModel).id === id)) {
          this.requestHistories = this.requestHistories.map(r =>
            r.id !== request.id ? r : { ...r, files: r.files.filter(f => (f as FileModel).id !== id) }
          )
        }
      }
    }
  }

  @asyncAction *deleteLastRequest() {
    if (yield this.provider.alert.confirmDelete('cập nhật')) {
      if (this.lastRequest) {
        try {
          yield this.provider.api.task.update(
            this.task.id,
            createTaskBody(this.task, {
              state: this.lastRequest.data.oldTaskState
            })
          )

          try {
            yield this.provider.api.request.delete(this.lastRequest.id)
            this.provider.snackbar.success('Xóa cập nhật thành công')
            this.task = yield this.provider.api.task.findOne(this.task.id)
            yield this.loadHistories()
          } catch (error) {
            this.provider.snackbar.commonError(error)
          }
        } catch (error) {
          this.provider.snackbar.commonError(error)
        }
      }
    }
  }

  @action.bound taskUpdated(item: TaskModel, request: RequestModel) {
    if (item.id === this.task.id) {
      // task parent
      this.task = item
    } else {
      this.subtasks = this.subtasks.map(t => (t.id === item.id ? item : t))
    }

    if (request) {
      if (this.requestHistories.find(x => x.id === request.id)) {
        this.requestHistories = this.requestHistories.map(r => (r.id === request.id ? request : r))
      } else {
        this.requestHistories = [request, ...this.requestHistories]
      }

      this.lastRequest = getLastRequest(this.task)
    }
  }

  @action.bound taskAdded(item: TaskModel) {
    this.subtasks = [item, ...this.subtasks]
    this.subtaskTotalCount += 1
  }

  @action.bound taskRecovered(item: TaskModel) {
    this.loadData(this.task.id)
  }

  @action.bound taskReturned() {
    this.provider.router.back()
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

  @computed get isAssignedTask() {
    return isAssignedTask(this.task)
  }
}

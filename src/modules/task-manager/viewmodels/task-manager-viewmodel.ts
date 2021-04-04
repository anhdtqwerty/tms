import { AppProvider } from '@/app-provider'
import { excelHelper } from '@/helpers/excel-helper'
import { createTaskBody, getLastRequest, TaskModel, TaskRouteType, taskTypeToFilterParams } from '@/models/task-model'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class TaskManagerViewModel {
  @observable totalCount = 0
  @observable tasks: TaskModel[] = []

  private _taskTypeParams: any[] = []
  private _advanceParams: any = {}
  private _simpleParams: any = {}

  constructor(private provider: AppProvider) {}

  async exportExcel() {
    const tasks = await this.provider.api.task.find({
      _where: [{ ...this._simpleParams, ...this._advanceParams }, ...this._taskTypeParams],
      _limit: -1
    })
    excelHelper.task(tasks)
  }

  changeTaskType(taskType: TaskRouteType) {
    this._taskTypeParams = taskTypeToFilterParams(taskType, false)
    this.search()
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
      _where: [{ ...this._simpleParams, ...this._advanceParams }, ...this._taskTypeParams],
      _start: (page - 1) * 25
    }
    const results = yield Promise.all([this.provider.api.task.find(params), this.provider.api.task.count(params)])
    this.tasks = results[0]
    this.totalCount = results[1]
  }

  async deleteLastRequest(task: any) {
    if (await this.provider.alert.confirmDelete('cập nhật')) {
      const lastRequest = getLastRequest(task)
      if (lastRequest) {
        try {
          await this.provider.api.task.update(
            (task as TaskModel).id,
            createTaskBody(task, {
              state: lastRequest.data.oldTaskState
            })
          )

          try {
            await this.provider.api.request.delete(lastRequest.id)
            this.provider.snackbar.success('Xóa cập nhật thành công')
          } catch (error) {
            this.provider.snackbar.commonError(error)
          }
        } catch (error) {
          this.provider.snackbar.commonError(error)
        }
      }
    }
  }

  @action.bound taskAdded(item: TaskModel) {
    this.tasks = [item, ...this.tasks]
    this.totalCount += 1
  }

  @action.bound taskUpdated(task: TaskModel) {
    this.tasks = this.tasks.map(t => (t.id === task.id ? task : t))
    this.search()
  }

  @action.bound taskDeleted(id: string) {
    this.tasks = this.tasks.filter(t => t.id !== id)
  }

  @action.bound taskRecovered(item: TaskModel) {
    this.search()
  }

  @action.bound taskReturned(item: TaskModel) {
    this.tasks = this.tasks.filter(t => t.id !== item.id)
  }
}

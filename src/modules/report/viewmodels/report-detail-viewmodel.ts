import { AppProvider } from '@/app-provider'
import { excelHelper } from '@/helpers/excel-helper'
import { textHelpers } from '@/helpers/text-helper'
import { TaskModel, TaskRouteType, taskTypeToFilterParams } from '@/models/task-model'
import _ from 'lodash'
import { observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import moment from 'moment'

export class ReportDetailViewModel {
  @observable tasks: TaskModel[] = []
  @observable totalTask = 0

  private _taskTypeParams: any[] = []
  private _advanceParams: any = {}
  private _simpleParams: any = {}

  constructor(private provider: AppProvider) {
    //
  }

  async exportExcel() {
    const tasks = await this.provider.api.task.find({
      _where: [{ ...this._simpleParams, ...this._advanceParams }, ...this._taskTypeParams],
      _limit: -1
    })
    excelHelper.task(tasks)
  }

  changeTaskType(taskType: TaskRouteType) {
    this._taskTypeParams = taskTypeToFilterParams(taskType)
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
    this.totalTask = results[1]
  }
}

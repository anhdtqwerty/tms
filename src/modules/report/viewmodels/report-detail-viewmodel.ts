import { AppProvider } from '@/app-provider'
// import { excelHelper } from '@/helpers/excel-helper'
// import { textHelpers } from '@/helpers/text-helper'
import { TaskModel, TaskRouteType, taskStateNameMap, taskTypeToFilterParams } from '@/models/task-model'
import _ from 'lodash'
import { observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import moment from 'moment'
// @ts-ignore
import Excel from 'exceljs'
// @ts-ignore
import LoadAsset from 'load-asset'
import { ComradeModel } from '@/models/comrade-model'
import { saveAs } from 'file-saver'

export class ReportDetailViewModel {
  @observable tasks: TaskModel[] = []
  @observable totalTask = 0

  private _taskTypeParams: any[] = []
  private _advanceParams: any = {}
  private _simpleParams: any = {}

  constructor(private provider: AppProvider) {
    //
  }

  // async exportExcel() {
  //   const tasks = await this.provider.api.task.find({
  //     _where: [{ ...this._simpleParams, ...this._advanceParams }, ...this._taskTypeParams],
  //     _limit: -1
  //   })
  //   excelHelper.task(tasks)
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

  async exportExcel() {
    const workbook = new Excel.Workbook()
    const buffer = await LoadAsset({ url: 'report-detail.xlsx', type: 'binary' })
    await workbook.xlsx.load(buffer)
    const worksheet = workbook.getWorksheet('sheet')
    const tasks = await this.provider.api.task.find<TaskModel>({
      _where: [{ ...this._simpleParams, ...this._advanceParams }, ...this._taskTypeParams],
      _limit: -1
    })

    worksheet.getCell('A2').value = 'Thời gian xuất báo cáo ' + moment().format('DD/MM/YYYY HH:mm:ss')
    tasks.map((task, index) => {
      const rowIndex = index + 5
      let executedUnitDepDisplay = null
      if (_.get(task.executedDepartment, 'title'))
        executedUnitDepDisplay = _.get(task.executedUnit, 'title') + ' / ' + _.get(task.executedDepartment, 'title')
      else executedUnitDepDisplay = _.get(task.executedUnit, 'title')

      worksheet.getCell(`A${rowIndex}`).value = index + 1
      worksheet.getCell(`B${rowIndex}`).value = task.code
      worksheet.getCell(`C${rowIndex}`).value = moment(task.publishedDate).format('DD/MM/YYYY')
      worksheet.getCell(`D${rowIndex}`).value = task.title
      worksheet.getCell(`E${rowIndex}`).value = task.description
      worksheet.getCell(`F${rowIndex}`).value = executedUnitDepDisplay
      worksheet.getCell(`G${rowIndex}`).value = (task.executedComrade as ComradeModel).name
      worksheet.getCell(`H${rowIndex}`).value = moment(task.expiredDate).format('DD/MM/YYYY')
      worksheet.getCell(`I${rowIndex}`).value = taskStateNameMap[task.state]
      worksheet.getCell(`J${rowIndex}`).value = task.explainState
    })

    const excelBuffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, `Bao-cao-chi-tiet-${moment().format('DDMMYYYY_HHmm')}.xlsx`)
  }
}

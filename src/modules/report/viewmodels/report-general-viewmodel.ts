import { AppProvider } from '@/app-provider'
import { flatStats, mergeStatList, TaskStatModel } from '@/models/report-model'
import { getLeaderTaskStats, getTaskStats, TaskStatsResult } from '@/models/task-business'
import _ from 'lodash'
import { computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import moment from 'moment'
import { saveAs } from 'file-saver'
// import Excel from 'exceljs'
// import LoadAsset from 'load-asset'

export class ReportGeneralViewModel {
  @observable reports: any[] = []
  @observable exportedDate = ''

  constructor(private provider: AppProvider) {}

  @asyncAction *loadData(from: string, to: string) {
    const { createds, assigneds }: TaskStatsResult = yield getTaskStats({
      from,
      to,
      hasAssigneds: true,
      hasCreateds: true
    })
    this.reports = mergeStatList(createds, assigneds).map(r => {
      const t = r as TaskStatModel
      return {
        ...t,
        donePecent: ((t.done + t.doneOutDate) / t.total) * 100,
        unFinishPercent: ((t.doing + t.doingOutDate) / t.total) * 100
      }
    })
    this.exportedDate = moment().toISOString()
  }

  @computed get totals() {
    const flats = _.flatten(this.reports.map(r => Object.entries(r).map(([key, value]) => ({ key, value }))))
    const results: any = {}
    _(flats)
      .groupBy('key')
      .forEach((values, key) => (results[key] = _.sumBy(values, 'value')))
    return results
  }

  async exportExcel() {
    // const workbook = new Excel.Workbook()
    // const buffer = await LoadAsset({ url: 'report.xlsx', type: 'binary' })
    // await workbook.xlsx.load(buffer)
    // const worksheet = workbook.getWorksheet('sheet')
    // // worksheet.getCell('A2').value = 'Thời gian xuất báo cáo' + this.exportedDate
    // this.reports.map((r, index) => {
    //   const rowIndex = index + 6
    //   worksheet.getCell(`A${rowIndex}`).value = r.title
    //   worksheet.getCell(`B${rowIndex}`).value = r.total
    //   worksheet.getCell(`C${rowIndex}`).value = r.done
    //   worksheet.getCell(`D${rowIndex}`).value = r.doneOutDate
    //   worksheet.getCell(`E${rowIndex}`).value = (r.donePercent || 0) + ' %'
    //   worksheet.getCell(`F${rowIndex}`).value = r.doing
    //   worksheet.getCell(`G${rowIndex}`).value = r.doingOutDate
    //   worksheet.getCell(`H${rowIndex}`).value = (r.unFinishPercent || 0) + ' %'
    // })
    // // total
    // const rowIndexTotal = this.reports.length + 6
    // worksheet.getCell(`A${rowIndexTotal}`).value = 'Tổng'
    // worksheet.getCell(`B${rowIndexTotal}`).value = this.totals.total
    // worksheet.getCell(`C${rowIndexTotal}`).value = this.totals.done
    // worksheet.getCell(`D${rowIndexTotal}`).value = this.totals.doneOutDate
    // worksheet.getCell(`E${rowIndexTotal}`).value = (this.totals.donePercent || 0) + ' %'
    // worksheet.getCell(`F${rowIndexTotal}`).value = this.totals.doing
    // worksheet.getCell(`G${rowIndexTotal}`).value = this.totals.doingOutDate
    // worksheet.getCell(`H${rowIndexTotal}`).value = (this.totals.unFinishPercent || 0) + ' %'
    // const excelBuffer = await workbook.xlsx.writeBuffer()
    // const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    // saveAs(blob, `export-report-excel.xlsx`)
  }
}

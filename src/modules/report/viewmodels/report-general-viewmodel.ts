import { AppProvider } from '@/app-provider'
import { GeneralReportModel } from '@/models/report-model'
import _ from 'lodash'
import { computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import moment from 'moment'

export class ReportGeneralViewModel {
  @observable reports: GeneralReportModel[] = []
  @observable exportedDate = ''

  constructor(private provider: AppProvider) {}

  @asyncAction *loadData(from: string, to: string) {
    this.reports = yield this.provider.api.getGeneralReport(
      moment(from).format('yyyy-MM-DD'),
      moment(to).format('yyyy-MM-DD')
    )
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
}

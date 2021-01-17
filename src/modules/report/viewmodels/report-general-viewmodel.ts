import { AppProvider } from '@/app-provider'
import { TaskStatModel } from '@/models/report-model'
import _ from 'lodash'
import { computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import moment from 'moment'

export class ReportGeneralViewModel {
  @observable reports: TaskStatModel[] = []
  @observable exportedDate = ''

  constructor(private provider: AppProvider) {}

  @asyncAction *loadData(from: string, to: string) {
    this.reports = yield this.provider.api.getUnitsTaskReport({
      from: moment(from).format('YYYY-MM-DD'),
      to: moment(to).format('YYYY-MM-DD')
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
}

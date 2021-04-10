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
    const { api, authStore } = this.provider
    const { department, unit, ministry } = authStore.unitParams
    let stats: TaskStatModel[] = []
    if (department) {
      stats = yield api.getDepartmentsTaskReport({
        unit,
        joinUnitBy: 'executedUnit',
        joinBy: 'executedComrade',
        from,
        to
      })
    } else if (unit) {
      stats = yield api.getUnitsTaskReport({ joinUnitBy: 'executedUnit', ministry: authStore.ministry?.id })
      stats = stats.filter(t => t.id === unit)
    } else if (ministry) {
      stats = yield api.getUnitsTaskReport({ joinUnitBy: 'createdUnit', ministry, from, to })
    }
    this.reports = stats
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

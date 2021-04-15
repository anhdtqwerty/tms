import { AppProvider } from '@/app-provider'
import { flatStats, mergeStatList, TaskStatModel } from '@/models/report-model'
import { getLeaderTaskStats, getTaskStats, TaskStatsResult } from '@/models/task-business'
import _ from 'lodash'
import { computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import moment from 'moment'

export class ReportGeneralViewModel {
  @observable reports: TaskStatModel[] = []
  @observable exportedDate = ''

  constructor(private provider: AppProvider) {}

  @asyncAction *loadData(from: string, to: string) {
    const { createds, assigneds }: TaskStatsResult = yield getTaskStats({
      from,
      to,
      hasAssigneds: true,
      hasCreateds: true
    })
    this.reports = mergeStatList(createds, assigneds)
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

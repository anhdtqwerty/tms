import { AppProvider } from '@/app-provider'
import { LogModel } from '@/models/log-model'
import { apiLogNames, ApiRouteNames } from '@/services/api-service'
import _ from 'lodash'
import { computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import moment from 'moment'

export class LogManagerViewModel {
  @observable logs: LogModel[] = []
  @observable totalCount = 0

  constructor(private provider: AppProvider) {
    this.loadData()
  }

  @asyncAction *loadData(page = 1) {
    const results = yield Promise.all([
      this.provider.api.log.count(),
      this.provider.api.log.find({ _start: (page - 1) * 25 })
    ])
    this.totalCount = results[0]
    this.logs = results[1]
  }

  @computed get displayLogs(): any[] {
    return this.logs.map(l => ({
      ...l,
      displayAction: apiLogNames[l.action],
      displayFeature: apiLogNames[l.action] + ' ' + ApiRouteNames[l.feature],
      displayDescription:
        l.description ?? _.get(l.comrade, 'name') + ' đã ' + apiLogNames[l.action] + ' ' + ApiRouteNames[l.feature],
      displayDatetime: moment(l.created_at).format('H[h]mm [ngày] DD/MM/yyyy')
    }))
  }
}

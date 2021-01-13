import { AppProvider } from '@/app-provider'
import { observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class ReportDetailViewModel {
  @observable reports: any[] = []

  constructor(private provider: AppProvider) {
    //
  }

  // @asyncAction
  @asyncAction *loadData() {
    // const units = yield this.provider.api.unit.find(null, { _limit: 100 })
    // const
  }
}

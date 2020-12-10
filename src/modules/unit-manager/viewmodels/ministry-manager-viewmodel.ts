import { AppProvider } from '@/app-provider'
import { UnitModel } from '@/models/unit-model'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class MinistryManagerViewModel {
  @observable ministry: UnitModel = null

  constructor(private provider: AppProvider) {
    this.loadData()
  }

  @asyncAction *loadData() {
    const res = yield this.provider.api.unit.find({ _limit: 1, type: 'ministry' })
    this.ministry = res[0]
  }
}

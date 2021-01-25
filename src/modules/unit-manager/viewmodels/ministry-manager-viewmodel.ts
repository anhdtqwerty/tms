import { AppProvider } from '@/app-provider'
import { UnitModel } from '@/models/unit-model'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class MinistryManagerViewModel {
  @observable ministry: UnitModel = null
  @observable units: UnitModel[] = []
  @observable totalUnit = 0

  constructor(private provider: AppProvider) {
    this.loadData()
  }

  @asyncAction *loadData() {
    const res = yield this.provider.api.unit.find({ _limit: 1, type: 'ministry' })
    this.ministry = res[0]
    const results = yield Promise.all([
      this.provider.api.unit.count({ type: 'unit' }),
      this.provider.api.unit.find({ type: 'unit' })
    ])
    this.totalUnit = results[0]
    this.units = results[1]
  }

  @action.bound unitUpdated(unit: UnitModel) {
    if (unit.type === 'ministry') {
      this.ministry = unit
    } else {
      this.units = this.units.map(u => (u.id === unit.id ? unit : u))
    }
  }

  @action.bound unitAdded(unit: UnitModel) {
    this.units = [unit, ...this.units]
  }

  @asyncAction *deleteUnit(unit: UnitModel) {
    if (yield this.provider.api.deleteUnit(unit)) {
      this.units = this.units.filter(u => u.id !== unit.id)
    }
  }
}

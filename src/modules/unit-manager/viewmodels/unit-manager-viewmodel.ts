import { AppProvider } from '@/app-provider'
import { UnitModel } from '@/models/unit-model'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class UnitManagerViewModel {
  @observable ministry: UnitModel = null
  @observable units: UnitModel[] = []
  @observable totalUnit = 0
  private _searchParams = { type: 'unit' }

  constructor(private provider: AppProvider) {
    this.loadData()
    this.search()
  }

  @asyncAction *loadData() {
    this.ministry = yield this.provider.services.api.unit.find({ _limit: 1, type: 'ministry' })
  }

  @asyncAction *search(title: string = null, code: string = null, email: string = null) {
    let input: any = { type: 'unit' }
    if (title) input = { ...input, title_contains: title }
    if (code) input = { ...input, code_contains: code }
    if (email) input = { ...input, email_contains: email }
    this._searchParams = input
    const api = this.provider.services.api
    const results = yield Promise.all([
      api.unit.count(this._searchParams),
      this.provider.services.api.unit.find({ ...this._searchParams, _limit: 25, _sort: 'created_at:DESC' })
    ])
    this.totalUnit = results[0]
    this.units = results[1]
  }

  @action.bound unitAdded(unit: UnitModel) {
    this.units = [unit, ...this.units]
  }

  @action.bound unitUpdated(unit: UnitModel) {
    this.units = this.units.map(u => (u.id === unit.id ? unit : u))
  }

  @asyncAction *deleteUnit(unit: UnitModel) {
    const ok = yield this.provider.alert.confirm(
      'XÁC NHẬN XÓA',
      'Bạn có CHẮC CHẮN muốn xóa đơn vị này? Bạn sẽ không thể hoàn tác thao tác.'
    )
    if (ok) {
      this.provider.services.api.unit.delete(unit.id)
      this.units = this.units.filter(u => u.id !== unit.id)
    }
  }
}

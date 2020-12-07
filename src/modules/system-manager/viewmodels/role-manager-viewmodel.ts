import { AppProvider } from '@/app-provider'
import { PositionModel, PositionType } from '@/models/position-model'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class RoleManagerViewModel {
  @observable roles: PositionModel[] = []
  @observable type: PositionType = null

  constructor(private provider: AppProvider) {
    this.loadData()
  }

  @asyncAction *loadData() {
    this.type = this.provider.router.currentRoute.params['type'] as PositionType
    this.roles = yield this.provider.services.api.position.find({ _limit: 25, type: this.type })
  }

  @action.bound roleAdded(item: PositionModel) {
    this.roles = [item, ...this.roles]
  }

  @action.bound roleUpdated(item: PositionModel) {
    this.roles = this.roles.map(r => (r.id === item.id ? item : r))
  }
}

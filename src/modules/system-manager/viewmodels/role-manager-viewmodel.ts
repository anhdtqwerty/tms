import { AppProvider } from '@/app-provider'
import { ComradeModel } from '@/models/comrade-model'
import { PositionModel, PositionType } from '@/models/position-model'
import { authStore } from '@/stores/auth-store'
import _ from 'lodash'
import { action, IReactionDisposer, observable, reaction } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class RoleManagerViewModel {
  @observable roles: PositionModel[] = []
  @observable type: PositionType = null
  private _disposers: IReactionDisposer[] = []
  constructor(private provider: AppProvider) {
    this.loadData()
    this._disposers = [
      // reaction(
      //   () => this.roles,
      //   roles => {
      //     const userRole = authStore.comrade?.position as PositionModel
      //     if (userRole) {
      //       const role = roles.find(r => r.id === userRole.id)
      //       if (role && role.updated_at !== userRole.updated_at) {
      //         authStore.changeComrade({ ...authStore.comrade, position: role })
      //       }
      //     }
      //   }
      // )
    ]
  }

  destroyed() {
    this._disposers.forEach(d => d())
    this._disposers = []
  }

  @asyncAction *loadData() {
    // this.type = this.provider.router.currentRoute.params['type'] as PositionType
    this.roles = yield this.provider.api.position.find({ _limit: 25, type: 'unit' })
  }

  @action.bound roleAdded(item: PositionModel) {
    this.roles = [item, ...this.roles]
  }

  @action.bound roleUpdated(item: PositionModel) {
    this.roles = this.roles.map(r => (r.id === item.id ? item : r))
  }

  @asyncAction *deleteRole(item: PositionModel) {
    if (yield this.provider.api.deletePosition(item)) {
      this.roles = this.roles.filter(r => r.id !== item.id)
    }
  }
}

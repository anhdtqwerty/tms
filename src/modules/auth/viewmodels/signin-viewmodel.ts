import { AppProvider } from '@/app-provider'
import { ApiService } from '@/services/api-service'
import { authStore } from '@/stores/auth-store'
import _ from 'lodash'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class SigninViewModel {
  @observable username = ''
  @observable password = ''

  private _api: ApiService

  constructor(private providers: AppProvider) {
    this._api = this.providers.api
  }

  @action.bound changeUsername(value: string) {
    this.username = value
  }
  @action.bound changePassword(value: string) {
    this.password = value
  }

  @asyncAction *handleLogin(saveAccount: boolean) {
    try {
      const res = yield this._api.login(this.username, this.password)
      const { jwt, user } = res
      authStore.onLogin(saveAccount, jwt, user)
      try {
        const comrade = yield this._api.comarde.findOne(_.get(user, 'comrade.id'))
        authStore.changeComrade(comrade)
      } catch (error) {
        console.error('handleLogin get comrade', error)
      }
      try {
        const res = yield this._api.unit.find({ _limit: 1, type: 'ministry' })
        authStore.ministry = res[0]
      } catch (error) {
        console.error('handleLogin get ministry', error)
      }
      this.providers.router.replace(authStore.isLeader ? 'dashboard-leader' : 'dashboard-comrade')
    } catch (error) {
      this.providers.snackbar.commonError(error)
    }
  }
}

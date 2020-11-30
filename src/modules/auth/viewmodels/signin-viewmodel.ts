import { AppProvider } from '@/app-provider'
import { ApiService } from '@/services/api-service'
import { action, computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class SigninViewModel {
  @observable username = ''
  @observable password = ''

  private _api: ApiService

  constructor(private providers: AppProvider) {
    this._api = this.providers.services.api
  }

  @action.bound changeUsername(value: string) {
    this.username = value
  }
  @action.bound changePassword(value: string) {
    this.password = value
  }

  @asyncAction *handleLogin() {
    try {
      const res = yield this._api.login(this.username, this.password)
      const { jwt, user } = res
      this.providers.store.auth.onLogin(jwt, user)
      this.providers.router.replace('dashboard')
    } catch (error) {
      this.providers.snackbar.commonError(error)
    }
  }
}

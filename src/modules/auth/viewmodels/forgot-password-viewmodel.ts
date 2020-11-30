import { AppProvider } from '@/app-provider'
import { action, observable } from 'mobx'

export class ForgotPasswordViewModel {
  @observable email = ''

  constructor(public providers: AppProvider) {}

  @action submit() {
    this.providers.services.api.forgotPassword(this.email)
  }

  @action.bound changeEmail(value: string) {
    this.email = value
  }
}

import { AppProvider } from '@/app-provider'
import { action, observable } from 'mobx'

export class ForgotPasswordViewModel {
  @observable email = ''

  constructor(public providers: AppProvider) {}

  async submit() {
    try {
      await this.providers.api.forgotPassword(this.email)
      await this.providers.alert.confirm('Thành công', 'Hãy check email của bạn')
      this.providers.router.replace('/signin')
    } catch (error) {
      this.providers.snackbar.commonError(error)
    }
  }

  @action.bound changeEmail(value: string) {
    this.email = value
  }
}

import { UserModel } from '@/models/auth-model'
import { action, observable, reaction } from 'mobx'

export class AuthStore {
  @observable jwt = localStorage.getItem('jwt')
  @observable user: UserModel = null

  constructor() {
    const userRaw = localStorage.getItem('user')
    if (userRaw) {
      this.user = JSON.parse(userRaw)
    }
    reaction(
      () => this.jwt,
      jwt => {
        if (jwt) localStorage.setItem('jwt', jwt)
        else localStorage.removeItem('jwt')
      }
    )
    reaction(
      () => this.user,
      user => {
        if (user) localStorage.setItem('user', JSON.stringify(user))
        else localStorage.removeItem('user')
      }
    )
  }

  @action onLogin(jwt: string, user: UserModel) {
    this.jwt = jwt
    this.user = user
  }
}

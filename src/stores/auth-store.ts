import { UserModel } from '@/models/auth-model'
import { action, computed, observable, reaction } from 'mobx'

class AuthStore {
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

  @action onLogout() {
    this.jwt = null
    this.user = null
  }

  @action onLogin(jwt: string, user: UserModel) {
    this.jwt = jwt
    this.user = user
  }

  @computed get authenticated() {
    return !!this.jwt
  }
}

export const authStore = new AuthStore()

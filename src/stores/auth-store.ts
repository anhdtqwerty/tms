import { UserModel } from '@/models/auth-model'
import { ComradeModel } from '@/models/comrade-model'
import Axios from 'axios'
import { action, computed, observable, reaction } from 'mobx'

class AuthStore {
  @observable jwt = localStorage.getItem('jwt')
  @observable user: UserModel = null
  @observable comrade: ComradeModel = null

  ipAdress = ''

  constructor() {
    const userRaw = localStorage.getItem('user')
    if (userRaw) {
      this.user = JSON.parse(userRaw)
    }
    const comradeRaw = localStorage.getItem('comrade')
    if (comradeRaw) {
      this.comrade = JSON.parse(comradeRaw)
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
    reaction(
      () => this.comrade,
      comrade => {
        if (comrade) localStorage.setItem('comrade', JSON.stringify(comrade))
        else localStorage.removeItem('comrade')
      }
    )
    this.fetchInfor()
  }

  async fetchInfor() {
    try {
      const res = await Axios.get('http://jsonip.com')
      this.ipAdress = res.data.ip
    } catch (error) {
      console.error('fetchInfor', error)
    }
  }

  @action onLogout() {
    this.jwt = null
    this.user = null
    this.comrade = null
  }

  @action onLogin(jwt: string, user: UserModel) {
    this.jwt = jwt
    this.user = user
    this.comrade = user?.comrade as ComradeModel
  }

  @action changeComrade(val: ComradeModel) {
    this.comrade = val
  }

  @computed get authenticated() {
    return !!this.jwt
  }
}

export const authStore = new AuthStore()

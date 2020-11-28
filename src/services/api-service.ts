import { UserModel } from '@/models/auth-model'
import Axios, { AxiosInstance } from 'axios'
import { getRootStore } from '@/stores'
import { reaction } from 'mobx'

const modelRouteMapping = {
  UserModel: 'users'
}

export class ApiHandler<T> {
  constructor(private route: string, private axios: AxiosInstance) {}
  async fetch(): Promise<T[]> {
    const res = await this.axios.get(this.route)
    return res.data
  }
}

export class ApiService {
  axios = Axios.create({ baseURL: process.env.VUE_APP_API_ENDPOINT })

  user = new ApiHandler<UserModel>('users', this.axios)
  comarde = new ApiHandler<any>('comrades', this.axios)

  constructor() {
    this.setupAuthInjector()
  }

  setupAuthInjector() {
    let jwtToken: string
    reaction(
      () => getRootStore().auth.jwt,
      jwt => {
        jwtToken = jwt
      },
      { fireImmediately: true }
    )
    this.axios.interceptors.request.use(config => {
      if (jwtToken) {
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${jwtToken}`
        }
      }
      return config
    })
  }

  async login(username: string, password: string): Promise<{ jwt: string; user: UserModel }> {
    const res = await this.axios.post('/auth/local', { identifier: username, password })
    return res.data
  }

  async forgotPassword(email: string): Promise<any> {
    await this.axios.post('/auth/forgot-password', { email })
  }

  async resetPassword(code: string, password: string, passwordConfirmation: string): Promise<any> {
    await this.axios.post('/auth/reset-password', {
      code,
      password,
      passwordConfirmation
    })
  }
}

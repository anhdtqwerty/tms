import { UserModel } from '@/models/auth-model'
import Axios, { AxiosInstance } from 'axios'

export class ApiService {
  axios: AxiosInstance
  constructor() {
    this.axios = Axios.create({ baseURL: process.env.VUE_APP_API_ENDPOINT })
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

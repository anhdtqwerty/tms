import { UserModel } from '@/models/auth-model'
import Axios, { AxiosInstance, AxiosResponse } from 'axios'

export class ApiService {
  axios: AxiosInstance
  constructor() {
    this.axios = Axios.create({ baseURL: process.env.VUE_APP_API_ENDPOINT })
  }

  async login(username: string, password: string): Promise<{ jwt: string; user: UserModel }> {
    const res = await this.axios.post('/auth/local', { identifier: username, password })
    return res.data
  }
}

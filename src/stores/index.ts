import { AuthStore } from './auth-store'

export const createStore = () => ({
  auth: new AuthStore()
})

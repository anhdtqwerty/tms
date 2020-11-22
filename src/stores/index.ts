import { AuthStore } from './auth-store'

export class RootStore {
  auth: AuthStore
}

let rootStore: RootStore

export const createStore: () => RootStore = () => {
  rootStore = {
    auth: new AuthStore()
  }
  return rootStore
}

export const getRootStore = () => rootStore

createStore()

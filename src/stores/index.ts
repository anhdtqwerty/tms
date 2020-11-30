import { AuthStore } from './auth-store'
import { DataStore } from './data-store'

// THIS IS CROSS DOAMIN STORE
// These stores save and edit data only, doesn't call API
export class RootStore {
  auth: AuthStore
  data: DataStore
}

let rootStore: RootStore

export const createStore = () => {
  rootStore = {
    // static stores
    auth: rootStore?.auth ?? new AuthStore(),

    // instance stores (after login)
    data: new DataStore()
  }
  return rootStore
}

export const getRootStore = () => rootStore

createStore()

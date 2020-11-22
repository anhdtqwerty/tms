import { AuthStore } from './auth-store'

// THIS IS CROSS DOAMIN STORE
// These stores save and edit data only, doesn't call API
export class RootStore {
  auth: AuthStore
}

let rootStore: RootStore

export const createStore = () => {
  rootStore = {
    // static stores
    auth: rootStore?.auth ?? new AuthStore()
    // instance stores (after login
    // store1: ...
  }
  return rootStore
}

export const getRootStore = () => rootStore

createStore()

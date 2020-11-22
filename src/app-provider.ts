import VueRouter from 'vue-router'
import { services } from './services'
import { createStore, getRootStore } from './stores'

export class AppProvider {
  router: VueRouter
  services = services
  store = getRootStore()

  constructor(router: VueRouter) {
    this.router = router
  }

  onLogout() {
    this.store.auth.onLogout()
    this.store = createStore()
    this.router.replace('signin')
  }
}

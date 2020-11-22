import { action } from 'mobx'
import VueRouter from 'vue-router'
import { createServices } from './services'
import { createStore } from './stores'

export class AppProvider {
  router: VueRouter
  services = createServices()
  store = createStore()

  constructor(router: VueRouter) {
    this.router = router
  }

  @action onlogout() {
    this.store.auth.onLogout()
    this.router.replace('signin')
  }
}

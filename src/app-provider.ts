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
}

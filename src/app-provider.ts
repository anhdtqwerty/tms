import VueRouter from 'vue-router'
import { AlertController } from './components/alert/alert-controller'
import { SnackBarController } from './components/snack-bar/snack-bar-controller'
import { services } from './services'
import { createStore, getRootStore } from './stores'

export class AppProvider {
  router: VueRouter
  snackbar = new SnackBarController()
  alert = new AlertController()
  services = services
  store = getRootStore()

  constructor(router: VueRouter) {
    console.log('AppProvider ctor')
    this.router = router
  }

  onLogout() {
    this.store.auth.onLogout()
    this.store = createStore()
    this.router.replace('signin')
  }
}

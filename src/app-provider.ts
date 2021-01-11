import VueRouter from 'vue-router'
import { AlertController } from './components/alert/alert-controller'
import { SnackBarController } from './components/snack-bar/snack-bar-controller'
import { ApiService } from './services/api-service'
import { authStore } from './stores/auth-store'

export class AppProvider {
  router: VueRouter
  snackbar = new SnackBarController()
  alert = new AlertController()
  api = new ApiService()
  authStore = authStore

  constructor(router: VueRouter) {
    console.log('AppProvider ctor')
    this.router = router
  }

  onLogout() {
    this.authStore.onLogout()
    this.router.replace('/signin')
  }
}

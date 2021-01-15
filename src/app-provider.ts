import { computed } from 'mobx'
import VueRouter from 'vue-router'
import { AlertController } from './components/alert/alert-controller'
import { GlobalLoadingController } from './components/global-loading/global-loading-controller'
import { SnackBarController } from './components/snack-bar/snack-bar-controller'
import { ApiService } from './services/api-service'
import { authStore } from './stores/auth-store'

export let appProvider: AppProvider = null
export class AppProvider {
  router: VueRouter
  loading = new GlobalLoadingController()
  snackbar = new SnackBarController()
  alert = new AlertController()
  api = new ApiService()
  authStore = authStore

  constructor(router: VueRouter) {
    console.log('AppProvider ctor')
    this.router = router
    appProvider = this
  }

  onLogout() {
    this.authStore.onLogout()
    this.router.replace('/signin')
  }

  @computed get isLeader() {
    return authStore.isLeader
  }
}

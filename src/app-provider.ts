import { computed } from 'mobx'
import VueRouter from 'vue-router'
import { alertController, AlertController } from './components/alert/alert-controller'
import { GlobalLoadingController, loadingController } from './components/global-loading/global-loading-controller'
import { snackbarController, SnackBarController } from './components/snack-bar/snack-bar-controller'
import { apiService, ApiService } from './services/api-service'
import { authStore } from './stores/auth-store'

export let appProvider: AppProvider = null
export class AppProvider {
  router: VueRouter
  loading = loadingController
  snackbar = snackbarController
  alert = alertController
  api = apiService
  authStore = authStore

  constructor(router: VueRouter) {
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

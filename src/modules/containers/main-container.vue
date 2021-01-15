<template>
  <v-app style="background-color: #f5f5f5">
    <main-app-bar />
    <main-drawer />
    <v-main>
      <router-view />
    </v-main>
    <snack-bar :controller="providers.snackbar" />
    <alert :controller="providers.alert" />
    <global-loading :controller="providers.loading" />
  </v-app>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { MainContainerViewModel } from './viewmodels/main-container.viewmodel'

@Component({
  components: {
    MainAppBar: () => import('./components/main-app-bar.vue'),
    MainDrawer: () => import('./components/main-drawer.vue'),
    SnackBar: () => import('@/components/snack-bar/snack-bar.vue'),
    Alert: () => import('@/components/alert/alert.vue'),
    GlobalLoading: () => import('@/components/global-loading/global-loading.vue')
  }
})
export default class MainContainer extends Vue {
  @Inject() providers!: AppProvider

  @Provide() mainViewModel = new MainContainerViewModel(this.providers)
}
</script>

<style scoped></style>

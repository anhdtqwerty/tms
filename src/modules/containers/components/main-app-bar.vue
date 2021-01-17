<template>
  <v-app-bar
    app
    dense
    dark
    height="64px"
    class="elevation-2 white"
    :class="{ primary: $vuetify.breakpoint.xs, 'darken-1': $vuetify.breakpoint.xs }"
  >
    <v-app-bar-nav-icon
      color="text--lighten-1"
      class="d-flex d-sm-none"
      @click.stop="mainViewModel.toggleDrawer()"
    ></v-app-bar-nav-icon>
    <v-toolbar-title>
      <v-img class="d-flex d-sm-none" src="@/assets/logo.svg" height="24px" contain position="left"></v-img>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu v-model="menu" open-on-hover offset-y :dark="false">
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          <app-avatar
            :avatar="providers.authStore.comrade | _get('avatar')"
            :class="{ 'mr-4': !$vuetify.breakpoint.xs, 'mr-n6': $vuetify.breakpoint.xs }"
            size="40"
          />
          <div class="d-none d-sm-flex black--text">
            {{ providers.authStore.comrade | _get('name') }}
          </div>
        </v-btn>
      </template>
      <v-card>
        <v-list>
          <v-list-item to="/change-password">
            <v-btn text>Đổi mật khẩu</v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn text @click="providers.onLogout()">Đăng xuất</v-btn>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { MainContainerViewModel } from '../viewmodels/main-container.viewmodel'

@Component({
  components: {
    AppAvatar: () => import('@/components/images/app-avatar.vue')
  }
})
export default class MainAppBar extends Vue {
  @Inject() mainViewModel: MainContainerViewModel
  @Inject() providers: AppProvider
  drawer = true
  menu = false
}
</script>

<style scoped></style>

<template>
  <v-main class="d-flex pa-0 ma-0 align-center">
    <span class="auth-background hidden-sm-only hidden-xs-only"></span>
    <span class="auth-background--right hidden-sm-only hidden-xs-only"></span>
    <v-card class="pa-0 ma-auto" max-width="1024" min-height="504">
      <v-row no-gutters style="min-height: 504px">
        <v-col cols="12" md="5" class="primary py-5 py-md-16 d-flex flex-column align-center px-16">
          <div class="title text-center white--text mt-8">Phần mềm quản lý và theo dõi nhiệm vụ của Bộ GTVT</div>
          <v-spacer></v-spacer>
          <v-img max-width="100" max-height="70" src="@/assets/ministry-logo.svg"></v-img>
          <div class="white--text logo-title mt-2">
            BỘ GIAO THÔNG VẬN TẢI
          </div>
          <div class="white--text logo-subtitle">
            MINISTRY OF TRANSPORT
          </div>
        </v-col>
        <v-col cols="12" md="7">
          <div class="px-4 px-md-16 py-5 d-flex flex-column justify-center mt-4" style="height: 100%">
            <router-view />
          </div>
        </v-col>
      </v-row>
    </v-card>
    <snack-bar :controller="providers.snackbar" />
    <alert :controller="providers.alert" />
    <global-loading :controller="providers.loading" />
  </v-main>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Inject, Vue } from 'vue-property-decorator'

@Component({
  components: {
    SnackBar: () => import('@/components/snack-bar/snack-bar.vue'),
    Alert: () => import('@/components/alert/alert.vue'),
    GlobalLoading: () => import('@/components/global-loading/global-loading.vue')
  }
})
export default class AuthContainer extends Vue {
  @Inject() providers: AppProvider
}
</script>

<style scoped>
.auth-background {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: url('../../assets/auth_background.png') no-repeat center center;
  background-size: cover;
  transform: scale(1);
}
.auth-background--right {
  width: 50%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  background-color: #1e88e5;
  opacity: 0.3;
}
.title {
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
}
.logo-title {
  font-family: 'Times New Roman';
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
}
.logo-subtitle {
  font-family: 'Times New Roman';
  font-style: normal;
  font-weight: bold;
  font-size: 9px;
  line-height: 20px;
}
</style>

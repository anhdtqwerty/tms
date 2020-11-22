<template>
  <v-main class="d-flex pa-0 ma-0 align-center">
    <span class="auth-background hidden-sm-only hidden-xs-only"></span>
    <span class="auth-background--right hidden-sm-only hidden-xs-only"></span>
    <v-card class="pa-0 ma-auto" max-width="1024" min-height="504">
      <v-row no-gutters style="min-height: 504px">
        <v-col cols="12" md="5" class="primary py-5 py-md-16 d-flex justify-center align-end">
          <v-img max-width="266" src="@/assets/logo_sologan.svg"></v-img>
        </v-col>
        <v-col cols="12" md="7">
          <div class="px-4 px-md-16 py-12">
            <router-view />
          </div>
        </v-col>
      </v-row>
    </v-card>
    <snack-bar :controller="providers.snackbar" />
  </v-main>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import SnackBar from '@/components/snack-bar/snack-bar.vue'
import { Component, Inject, Vue } from 'vue-property-decorator'

@Component({
  components: {
    SnackBar: SnackBar
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
</style>

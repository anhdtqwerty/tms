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
    <!-- <v-toolbar-items> -->
    <v-btn icon light @click="providers.onlogout()">
      <v-icon>mdi-export</v-icon>
    </v-btn>
    <!-- <user v-if="role.name === 'Manager'" />
      <student v-if="role.name === 'Student'" />
      <teacher v-if="role.name === 'Teacher'" /> -->
    <!-- </v-toolbar-items> -->
  </v-app-bar>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { MainContainerViewModel } from '../viewmodels/main-container.viewmodel'

@Component
export default class MainAppBar extends Vue {
  @Inject() mainViewModel: MainContainerViewModel
  @Inject() providers: AppProvider
  drawer = true
}
</script>

<style scoped></style>

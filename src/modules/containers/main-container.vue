<template>
  <v-app style="background-color: #f5f5f5">
    <main-app-bar />
    <main-drawer />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Provide, Vue } from 'vue-property-decorator'
import MainAppBar from './components/main-app-bar.vue'
import MainDrawer from './components/main-drawer.vue'
import { MainContainerViewModel } from './viewmodels/main-container.viewmodel'

@Component({
  components: {
    MainAppBar: MainAppBar,
    MainDrawer: MainDrawer
  }
})
export default class MainContainer extends Vue {
  @Provide() mainViewModel = new MainContainerViewModel()
}
</script>

<style scoped></style>

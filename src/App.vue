<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script lang="ts">
import { Component, Provide, Vue } from 'vue-property-decorator'
import { AppProvider } from '@/app-provider'

@Component
export default class App extends Vue {
  @Provide() providers = new AppProvider(this.$router)
}
</script>

<style>
.left-primary-border {
  border-left: 4px solid #1e88e5 !important;
}
.row {
  margin-top: 0px !important;
  margin-bottom: 0px !important;
}
.required label::after {
  content: ' *';
  color: red;
}
.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  color: #0084ff !important;
}
</style>

<template>
  <div></div>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { MinistryManagerViewModel } from '../viewmodels/ministry-manager-viewmodel'

@Component
export default class MinistryManagerPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new MinistryManagerViewModel(this.providers)
}
</script>

<style scoped></style>

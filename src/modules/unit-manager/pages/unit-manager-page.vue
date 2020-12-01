<template>
  <div></div>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { UnitManagerViewModel } from '../viewmodels/unit-manager-viewmodel'

@Component
export default class UnitManagerPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new UnitManagerViewModel(this.providers)
}
</script>

<style scoped></style>

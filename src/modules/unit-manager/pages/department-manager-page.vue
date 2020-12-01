<template>
  <div></div>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { DepartmentManagerViewModel } from '../viewmodels/department-manager-viewmodel'

@Component
export default class DepartmentManagerPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new DepartmentManagerViewModel(this.providers)
}
</script>

<style scoped></style>

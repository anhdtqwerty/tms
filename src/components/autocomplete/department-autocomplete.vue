<template>
  <v-autocomplete
    v-model="syncedValue"
    :disabled="unitRequired && !unit"
    dense
    :outlined="outlined"
    item-text="display"
    :items="items"
    item-value="id"
    :loading="loading"
    v-bind="$attrs"
    clearable
  >
  </v-autocomplete>
</template>

<script lang="ts">
import { Component, Inject, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'
import _ from 'lodash'
import { AppProvider } from '@/app-provider'
import { DepartmentModel } from '@/models/department-model'
import { authStore } from '@/stores/auth-store'
import { UnitModel } from '@/models/unit-model'

@Component
export default class UnitAutoComplete extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { default: null }) syncedValue: string
  @Prop({ default: true }) outlined: boolean
  @Prop() unit: string
  @Prop({ default: true }) unitRequired: boolean
  @Prop({ default: false }) autoselect: boolean

  items: DepartmentModel[] = []
  loading = false

  @Watch('unit', { immediate: true }) async onUnitChanged(val: string) {
    this.loading = true
    try {
      const params: any = {}
      if (val) {
        params['unit'] = val
      }

      // Follow user belong to ministry/unit/department
      const userDep = authStore.comrade.department as DepartmentModel
      if (userDep) {
        params['id'] = userDep.id
      } else {
        const userUnit = authStore.comrade.unit as UnitModel
        if (userUnit && userUnit.type !== 'ministry') {
          params['unit'] = userUnit.id
        }
      }

      const items = await this.providers.api.department.find<DepartmentModel>(params)
      this.items = items.map(u => ({ ...u, display: u.title }))
      if (this.autoselect && this.items.length > 0) {
        if (!this.syncedValue || !this.items.some(d => d.id == this.syncedValue)) {
          this.syncedValue = this.items[0].id
        }
      }
    } catch (error) {
      //
    }
    this.loading = false
  }
}
</script>

<style scoped></style>

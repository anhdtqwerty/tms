<template>
  <v-autocomplete
    v-bind="$attrs"
    v-model="syncedValue"
    dense
    :outlined="outlined"
    item-text="display"
    :items="items"
    item-value="id"
    :multiple="multiple"
    :loading="loading"
  >
  </v-autocomplete>
</template>

<script lang="ts">
import { ComradeModel } from '@/models/comrade-model'
import { Component, Inject, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'
import { AppProvider } from '@/app-provider'
import { authStore } from '@/stores/auth-store'
import { DepartmentModel } from '@/models/department-model'
import { UnitModel } from '@/models/unit-model'

@Component
export default class ComradeAutoComplete extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { default: null }) syncedValue: string
  @Prop({ default: true }) outlined: boolean
  @Prop({ default: false }) autoselect: boolean
  @Prop() unit: string
  @Prop({ default: false }) multiple: boolean

  items: ComradeModel[] = []
  loading = false

  @Watch('unit', { immediate: true }) async onUnitChanged(val: any) {
    this.loading = true
    try {
      const params: any = {}
      if (this.multiple) {
        if (Array.isArray(val) && val.length > 0) {
          params['unit_in'] = val ?? []
        }
      } else {
        params['unit'] = val
      }

      // Follow user belong to ministry/unit/department
      const userDep = authStore.comrade.department as DepartmentModel
      if (userDep) {
        params['department'] = userDep.id
      } else {
        const userUnit = authStore.comrade.unit as UnitModel
        if (!params['unit'] && !params['unit_in'] && userUnit && userUnit.type !== 'ministry') {
          params['unit'] = userUnit.id
        }
      }

      const items = await this.providers.api.comarde.find<ComradeModel>(params)
      this.items = items.map(u => ({ ...u, display: u.name }))
      if (this.autoselect && this.items.length > 0 && !this.syncedValue) {
        this.syncedValue = this.items[0].id
      }
    } catch (error) {
      //
    }
    this.loading = false
  }
}
</script>

<style scoped></style>

<template>
  <v-autocomplete
    v-bind="$attrs"
    v-model="syncedValue"
    :disabled="!unit"
    dense
    outlined
    item-text="display"
    :items="items"
    item-value="id"
    :loading="loading"
  >
  </v-autocomplete>
</template>

<script lang="ts">
import { Component, Inject, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'
import _ from 'lodash'
import { AppProvider } from '@/app-provider'
import { DepartmentModel } from '@/models/department-model'

@Component
export default class UnitAutoComplete extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { default: null }) syncedValue: string
  @Prop() unit: string = null
  @Prop({ default: false }) autoselect: boolean

  items: DepartmentModel[] = []
  loading = false

  @Watch('unit', { immediate: true }) async onUnitChanged(val: string) {
    if (val) {
      this.loading = true
      try {
        const params: any = {}
        if (this.unit) {
          params['unit'] = this.unit
        }
        const items = await this.providers.api.department.find<DepartmentModel>(params)
        this.items = items.map(u => ({ ...u, display: u.code + ' - ' + u.title }))
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
}
</script>

<style scoped></style>

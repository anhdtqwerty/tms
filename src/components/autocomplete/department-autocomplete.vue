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
</script>

<style scoped></style>

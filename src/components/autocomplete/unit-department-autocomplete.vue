<template>
  <v-autocomplete
    v-bind="$attrs"
    v-model="syncedValue"
    dense
    :outlined="outlined"
    :multiple="multiple"
    item-text="display"
    :items="items"
    item-value="value"
    :loading="loading"
    clearable
  >
  </v-autocomplete>
</template>

<script lang="ts">
import { UnitModel } from '@/models/unit-model'
import { Component, Inject, Prop, PropSync, Vue } from 'vue-property-decorator'
import _ from 'lodash'
import { AppProvider } from '@/app-provider'
import { authStore } from '@/stores/auth-store'
import { DepartmentModel } from '@/models/department-model'

@Component
export default class UnitDepartmentAutoComplete extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { default: {} }) syncedValue: {}
  @Prop({ default: true }) outlined: boolean
  @Prop({ default: false }) multiple: boolean
  @Prop({ default: false }) autoselect: boolean
  @Prop({ default: false }) includeMinistry: boolean

  items: {}[] = []
  loading = false

  async mounted() {
    this.loading = true
    try {
      const params: any = {}

      // Follow user belong to ministry/unit
      const userUnit = authStore.comrade.unit as UnitModel
      if (userUnit && userUnit.type !== 'ministry') {
        params['unit'] = userUnit.id
        const items = await this.providers.api.department.find<DepartmentModel>(params)

        this.items = items.map(d => ({
          ...d,
          display: d.code + ' - ' + d.title,
          value: { unit: (d.unit as UnitModel).id, department: d.id }
        }))
        if (this.autoselect && this.items.length > 0 && !this.syncedValue) {
          this.syncedValue = (this.items[0] as any).value
        }
      } else {
        params['type'] = this.includeMinistry ? undefined : 'unit'

        const items = await this.providers.api.unit.find<UnitModel>(params)

        this.items = items.map(u => ({
          ...u,
          display: u.code + ' - ' + u.title,
          value: { unit: u.id, department: undefined }
        }))
        if (this.autoselect && this.items.length > 0 && !this.syncedValue) {
          this.syncedValue = (this.items[0] as any).value
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

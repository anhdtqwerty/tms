<template>
  <v-autocomplete
    :disabled="unitRequired && unit | _empty"
    v-bind="$attrs"
    v-model="syncedValue"
    dense
    :outlined="outlined"
    item-text="name"
    :items="items"
    item-value="id"
    :multiple="multiple"
    :loading="loading"
    clearable
  >
  </v-autocomplete>
</template>

<script lang="ts">
import { ComradeModel } from '@/models/comrade-model'
import { Component, Inject, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'
import { AppProvider } from '@/app-provider'
import { authStore } from '@/stores/auth-store'
import _ from 'lodash'
import { DepartmentModel } from '@/models/department-model'

@Component
export default class ComradeAutoComplete extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { default: null }) syncedValue: string
  @Prop({ default: true }) outlined: boolean
  @Prop({ default: false }) autoselect: boolean
  @Prop() unit: string | string[]
  @Prop({ default: false }) multiple: boolean
  @Prop({ default: true }) unitRequired: boolean

  items: ComradeModel[] = []
  loading = false

  @Watch('unit', { immediate: true }) async onUnitChanged(val: any) {
    if (this.unitRequired && !this.unit && _.isEmpty(val)) {
      this.items = []
      this.syncedValue = null
      return
    }
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
      const unitParams = authStore.unitParams
      if (unitParams.department) {
        params['department'] = unitParams.department
      } else if (!params['unit'] && !params['unit_in'] && unitParams.unit) {
        params['unit'] = unitParams.unit
      }

      this.items = await this.providers.api.comarde.find<ComradeModel>(params)
      if (this.autoselect && this.items.length > 0 && !this.syncedValue) {
        this.syncedValue = this.items[0].id
      }
    } catch (error) {
      //
    }
    this.loading = false
  }

  @Watch('value')
  onValueChanged(value: string | string[]) {
    if (Array.isArray(value)) {
      const deparmtents = _.reduce(
        value,
        (result, cur) => {
          const deparmtent = this.items.find(i => i.id === cur)?.department as DepartmentModel
          result[cur] = deparmtent.id
          return result
        },
        {} as any
      )
      this.$emit('departmentIds', deparmtents)
    } else if (value) {
      const deparmtent = this.items.find(i => i.id === value)?.department as DepartmentModel
      this.$emit('departmentId', deparmtent?.id)
    } else {
      this.$emit('departmentId', '')
    }
  }
}
</script>

<style scoped></style>

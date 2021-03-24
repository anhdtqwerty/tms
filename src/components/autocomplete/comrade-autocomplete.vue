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

@Component
export default class ComradeAutoComplete extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { default: null }) syncedValue: string
  @Prop({ default: true }) outlined: boolean
  @Prop({ default: false }) autoselect: boolean
  @Prop() unit: string | string[]
  @Prop() department: string | string[]
  @Prop({ default: false }) multiple: boolean
  @Prop({ default: true }) unitRequired: boolean

  items: ComradeModel[] = []
  loading = false

  @Watch('unit', { immediate: true }) async onUnitChanged(val: any) {
    if (this.unitRequired && (this.unit as string) && !this.unit && _.isEmpty(val)) {
      this.items = []
      this.syncedValue = null
      return
    }

    if (this.unitRequired && (this.unit as string[]) && !this.unit.length && _.isEmpty(val)) {
      this.items = []
      this.syncedValue = null
      return
    }

    await this.getComrade()
  }

  @Watch('department', { immediate: true }) async onDepartmentChanged(val: any) {
    if (this.unitRequired && (this.department as string) && !this.department && _.isEmpty(val)) {
      this.items = []
      this.syncedValue = null
      return
    }

    if (this.unitRequired && (this.department as string[]) && !this.department.length && _.isEmpty(val)) {
      this.items = []
      this.syncedValue = null
      return
    }

    await this.getComrade()
  }

  @Watch('value', { immediate: true }) onValueChanged(val: any) {
    if (val) {
      this.syncedValue = val
    }
  }

  async getComrade() {
    this.loading = true
    try {
      if (!this.multiple) this.syncedValue = null

      const params: any = {}
      if (this.unit.length && this.multiple) {
        if (Array.isArray(this.unit) && this.unit.length > 0) {
          params['unit_in'] = (this.unit as []) ?? []
        }
      } else if (this.unit) {
        params['unit'] = this.unit
      }

      if (this.department.length && this.multiple) {
        if (Array.isArray(this.department) && this.department.length > 0) {
          params['department_in'] = (this.department as []) ?? []
        }
      } else if (this.department) {
        params['department'] = this.department
      }

      // Follow user belong to ministry/unit/department
      const unitParams = authStore.unitParams
      if (!params['department'] && !params['department_in'] && unitParams.department) {
        params['department'] = this.department
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
}
</script>

<style scoped></style>

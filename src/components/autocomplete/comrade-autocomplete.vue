<template>
  <v-autocomplete
    :disabled="unitRequired && unitDep | _empty"
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
  @PropSync('value', { default: null }) syncedValue: string | string[]
  @Prop({ default: true }) outlined: boolean
  @Prop({ default: false }) autoselect: boolean
  @Prop() unitDep: { unit?: string; department?: string } | { unit?: string; department?: string }[]
  @Prop({ default: false }) multiple: boolean
  @Prop({ default: true }) unitRequired: boolean

  items: ComradeModel[] = []
  loading = false

  @Watch('unitDep', { immediate: true }) async onUnitChanged(val: any) {
    if (Array.isArray(val) && val.length) {
      await this.getComrade()

      // filter selected comrades when change list unit dep
      if (this.syncedValue && this.syncedValue.length) {
        const itemsDisplay = this.items.map(i => i.id)
        this.syncedValue = (this.syncedValue as []).filter(x => itemsDisplay.includes(x))
      }
    } else if (!Array.isArray(val) && val) {
      await this.getComrade()
    } else {
      this.items = []
      this.syncedValue = null
    }
  }

  async getComrade() {
    this.loading = true
    try {
      const params: any = {}
      if (this.unitDep && this.multiple) {
        if (Array.isArray(this.unitDep) && this.unitDep.length > 0) {
          params['unit_in'] = (this.unitDep.map(u => u.unit) as []) ?? []
          if (!params['unit_in'].length) params['department_in'] = (this.unitDep.map(d => d.department) as []) ?? []
        }
      } else if (this.unitDep) {
        params['unit'] = _.get(this.unitDep, 'unit')
        params['department'] = _.get(this.unitDep, 'department')
      }

      // Follow user belong to ministry/unit/department
      const unitParams = authStore.unitParams
      if (!params['department'] && !params['department_in'] && unitParams.department) {
        params['department'] = unitParams.department
      } else if (!params['unit'] && !params['unit_in'] && unitParams.unit) {
        params['unit'] = unitParams.unit
      }

      this.items = await this.providers.api.comarde.find<ComradeModel>(params)
    } catch (error) {
      //
    }
    this.loading = false
  }
}
</script>

<style scoped></style>

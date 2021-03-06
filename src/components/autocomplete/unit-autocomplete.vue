<template>
  <v-autocomplete
    v-bind="$attrs"
    v-model="syncedValue"
    dense
    :outlined="outlined"
    :multiple="multiple"
    item-text="display"
    :items="items"
    item-value="id"
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

@Component
export default class UnitAutoComplete extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { default: null }) syncedValue: string | string[]
  @Prop({ default: true }) outlined: boolean
  @Prop({ default: false }) multiple: boolean
  @Prop({ default: false }) autoselect: boolean
  @Prop({ default: false }) includeMinistry: boolean
  @Prop({ default: false }) ignoreUserUnit: boolean

  items: UnitModel[] = []
  loading = false

  async mounted() {
    this.loading = true
    try {
      const params: any = {}
      params['type'] = this.includeMinistry ? undefined : 'unit'

      // Follow user belong to ministry/unit
      const userUnit = authStore.comrade.unit as UnitModel
      if (!this.ignoreUserUnit && userUnit && userUnit.type !== 'ministry') {
        params['id'] = userUnit.id
      }

      const items = await this.providers.api.unit.find<UnitModel>(params)
      this.items = items.map(u => ({ ...u, display: u.title }))
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

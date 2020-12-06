<template>
  <v-autocomplete
    v-model="syncedValue"
    dense
    outlined
    item-text="display"
    :items="units"
    item-value="id"
    :loading="loading"
    return-object
  >
  </v-autocomplete>
</template>

<script lang="ts">
import { UnitModel } from '@/models/unit-model'
import { Component, Inject, PropSync, Vue } from 'vue-property-decorator'
import _ from 'lodash'
import { AppProvider } from '@/app-provider'

@Component
export default class UnitAutoComplete extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { default: null }) syncedValue: string

  searchText = ''
  units: UnitModel[] = []
  loading = false

  async mounted() {
    this.loading = true
    try {
      const units = await this.providers.services.api.unit.find<UnitModel>({ type: 'unit' })
      this.units = units.map(u => ({ ...u, display: u.code + ' - ' + u.title }))
      if (this.units.length > 0 && !this.syncedValue) {
        this.syncedValue = this.units[0].id
      }
    } catch (error) {
      //
    }
    this.loading = false
  }
}
</script>

<style scoped></style>

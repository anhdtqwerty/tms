<template>
  <v-autocomplete
    v-bind="$attrs"
    v-model="syncedValue"
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
import { UnitModel } from '@/models/unit-model'
import { Component, Inject, Prop, PropSync, Vue } from 'vue-property-decorator'
import _ from 'lodash'
import { AppProvider } from '@/app-provider'

@Component
export default class UnitAutoComplete extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { default: null }) syncedValue: string
  @Prop({ default: false }) autoselect: boolean

  items: UnitModel[] = []
  loading = false

  async mounted() {
    this.loading = true
    try {
      const items = await this.providers.api.unit.find<UnitModel>({ type: 'unit' })
      this.items = items.map(u => ({ ...u, display: u.code + ' - ' + u.title }))
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

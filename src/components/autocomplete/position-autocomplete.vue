<template>
  <v-autocomplete
    v-bind="$attrs"
    v-model="syncedValue"
    dense
    :outlined="outlined"
    item-text="title"
    :items="items"
    item-value="id"
    :loading="loading"
  >
  </v-autocomplete>
</template>

<script lang="ts">
import { Component, Inject, Prop, PropSync, Vue } from 'vue-property-decorator'
import _ from 'lodash'
import { AppProvider } from '@/app-provider'
import { PositionModel, PositionType } from '@/models/position-model'

@Component
export default class UnitAutoComplete extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { default: null }) syncedValue: string
  @Prop({ default: true }) outlined: boolean
  @Prop() types!: PositionType[]
  @Prop({ default: false }) autoselect: boolean

  items: PositionModel[] = []
  loading = false

  async mounted() {
    this.loading = true
    try {
      this.items = await this.providers.api.position.find<PositionModel>({ type_in: this.types })
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

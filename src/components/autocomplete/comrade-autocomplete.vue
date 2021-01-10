<template>
  <v-autocomplete
    v-bind="$attrs"
    v-model="syncedValue"
    dense
    :outlined="outlined"
    item-text="display"
    :items="items"
    item-value="id"
    :loading="loading"
  >
  </v-autocomplete>
</template>

<script lang="ts">
import { ComradeModel } from '@/models/comrade-model'
import { Component, Inject, Prop, PropSync, Vue } from 'vue-property-decorator'
import { AppProvider } from '@/app-provider'

@Component
export default class ComradeAutoComplete extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { default: null }) syncedValue: string
  @Prop({ default: true }) outlined: boolean
  @Prop({ default: false }) autoselect: boolean

  items: ComradeModel[] = []
  loading = false

  async mounted() {
    this.loading = true
    try {
      const items = await this.providers.api.comarde.find<ComradeModel>()
      this.items = items.map(u => ({ ...u, display: u.name }))
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

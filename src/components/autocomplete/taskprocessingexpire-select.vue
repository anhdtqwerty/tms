<template>
  <v-select
    v-bind="$attrs"
    v-model="syncedValue"
    dense
    :outlined="outlined"
    item-text="title"
    item-value="value"
    :items="items"
  />
</template>

<script lang="ts">
import { Component, Inject, Prop, PropSync, Vue } from 'vue-property-decorator'
import _ from 'lodash'
import { AppProvider } from '@/app-provider'

@Component
export default class TaskProcessingExpireSelect extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { default: null }) syncedValue: string
  @Prop({ default: true }) outlined: boolean
  @Prop() unit: string
  @Prop({ default: true }) unitRequired: boolean
  @Prop({ default: false }) autoselect: boolean

  items: { title: string; value: string }[] = [
    { title: 'Trong hạn', value: 'InProcessing' },
    { title: 'Quá hạn', value: 'Expired' },
    { title: 'Sắp hết hạn', value: 'AlmostExpired' }
  ]
}
</script>

<style scoped></style>

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
import { Component, Inject, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'
import _ from 'lodash'
import { AppProvider } from '@/app-provider'

@Component
export default class TaskStateSelect extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { default: null }) syncedValue: string
  @Prop({ default: true }) outlined: boolean
  @Prop() unit: string
  @Prop({ default: true }) unitRequired: boolean
  @Prop({ default: false }) autoselect: boolean

  items: { title: string; value: string }[] = [
    { title: 'Chờ phê duyệt', value: 'Pending' },
    { title: 'Đã phê duyệt', value: 'Approved' }
  ]
}
</script>

<style scoped></style>

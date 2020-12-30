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
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'

@Component
export default class TaskPrioritySelect extends Vue {
  @PropSync('value', { default: null }) syncedValue: string
  @Prop({ default: true }) outlined: boolean
  @Prop() unit: string
  @Prop({ default: true }) unitRequired: boolean
  @Prop({ default: false }) autoselect: boolean

  items: { title: string; value: string }[] = [
    { title: 'Mức 1', value: 'P1' },
    { title: 'Mức 2', value: 'P2' },
    { title: 'Mức 3', value: 'P3' },
    { title: 'Cấp thiết', value: 'P4' }
  ]
}
</script>

<style scoped></style>

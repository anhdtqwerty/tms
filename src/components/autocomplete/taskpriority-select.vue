<template>
  <v-select
    v-bind="$attrs"
    v-model="syncedValue"
    dense
    :outlined="outlined"
    item-text="name"
    item-value="type"
    :items="taskPriorityNames"
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

  taskPriorityNames: { type: TaskPriorityType; name: string }[] = [
    { type: 'level_1', name: 'Mức 1' },
    { type: 'level_2', name: 'Mức 2' },
    { type: 'level_3', name: 'Mức 3' },
    { type: 'urgent', name: 'Cấp thiết' }
  ]
}

export type TaskPriorityType = 'level_1' | 'level_2' | 'level_3' | 'urgent'
</script>

<style scoped></style>

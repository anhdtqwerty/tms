<template>
  <v-select
    v-bind="$attrs"
    v-model="syncedValue"
    dense
    :outlined="outlined"
    item-text="name"
    item-value="type"
    :items="taskStateNames"
  />
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'
import { TaskStateType } from '@/models/task-model'

@Component
export default class TaskStateSelect extends Vue {
  @PropSync('value', { default: null }) syncedValue: string
  @Prop({ default: true }) outlined: boolean
  @Prop({ default: false }) autoselect: boolean

  taskStateNames: { type: TaskStateType; name: string }[] = [
    { type: 'pending', name: 'Chờ phê duyệt' },
    { type: 'approved', name: 'Đã phê duyệt' }
  ]
}
</script>

<style scoped></style>

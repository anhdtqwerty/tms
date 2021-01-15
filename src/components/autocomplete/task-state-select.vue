<template>
  <v-select
    v-bind="$attrs"
    v-model="syncedValue"
    dense
    :outlined="outlined"
    item-text="value"
    item-value="type"
    :items="items"
  />
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'
import { taskStateNames, TaskStateType } from '@/models/task-model'

@Component
export default class TaskStateSelect extends Vue {
  @PropSync('value', { default: null }) syncedValue: string
  @Prop({ default: true }) outlined: boolean
  @Prop({ default: [] }) includes: TaskStateType[]

  items = taskStateNames

  @Watch('includes', { immediate: true }) onIncludesChanged(val: TaskStateType[]) {
    if (val && val.length > 0) {
      this.items = taskStateNames.filter(t => val.includes(t.type))
    } else {
      this.items = taskStateNames
    }
  }
}
</script>

<style scoped></style>

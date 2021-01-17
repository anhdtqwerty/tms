<template>
  <v-select
    v-bind="$attrs"
    v-model="syncedValue"
    dense
    :outlined="outlined"
    item-text="value"
    item-value="type"
    :items="items"
    clearable
  />
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'
import { taskDeadlineNames } from '@/models/task-model'

@Component
export default class TaskDeadlineTypeSelect extends Vue {
  @PropSync('value', { default: null }) syncedValue: string
  @Prop({ default: true }) outlined: boolean

  items = taskDeadlineNames
}
</script>

<style scoped></style>

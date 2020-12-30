<template>
  <v-select
    v-bind="$attrs"
    v-model="syncedValue"
    dense
    :outlined="outlined"
    item-text="name"
    item-value="type"
    :items="items"
  />
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'
import { taskStateNames } from '@/models/task-model'

@Component
export default class TaskStateSelect extends Vue {
  @PropSync('value', { default: null }) syncedValue: string
  @Prop({ default: true }) outlined: boolean

  items = taskStateNames
}
</script>

<style scoped></style>

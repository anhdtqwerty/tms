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
import { taskProcessingExpireNames } from '@/models/task-model'

@Component
export default class TaskProcessingExpireSelect extends Vue {
  @PropSync('value', { default: null }) syncedValue: string
  @Prop({ default: true }) outlined: boolean

  items = taskProcessingExpireNames
}
</script>

<style scoped></style>

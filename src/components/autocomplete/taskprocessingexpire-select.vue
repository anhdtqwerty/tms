<template>
  <v-select
    v-bind="$attrs"
    v-model="syncedValue"
    dense
    :outlined="outlined"
    item-text="name"
    item-value="type"
    :items="taskProcessingExpireNames"
  />
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'
import { TaskProcessingExpireType } from '@/models/task-model'

@Component
export default class TaskProcessingExpireSelect extends Vue {
  @PropSync('value', { default: null }) syncedValue: string
  @Prop({ default: true }) outlined: boolean
  @Prop({ default: false }) autoselect: boolean

  taskProcessingExpireNames: { type: TaskProcessingExpireType; name: string }[] = [
    { type: 'inProcessing', name: 'Trong hạn' },
    { type: 'expired', name: 'Quá hạn' },
    { type: 'almostExpired', name: 'Sắp hết hạn' }
  ]
}
</script>

<style scoped></style>

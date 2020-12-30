<template>
  <v-select
    v-bind="$attrs"
    v-model="syncedValue"
    dense
    :outlined="outlined"
    item-text="name"
    item-value="type"
    :items="taskStatusNames"
  />
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'

@Component
export default class TaskStatusSelect extends Vue {
  @PropSync('value', { default: null }) syncedValue: string
  @Prop({ default: true }) outlined: boolean
  @Prop() unit: string
  @Prop({ default: true }) unitRequired: boolean
  @Prop({ default: false }) autoselect: boolean

  taskStatusNames: { type: TaskStatusType; name: string }[] = [
    { type: 'toDo', name: 'Chưa thực hiện' },
    { type: 'open', name: 'Chưa cập nhật tiến độ' },
    { type: 'doing', name: 'Đang thực hiện' },
    { type: 'done', name: 'Đã hoàn thành' }
  ]
}

export type TaskStatusType = 'toDo' | 'open' | 'doing' | 'done'
</script>

<style scoped></style>

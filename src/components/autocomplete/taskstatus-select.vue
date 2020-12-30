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
import { TaskStatusType } from '@/models/task-model'

@Component
export default class TaskStatusSelect extends Vue {
  @PropSync('value', { default: null }) syncedValue: string
  @Prop({ default: true }) outlined: boolean
  @Prop({ default: false }) autoselect: boolean

  taskStatusNames: { type: TaskStatusType; name: string }[] = [
    { type: 'toDo', name: 'Chưa thực hiện' },
    { type: 'open', name: 'Chưa cập nhật tiến độ' },
    { type: 'doing', name: 'Đang thực hiện' },
    { type: 'done', name: 'Đã hoàn thành' }
  ]
}
</script>

<style scoped></style>

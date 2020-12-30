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
export default class TaskStatusSelect extends Vue {
  @PropSync('value', { default: null }) syncedValue: string
  @Prop({ default: true }) outlined: boolean
  @Prop() unit: string
  @Prop({ default: true }) unitRequired: boolean
  @Prop({ default: false }) autoselect: boolean

  items: { title: string; value: string }[] = [
    { title: 'Chưa thực hiện', value: 'ToDo' },
    { title: 'Chưa cập nhật tiến độ', value: 'Open' },
    { title: 'Đang thực hiện', value: 'Doing' },
    { title: 'Đã hoàn thành', value: 'Done' }
  ]
}
</script>

<style scoped></style>

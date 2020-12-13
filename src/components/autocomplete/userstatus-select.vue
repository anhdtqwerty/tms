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
export default class UserStatusSelect extends Vue {
  @PropSync('value', { default: false }) syncedValue: boolean
  @Prop({ default: true }) outlined: boolean
  items: { title: string; value: boolean }[] = [
    { title: 'Hoạt động', value: false },
    { title: 'Blocked', value: true }
  ]
}
</script>

<style scoped></style>

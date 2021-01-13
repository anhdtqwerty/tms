<template>
  <v-chip color="green" text-color="white">
    {{ text }}
  </v-chip>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { taskStateNameMap, TaskStateType } from '@/models/task-model'

@Component({
  components: {}
})
export default class TaskStateComponent extends Vue {
  @Prop() state: TaskStateType

  text = ''

  @Watch('state', { immediate: true }) onstatechange(val: TaskStateType) {
    if (val) this.text = taskStateNameMap[val]
    else this.text = ''
  }
}
</script>

<style scoped></style>

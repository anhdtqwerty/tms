<template>
  <v-chip v-if="highlight" color="primary" text-color="white">
    {{ state | taskState }}
  </v-chip>
  <div v-else>{{ state | taskState }}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { TaskStateType } from '@/models/task-model'

@Component({
  components: {}
})
export default class TaskStateComponent extends Vue {
  @Prop() state: TaskStateType
}
</script>

<style scoped></style>

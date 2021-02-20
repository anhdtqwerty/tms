<template>
  <v-menu attach :close-on-content-click="true" transition="scale-transition" left>
    <template v-slot:activator="{ on }">
      <v-btn small icon v-on="on">
        <v-icon>
          more_vert
        </v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="item in items"
        :key="item.type"
        @click.stop="$emit('task-action', item.type)"
        :disabled="!item.enable"
      >
        <v-icon :color="item.enable ? 'blue' : null" left>{{ item.icon }}</v-icon>
        <span :class="item.enable && 'blue--text'">{{ item.title }}</span>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { permissionHelper } from '@/helpers/permission-helper'
import { actionConfigs, TaskActionType, TaskModel } from '@/models/task-model'
import { Component, Inject, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'

interface TaskActionDisplay {
  icon: string
  type: TaskActionType
  title: string
  enable: boolean
}

@Component({
  components: {}
})
export default class TaskSubActionMenu extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Prop() task: TaskModel

  items: TaskActionDisplay[] = []

  @Watch('task', { immediate: true }) onTaskChanged(task: TaskModel) {
    if (!task) return
    const taskType = task.parent ? 'sub' : 'main'
    const displayActions: TaskActionType[] = ['edit', 'delete', 'revoke', 'assign', 'extend', 'approve', 'reopen']
    this.items = [
      { icon: 'visibility', type: 'read', title: 'Xem nhiệm vụ', enable: true },
      ...actionConfigs
        .filter(t => displayActions.includes(t.type))
        .filter(t => permissionHelper.check(`task.${taskType}.${t.permission}`, t.requiredLeader))
        .map(({ icon, type, title, checkEnable }) => {
          return { icon, type, title, enable: checkEnable(task, undefined) }
        })
    ]
  }
}
</script>

<style scoped></style>

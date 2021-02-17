<template>
  <v-list>
    <v-list-item v-for="item in items" :key="item.type" @click.stop="menuClick(item)" :disabled="!item.enable">
      <v-icon :color="item.enable ? 'blue' : null" left>{{ item.icon }}</v-icon>
      <span :class="item.enable && 'blue--text'">{{ item.title }}</span>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { permissionHelper } from '@/helpers/permission-helper'
import { actionConfigs, TaskActionType, TaskModel, TaskRouteType } from '@/models/task-model'
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
export default class TaskActionDialog extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Prop() task: TaskModel
  @Prop() taskRoute: TaskRouteType

  items: TaskActionDisplay[] = []

  menuClick(item: TaskActionDisplay) {
    this.$emit('task-action', item.type)
  }

  @Watch('task', { immediate: true }) onTaskChanged(val: TaskModel) {
    if (!val) return
    const taskType = val.parent ? 'sub' : 'main'
    this.items = actionConfigs
      .filter(t => permissionHelper.check(`task.${taskType}.${t.permission}`))
      .filter(t => {
        if (this.taskRoute === 'task-assigned') {
          const hideActions: TaskActionType[] = ['edit', 'revoke', 'extend']
          return !hideActions.includes(t.type)
        }
        return true
      })
      .map(({ icon, type, title, checkEnable }) => {
        return { icon, type, title, enable: checkEnable(val, this.taskRoute) }
      })
  }
}
</script>

<style scoped></style>

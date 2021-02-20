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
      <v-list-item v-for="item in items" :key="item.type" @click.stop="$emit('task-action', item.type)">
        <v-icon color="blue" left>{{ item.icon }}</v-icon>
        <span class="blue--text">{{ item.title }}</span>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { permissionHelper } from '@/helpers/permission-helper'
import { actionConfigs, TaskActionType, TaskModel } from '@/models/task-model'
import { Component, Inject, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class TaskSubActionMenu extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Prop() task: TaskModel

  items: { icon: string; type: TaskActionType; title: string }[] = []

  @Watch('task', { immediate: true }) onTaskChanged(task: TaskModel) {
    if (!task) return
    this.items = [
      { icon: 'visibility', type: 'read', title: 'Xem nhiệm vụ' },
      ...actionConfigs
        .filter(t => t.type === 'edit' || t.type === 'delete')
        .filter(t => permissionHelper.check(`task.sub.${t.permission}`, t.requiredLeader))
        .map(({ icon, type, title }) => {
          return { icon, type, title }
        })
    ]
  }
}
</script>

<style scoped></style>

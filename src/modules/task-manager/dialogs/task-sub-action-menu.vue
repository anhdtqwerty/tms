<template>
  <v-menu attach :close-on-content-click="true" transition="scale-transition" left>
    <template v-slot:activator="{ on }">
      <v-btn small icon v-on="on">
        <v-icon>
          more_vert
        </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-container fluid px-5 py-2>
        <v-row>
          <v-col cols="12" class="pa-2">
            <div class="mb-4" @click="showDetail(task)">
              <v-icon color="blue" left>visibility</v-icon>
              <span class="blue--text">Xem nhiệm vụ </span>
            </div>
            <div class="mb-4">
              <v-icon color="blue" left>edit</v-icon>
              <span class="blue--text">Sửa nhiệm vụ</span>
            </div>
            <div class="mb-4">
              <v-icon color="blue" left>delete</v-icon>
              <span class="blue--text">Xóa nhiệm vụ</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { TaskModel } from '@/models/task-model'
import { Component, Inject, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class TaskSubActionMenu extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Prop() task: TaskModel

  @Watch('task') onTaskChange(val: TaskModel) {
    console.log('task', val)
  }

  showEdit() {
    this.$emit('showEdit')
  }

  showDetail(item: TaskModel) {
    this.$router.push({ path: '/task/' + item.id })
  }
}
</script>

<style scoped></style>

<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" scrollable width="300" v-model="syncedValue">
    <v-card>
      <v-container fluid px-5 py-2>
        <v-row>
          <v-col cols="12" class="pa-2">
            <div class="mb-4" @click="showTaskEditDialog = true">
              <v-icon color="blue" left>edit</v-icon>
              <span class="blue--text">Cập nhật thông tin</span>
            </div>
            <div class="mb-4">
              <v-icon color="blue" left>replay</v-icon>
              <span class="blue--text">Thu hồi nhiệm vụ</span>
            </div>
            <div class="mb-4">
              <v-icon color="blue" left>access_time</v-icon>
              <span class="blue--text">Gia hạn nhiệm vụ</span>
            </div>
            <div class="mb-4">
              <v-icon color="blue" left>replay</v-icon>
              <span class="blue--text">Trả lại nhiệm vụ</span>
            </div>
            <div class="mb-4">
              <v-icon color="blue" left>pan_tool</v-icon>
              <span class="blue--text">Giao thực hiện</span>
            </div>
            <div class="mb-4">
              <v-icon color="blue" left>offline_pin</v-icon>
              <span class="blue--text">Phê duyệt nhiệm vụ</span>
            </div>
            <div class="mb-4">
              <v-icon color="blue" left>account_box</v-icon>
              <span class="blue--text">Cập nhật tiến độ</span>
            </div>
            <div class="mb-4">
              <v-icon color="blue" left>edit</v-icon>
              <span class="blue--text">Sửa cập nhật</span>
            </div>
            <div class="mb-4">
              <v-icon color="blue" left>delete</v-icon>
              <span class="blue--text">Xóa cập nhật</span>
            </div>
            <div class="mb-4">
              <v-icon color="blue" left>lock_open</v-icon>
              <span class="blue--text">Mở lại nhiệm vụ</span>
            </div>
            <div class="mb-4">
              <v-icon color="blue" left>delete</v-icon>
              <span class="blue--text">Xóa nhiệm vụ</span>
            </div>
          </v-col>
        </v-row>

        <task-edit-dialog :value.sync="showTaskEditDialog" :task="taskModel" title="CẬP NHẬT THÔNG TIN NHIỆM VỤ" />
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { TaskModel } from '@/models/task-model'
import { Component, Inject, PropSync, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {
    TaskEditDialog: () => import('../dialogs/task-edit-dialog.vue')
  }
})
export default class TaskActionDialog extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Prop() task: TaskModel

  showTaskEditDialog = false
  taskModel: TaskModel = null
  @Watch('task') onUnitChanged(val: TaskModel) {
    if (val) {
      this.taskModel = val
    }
  }
}
</script>

<style scoped></style>

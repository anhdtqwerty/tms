<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="884" v-model="syncedValue" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>PHÊ DUYỆT NHIỆM VỤ {{ task && task.code }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form ref="form" style="overflow-y: auto">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12">
              <div class="text-subtitle-2">Kết quả thực hiện</div>
            </v-col>
            <v-col cols="12" sm="6">
              <app-text-field v-model="code" label="Số/ký hiệu" />
              <date-picker-input :value.sync="executedDate" label="Ngày thực hiện" />
              <app-text-field v-model="description" label="Nội dung nhiệm vụ" />
            </v-col>
            <v-col cols="12" sm="6">
              <task-approvement-status-select :value.sync="approvementStatus" label="Trạng thái" />
              <app-file-input label="File đính kèm" />
              <app-text-field v-model="explain" label="Diễn giải trạng thái" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <div class="text-subtitle-2 mb-4">Chuyên viên phê duyệt kết quả</div>
              <v-radio-group row class="ma-0 pa-0" v-model="approveStatusResult">
                <v-radio label="Phê duyệt" value="approved" />
                <v-radio label="Trả lại" value="reject" />
              </v-radio-group>
            </v-col>
            <v-col cols="12" sm="6">
              <app-text-field v-model="reason" label="Lý do" />
            </v-col>
            <v-col>
              <app-file-input label="File đính kèm" />
            </v-col>
            <v-col cols="12" class="pa-2 d-flex justify-space-between">
              <div class="d-flex flex-column">
                <!-- <span class="red--text" v-for="error in submitErrors" :key="error">{{ error }}</span> -->
              </div>

              <v-btn depressed color="primary" medium @click="save">
                <span>Lưu</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Inject, Prop, PropSync, Ref, Vue, Watch } from 'vue-property-decorator'
import { TaskApprovementStatusType, TaskModel } from '@/models/task-model'

@Component({
  components: {
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue'),
    TaskApprovementStatusSelect: () => import('@/components/autocomplete/task-approvement-status-select.vue')
  }
})
export default class TaskApproveDialog extends Vue {
  @Inject() providers: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Ref('form') form: any
  @Prop() task: TaskModel

  code = ''
  executedDate = ''
  description = ''
  reason = ''
  approvementStatus = 'requesting'
  explain = ''
  approveStatusResult: TaskApprovementStatusType = 'approved'

  @Watch('task', { immediate: true }) onTaskChanged(val: TaskModel) {
    if (val) {
      this.code = val.code
      this.description = val.description
    }
  }

  async save() {
    if (this.form.validate()) {
      let task: TaskModel = {
        ...this.task,
        description: this.description,
        status: this.approveStatusResult
      }
      task = await this.providers.api.task.update(task.id, task)
      this.$emit('success', task)
      this.syncedValue = false
    }
  }
}
</script>

<style scoped></style>

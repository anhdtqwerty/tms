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
            <v-col cols="12" class="pa-2">
              <div class="text-subtitle-2">Kết quả thực hiện</div>
            </v-col>
            <v-col cols="12" sm="6" class="pa-2">
              <app-text-field v-model="code" disabled label="Số/ký hiệu" />
              <date-picker-input :value.sync="startedDate" disabled label="Ngày thực hiện" />
              <app-textarea v-model="description" rows="2" hide-details disabled label="Nội dung nhiệm vụ" />
            </v-col>
            <v-col cols="12" sm="6" class="pa-2">
              <task-approvement-status-select disabled :value.sync="approvementStatus" label="Trạng thái" />
              <!-- <document-files v-if="task.files.length" :files="task.files" /> -->
              <app-file-input label="File đính kèm" />

              <app-text-field disabled v-model="explain" hide-details label="Diễn giải trạng thái" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="pa-2">
              <div class="text-subtitle-2 mb-4">Chuyên viên phê duyệt kết quả</div>
              <v-radio-group hide-details row class="ma-0 pa-0" v-model="approveStatusResult">
                <v-radio label="Phê duyệt" value="approved" />
                <v-radio label="Trả lại" value="reject" />
              </v-radio-group>
            </v-col>
            <v-col cols="12" sm="6" class="pa-2">
              <app-text-field
                hide-details
                v-model="reasonReject"
                v-if="approveStatusResult === 'reject'"
                :rules="$appRules.taskExplain"
                label="Lý do"
              />
            </v-col>
            <v-col class="pa-2">
              <app-file-input hide-details :value.sync="approverSelectedFiles" label="File đính kèm" />
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
import { createTaskBody, getLastRequest, TaskApprovementStatusType, TaskModel } from '@/models/task-model'

@Component({
  components: {
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue'),
    TaskApprovementStatusSelect: () => import('@/components/autocomplete/task-approvement-status-select.vue'),
    DocumentFiles: () => import('@/components/files/document-files.vue')
  }
})
export default class TaskApproveDialog extends Vue {
  @Inject() providers: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Ref('form') form: any
  @Prop() task: TaskModel

  code = ''
  startedDate: string = null
  description = ''
  reasonReject = ''
  approvementStatus: TaskApprovementStatusType = 'approving'
  explain = ''
  approveStatusResult: TaskApprovementStatusType = 'approved'
  approverSelectedFiles: File[] = []

  @Watch('task', { immediate: true }) onTaskChanged(val: TaskModel) {
    if (val) {
      this.code = val.code
      this.description = val.description
      this.explain = val.explainState
      const lastRequest = getLastRequest(val)
      if (lastRequest) this.startedDate = lastRequest.startedDate
    }
  }

  async save() {
    if (this.form.validate()) {
      try {
        let task: TaskModel = {
          description: this.description,
          status: this.approveStatusResult,
          state: this.approveStatusResult === 'approved' ? 'done' : 'doing'
        }

        await Promise.all(
          this.approverSelectedFiles.map(f =>
            this.providers.api.uploadFiles(f, {
              model: 'task',
              modelId: task.id,
              modelField: 'files'
            })
          )
        )

        task = await this.providers.api.task.update(this.task.id, createTaskBody(this.task, task))

        this.$emit('success', task)
        this.syncedValue = false
        this.providers.snackbar.updateSuccess()
      } catch (error) {
        this.providers.snackbar.commonError(error)
      }
    }
  }
}
</script>

<style scoped></style>

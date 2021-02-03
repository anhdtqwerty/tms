<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="884" v-model="syncedValue" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>CẬP NHẬT THÔNG TIN NHIỆM VỤ {{ task && task.code }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form ref="form" style="overflow-y: auto">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12" class="pa-2">
              <div class="text-subtitle-2">Thông tin văn bản chỉ đạo, điều hành</div>
            </v-col>
            <v-col cols="12" sm="6" class="pa-2">
              <app-text-field v-model="code" disabled label="Số/ký hiệu" />
              <date-picker-input :value.sync="publishedDate" label="Ngày ban hành" />
              <app-text-field v-model="title" label="Trích yếu" />
            </v-col>
            <v-col cols="12" sm="6" class="pa-2">
              <task-priority-select :value.sync="priority" :rules="$appRules.taskPriority" label="Mức độ quan trọng" />
              <app-file-input :value.sync="selectedFiles" label="File đính kèm" />
              <app-text-field v-model="docsInfo" label="Thông tin văn bản đến" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="pa-2">
              <div class="text-subtitle-2">Thông tin nhiệm vụ</div>
            </v-col>
            <v-col cols="12" sm="6" class="pa-2">
              <app-text-field v-model="description" :rules="$appRules.taskDescription" label="Nội dung nhiệm vụ" />
              <unit-autocomplete :value.sync="executedUnitId" label="Đơn vị thực hiện" />
              <unit-autocomplete :value.sync="supportedUnitIds" multiple label="Đơn vị phối hợp" />
              <comrade-autocomplete
                :value.sync="executedComradeId"
                :unit="executedUnitId"
                label="Chuyên viên thực hiện"
              />
              <comrade-autocomplete
                :value.sync="supportedComradeIds"
                :unit="supportedUnitIds"
                multiple
                hide-details
                label="Chuyên viên phối hợp"
              />
            </v-col>
            <v-col cols="12" sm="6" class="pa-2">
              <task-deadline-type-select
                class="mb-6"
                hide-details
                :value.sync="deadlineType"
                :rules="$appRules.taskDeadlineType"
                label="Loại hạn xử lý"
              />
              <date-picker-input
                :value.sync="expiredDate"
                :disabled="deadlineType !== 'hasDeadline'"
                label="Hạn xử lý"
              />
              <unit-autocomplete :value.sync="supervisorUnitId" label="Đơn vị theo dõi" />
              <comrade-autocomplete :value.sync="supervisorId" :unit="supervisorUnitId" label="Chuyên viên theo dõi" />
              <task-state-select :value.sync="state" disabled hide-details label="Trạng thái" />
            </v-col>
            <v-col cols="12" class="pa-2 d-flex justify-space-between">
              <div class="d-flex flex-column">
                <!-- <span class="red--text" v-for="error in submitErrors" :key="error">{{ error }}</span> -->
              </div>

              <v-btn depressed color="primary" medium @click="save">
                <span>Hoàn thành</span>
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
import { ComradeModel } from '@/models/comrade-model'
import { createTaskBody, TaskDeadlineType, TaskModel, TaskPriorityType, TaskStateType } from '@/models/task-model'
import _ from 'lodash'
import { Component, Inject, Prop, PropSync, Ref, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {
    UnitAutocomplete: () => import('@/components/autocomplete/unit-autocomplete.vue'),
    ComradeAutocomplete: () => import('@/components/autocomplete/comrade-autocomplete.vue'),
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue'),
    TaskPrioritySelect: () => import('@/components/autocomplete/task-priority-select.vue'),
    TaskStateSelect: () => import('@/components/autocomplete/task-state-select.vue'),
    TaskDeadlineTypeSelect: () => import('@/components/autocomplete/task-deadline-type-select.vue')
  }
})
export default class TaskEditDialog extends Vue {
  @Inject() providers: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Ref('form') form: any
  @Prop() task: TaskModel

  code = ''
  publishedDate: string = null
  title = ''
  priority: TaskPriorityType = null
  attachFile = ''
  docsInfo = ''
  description = ''
  executedUnitId = ''
  supportedUnitIds: string[] = []
  executedComradeId = ''
  supportedComradeIds: string[] = []
  deadlineType: TaskDeadlineType = null
  state: TaskStateType = null
  supervisorId = ''
  supervisorUnitId = ''
  expiredDate: string = null
  selectedFiles: File[] = []

  @Watch('task', { immediate: true }) onTaskChanged(val: TaskModel) {
    if (val) {
      this.code = val.code
      this.description = val.description
      this.publishedDate = val.publishedDate
      this.deadlineType = val.type
      this.expiredDate = val.expiredDate
      this.title = val.title
      this.state = val.state
      this.priority = val.priority

      this.executedUnitId = _.get(val.executedUnit, 'id')
      this.executedComradeId = _.get(val.executedComrade, 'id')

      this.supervisorUnitId = _.get(val.supervisorUnit, 'id')
      this.supervisorId = _.first(val.supervisors as ComradeModel[])?.id

      this.supportedUnitIds = _.map(val.supportedUnits, 'id')
      this.supportedComradeIds = _.map(val.supportedComrades, 'id')

      this.docsInfo = val.documentInfo
    }
  }

  @Watch('deadlineType') onDeadlineTypeChange(val: TaskDeadlineType) {
    if (val !== 'hasDeadline') {
      this.expiredDate = null
    }
  }

  async save() {
    if (this.form.validate()) {
      try {
        if (this.selectedFiles.length) {
          await Promise.all(
            this.selectedFiles.map(f =>
              this.providers.api.uploadFiles(f, {
                model: 'task',
                modelId: this.task.id,
                modelField: 'files'
              })
            )
          )
        }

        let task: TaskModel = {
          code: this.code,
          description: this.description,
          publishedDate: this.publishedDate,
          type: this.deadlineType,
          expiredDate: this.deadlineType === 'hasDeadline' ? this.expiredDate : undefined,
          title: this.title,
          state: this.state,
          priority: this.priority,

          executedUnit: this.executedUnitId,
          executedComrade: this.executedComradeId,

          supervisorUnit: this.supervisorUnitId,
          supervisors: this.supervisorId ? [this.supervisorId] : [],

          supportedUnits: this.supportedUnitIds,
          supportedComrades: this.supportedComradeIds,

          documentInfo: this.docsInfo
        }
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

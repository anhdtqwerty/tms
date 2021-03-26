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
          <v-row v-if="task && !task.parent">
            <v-col cols="12" class="pa-2">
              <div class="text-subtitle-2">Thông tin văn bản chỉ đạo, điều hành</div>
            </v-col>
            <v-col cols="12" sm="6" class="pa-2">
              <app-text-field v-model="code" disabled label="Số/ký hiệu" />
              <app-text-field
                :value.sync="publishedDateDisplay"
                @click="showPublishedDateInputDialog = true"
                append-icon="expand_more"
                @click:append="showPublishedDateInputDialog = true"
                readonly
                clearable
                @click:clear="clearPublishedDate"
                label="Ngày ban hành"
              />
              <date-input-dialog :value.sync="showPublishedDateInputDialog" @ok="handlePublishedDateInput" />

              <app-text-field v-model="title" :rules="$appRules.taskTitle" label="Trích yếu" />
            </v-col>
            <v-col cols="12" sm="6" class="pa-2">
              <task-priority-select :value.sync="priority" :rules="$appRules.taskPriority" label="Mức độ quan trọng" />
              <app-file-input :value.sync="selectedFiles" label="File đính kèm" />
              <app-text-field v-model="docsInfo" :rules="$appRules.taskDocsInfo" label="Thông tin văn bản đến" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="pa-2">
              <div class="text-subtitle-2">Thông tin nhiệm vụ</div>
            </v-col>
            <v-col cols="12" sm="6" class="pa-2">
              <app-text-field v-model="description" :rules="$appRules.taskDescription" label="Nội dung nhiệm vụ" />
              <unit-department-autocomplete :value.sync="executedUnitDep" label="Đơn vị thực hiện" />
              <unit-department-autocomplete :value.sync="supportedUnitDeps" multiple label="Đơn vị phối hợp" />

              <comrade-autocomplete
                :value.sync="executedComradeId"
                :unitDep="executedUnitDep"
                label="Chuyên viên thực hiện"
              />
              <comrade-autocomplete
                :value.sync="supportedComradeIds"
                :unitDep="supportedUnitDeps"
                :multiple="true"
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
              <app-text-field
                class="mb-6"
                :value.sync="expiredDateDisplay"
                v-if="deadlineType === 'hasDeadline'"
                :rules="$appRules.taskExpiredDate"
                @click="showExpiredDateInputDialog = true"
                append-icon="expand_more"
                @click:append="showExpiredDateInputDialog = true"
                readonly
                hide-details
                clearable
                @click:clear="clearExpiredDate"
                label="Hạn xử lý"
              />
              <date-input-dialog :value.sync="showExpiredDateInputDialog" @ok="handleExpiredDateInput" />

              <unit-department-autocomplete :value.sync="supervisorUnitDep" label="Đơn vị theo dõi" />
              <comrade-autocomplete
                :value.sync="supervisorId"
                :unitDep="supervisorUnitDep"
                label="Chuyên viên theo dõi"
              />
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
import { DepartmentModel } from '@/models/department-model'
import { createTaskBody, TaskDeadlineType, TaskModel, TaskPriorityType, TaskStateType } from '@/models/task-model'
import { UnitModel } from '@/models/unit-model'
import _ from 'lodash'
import moment from 'moment'
import { Component, Inject, Prop, PropSync, Ref, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {
    UnitDepartmentAutocomplete: () => import('@/components/autocomplete/unit-department-autocomplete.vue'),
    ComradeAutocomplete: () => import('@/components/autocomplete/comrade-autocomplete.vue'),
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue'),
    TaskPrioritySelect: () => import('@/components/autocomplete/task-priority-select.vue'),
    TaskStateSelect: () => import('@/components/autocomplete/task-state-select.vue'),
    TaskDeadlineTypeSelect: () => import('@/components/autocomplete/task-deadline-type-select.vue'),
    DateInputDialog: () => import('@/components/picker/date-input-dialog.vue')
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
  supportedDepartmentIds: string[] = []

  executedComradeId = ''
  executedDepartmentId = ''
  supportedComradeIds: string[] = []
  deadlineType: TaskDeadlineType = null
  state: TaskStateType = null
  supervisorId = ''
  supervisorUnitId = ''
  supervisorDepartmentId = ''
  expiredDate: string = null
  selectedFiles: File[] = []

  executedUnitDep = {}
  supportedUnitDeps: { department?: string; unit?: string }[] = []
  supervisorUnitDep = {}

  publishedDateDisplay: string = null
  showPublishedDateInputDialog = false

  expiredDateDisplay: string = null
  showExpiredDateInputDialog = false

  @Watch('task', { immediate: true }) onTaskChanged(val: TaskModel) {
    if (val) {
      this.code = val.code
      this.description = val.description
      this.publishedDate = val.publishedDate
      this.publishedDateDisplay = moment(val.publishedDate).format('DD/MM/YYYY')
      this.deadlineType = val.type
      this.expiredDate = val.expiredDate
      this.expiredDateDisplay = moment(val.expiredDate).format('DD/MM/YYYY')
      this.title = val.title
      this.state = val.state
      this.priority = val.priority

      this.executedUnitId = _.get(val.executedUnit, 'id')
      this.executedDepartmentId = _.get(val.executedDepartment, 'id')
      this.executedComradeId = _.get(val.executedComrade, 'id')
      this.executedUnitDep = { unit: this.executedUnitId, department: this.executedDepartmentId }

      this.supervisorUnitId = _.get(val.supervisorUnit, 'id')
      this.supervisorDepartmentId = _.get(val.supervisorDepartment, 'id')
      this.supervisorId = _.first(val.supervisors as ComradeModel[])?.id
      this.supervisorUnitDep = { unit: this.supervisorUnitId, department: this.supervisorDepartmentId }

      this.supportedUnitIds = _.map(val.supportedUnits, 'id')
      this.supportedDepartmentIds = _.map(val.supportedDepartments, 'id')
      this.supportedComradeIds = _.map(val.supportedComrades, 'id')
      if (val.supportedDepartments.length) {
        this.supportedUnitDeps = val.supportedDepartments.map(d => ({
          department: (d as DepartmentModel).id,
          unit: _.get(d, 'unit')
        }))
      } else {
        this.supportedUnitDeps = val.supportedUnits.map(u => ({ department: undefined, unit: (u as UnitModel).id }))
      }

      this.docsInfo = val.documentInfo
    }
  }

  @Watch('deadlineType') onDeadlineTypeChange(val: TaskDeadlineType) {
    if (val !== 'hasDeadline') {
      this.expiredDate = null
    }
  }

  handlePublishedDateInput(date: string) {
    this.publishedDate = date
    this.publishedDateDisplay = moment(date).format('DD/MM/YYYY')
  }
  clearPublishedDate() {
    this.publishedDate = null
    this.publishedDateDisplay = null
  }

  handleExpiredDateInput(date: string) {
    this.expiredDate = date
    this.expiredDateDisplay = moment(date).format('DD/MM/YYYY')
  }
  clearExpiredDate() {
    this.expiredDate = null
    this.expiredDateDisplay = null
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
          expiredDate: this.deadlineType === 'hasDeadline' ? this.expiredDate : null,
          title: this.title,
          state: this.state,
          priority: this.priority,

          executedUnit: _.get(this.executedUnitDep, 'unit') ?? null,
          executedComrade: this.executedComradeId,
          executedDepartment: _.get(this.executedUnitDep, 'department') ?? null,

          supervisors: this.supervisorId ? [this.supervisorId] : [],
          supervisorUnit: _.get(this.supervisorUnitDep, 'unit') ?? null,
          supervisorDepartment: _.get(this.supervisorUnitDep, 'department') ?? null,

          supportedComrades: this.supportedComradeIds,
          supportedUnits: this.supportedUnitDeps.map(u => u.unit),
          supportedDepartments: this.supportedUnitDeps.map(d => d.department),

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

<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="884" v-model="syncedValue" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>THÊM MỚI NHIỆM VỤ</v-toolbar-title>
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
            <v-col cols="12" md="7" class="pa-2 py-0">
              <app-text-field v-model="code" class="required" :rules="$appRules.taskCode" label="Số/ký hiệu" />
            </v-col>
            <v-col cols="12" md="4" class="pa-2 py-0">
              <app-text-field label="Loại văn bản" />
            </v-col>

            <v-col cols="12" md="7" class="pa-2 py-0">
              <app-text-field class="required" v-model="title" :rules="$appRules.taskTitle" label="Trích yếu" />
            </v-col>
            <v-col cols="12" md="4" class="pa-2 py-0">
              <date-iso-picker :date.sync="publishedDate" label="Ngày ban hành" :rules="[$rules.date]" dense outlined />
            </v-col>
            <v-col cols="12" md="7" class="pa-2 py-0">
              <app-file-input :value.sync="selectedFiles" label="File đính kèm" />
            </v-col>
            <v-col cols="12" md="4" class="pa-2 py-0">
              <app-text-field label="Lãnh đạo Bộ giao" />
            </v-col>

            <v-col cols="12" class="pa-2">
              <div class="text-subtitle-2">Thông tin nhiệm vụ</div>
            </v-col>
            <v-row class="pa-2" v-for="(task, index) in taskArray" :key="index">
              <v-col class="pl-4 py-0" cols="12" md="7">
                <app-textarea
                  rows="4"
                  v-model="task.description"
                  class="required"
                  :rules="$appRules.taskDescription"
                  label="Nội dung nhiệm vụ"
                />
              </v-col>
              <v-col class="pa-2 py-0" cols="12" md="4">
                <date-iso-picker
                  :date.sync="task.expiredDate"
                  label="Hạn xử lý"
                  :rules="[$rules.date]"
                  dense
                  outlined
                />
                <unit-autocomplete
                  class="pt-3"
                  hide-details
                  :value.sync="task.executedUnit"
                  label="Đơn vị thực hiện"
                  :ignoreUserUnit="true"
                />
              </v-col>
              <v-col cols="12" md="1" class="pl-0 py-0 d-flex justify-space-between flex-column">
                <v-btn v-show="taskArray.length > 1 && index === taskArray.length - 1" @click="removeTask">
                  <v-icon>close</v-icon></v-btn
                >

                <v-btn
                  class="mb-7"
                  v-if="taskArray.length < 5 && index === taskArray.length - 1"
                  color="success"
                  @click="addTask"
                >
                  <v-icon class="white--text">add</v-icon></v-btn
                >
              </v-col>
            </v-row>

            <!-- <v-col cols="12" md="8" class="pa-2 py-0">
              <app-textarea
                rows="2"
                v-model="description"
                class="required"
                :rules="$appRules.taskDescription"
                label="Nội dung nhiệm vụ"
              />
            </v-col>
            <v-col cols="12" md="4" class="pa-2 py-0">
              <app-text-field
                class="mb-6"
                :value.sync="expiredDateDisplay"
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
            </v-col> -->
            <!-- <v-col class="pa-2 py-0" cols="12" md="6">
              <unit-department-autocomplete :value.sync="executedUnitDep" label="Đơn vị thực hiện" />
              <unit-autocomplete :value.sync="executedUnit" label="Đơn vị thực hiện" :ignoreUserUnit="true" />
            </v-col> -->

            <!-- <v-col class="pa-2 py-0" cols="12" md="6">
              <comrade-autocomplete
                :value.sync="executedComradeId"
                :unitDep="executedUnitFilter"
                label="Chuyên viên thực hiện"
              />
            </v-col>
            <v-col class="pa-2 py-0" cols="12" md="6">
              <unit-department-autocomplete :value.sync="supportedUnitDeps" multiple label="Đơn vị phối hợp" />
              <unit-autocomplete
                :value.sync="supportedUnits"
                label="Đơn vị phối hợp"
                :multiple="true"
                :ignoreUserUnit="true"
              />
            </v-col>
            <v-col class="pa-2 py-0" cols="12" md="6">
              <comrade-autocomplete
                :value.sync="supportedComradeIds"
                :unitDep="supportedUnitFilters"
                :multiple="true"
                hide-details
                label="Chuyên viên phối hợp"
              />
            </v-col> -->

            <v-col cols="12" class="pa-2 d-flex justify-space-between">
              <div class="d-flex flex-column">
                <!-- <span class="red--text" v-for="error in submitErrors" :key="error">{{ error }}</span> -->
              </div>

              <v-btn depressed color="primary" medium @click="save">
                <span>Hoàn thành</span>
              </v-btn>
            </v-col>
          </v-row>
          <!-- <date-input-dialog :value.sync="showPublishedDateInputDialog" @ok="handlePublishedDateInput" /> -->
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { mailBuilder } from '@/helpers/mail-helper'
import { createTaskBody, TaskDeadlineType, TaskModel, TaskPriorityType } from '@/models/task-model'
import { authStore } from '@/stores/auth-store'
import _ from 'lodash'
import moment from 'moment'
import { Component, Inject, PropSync, Prop, Ref, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {
    UnitDepartmentAutocomplete: () => import('@/components/autocomplete/unit-department-autocomplete.vue'),
    ComradeAutocomplete: () => import('@/components/autocomplete/comrade-autocomplete.vue'),
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue'),
    TaskPrioritySelect: () => import('@/components/autocomplete/task-priority-select.vue'),
    DateInputDialog: () => import('@/components/picker/date-input-dialog.vue'),
    UnitAutocomplete: () => import('@/components/autocomplete/unit-autocomplete.vue'),
    DateIsoPicker: () => import('@/components/picker/date-iso-picker.vue')
  }
})
export default class TaskAddDialog extends Vue {
  @Inject() providers: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Ref('form') form: any
  @Prop() taskParent: TaskModel

  docsInfo = ''
  code = ''
  publishedDate: string = null
  title = ''
  // descriptions: string[] = []
  expiredDate: string[] = []

  executedComradeId: string = null
  supportedComradeIds: string[] = []
  supervisorId: string = null
  selectedFiles: File[] = []

  // executedUnit: string = null
  executedUnitDep = {}

  supportedUnits: any[] = []
  supportedUnitDeps: { department: string; unit: string }[] = []
  supervisorUnitDep = {}

  publishedDateDisplay: string = null
  showPublishedDateInputDialog = false

  // expiredDateDisplay: string[] = []
  // expiredDateDisplays = {}

  // showExpiredDateInputDialogs: boolean[] = []
  showExpiredDateInputDialogs: { [key: number]: any } = {}

  showExpiredDateInputDialog: string = null

  taskArray: { description: string; expiredDate: string; executedUnit: string }[] = [
    { description: null, expiredDate: null, executedUnit: null }
  ]

  addTask() {
    this.taskArray = [...this.taskArray, { description: null, expiredDate: null, executedUnit: null }]
  }
  removeTask() {
    this.taskArray.splice(this.taskArray.length - 1, 1)
  }

  reset() {
    this.form.reset()
    this.taskArray = [{ description: null, expiredDate: null, executedUnit: null }]
  }

  async save() {
    if (this.form.validate()) {
      try {
        await Promise.all(
          this.taskArray.map(async t => {
            const task = await this.providers.api.task.create(
              createTaskBody(
                {},
                {
                  code: _.get(this.taskParent, 'code') ?? this.code,
                  title: _.get(this.taskParent, 'title') ?? this.title,
                  description: t.description,
                  state: 'waiting',
                  publishedDate: this.publishedDate,
                  expiredDate: t.expiredDate,
                  executedUnit: t.executedUnit,

                  // priority: this.taskParent ? this.taskParent.priority : this.priority,
                  // parent: this.taskParent?.id ?? undefined,
                  // executedComrade: this.executedComradeId,
                  // executedUnit: _.get(this.executedUnitDep, 'unit'),
                  // executedDepartment: _.get(this.executedUnitDep, 'department'),

                  // supervisors: this.supervisorId ? [this.supervisorId] : [],
                  // supervisorUnit: _.get(this.supervisorUnitDep, 'unit'),
                  // supervisorDepartment: _.get(this.supervisorUnitDep, 'department'),

                  // supportedComrades: this.supportedComradeIds,
                  // supportedUnits: this.supportedUnits,
                  // supportedUnits: this.supportedUnitDeps.map(u => u.unit),
                  // supportedDepartments: this.supportedUnitDeps.map(d => d.department),

                  createdBy: authStore.comrade.id,
                  createdDepartment: _.get(authStore.comrade.department, 'id'),
                  createdUnit: _.get(authStore.comrade.unit, 'id')
                  // documentInfo: _.get(this.taskParent, 'documentInfo') ?? this.docsInfo
                }
              )
            )
            this.providers.api.sendMail(mailBuilder.createTask(task))
            const files = await Promise.all(
              this.selectedFiles.map(f =>
                this.providers.api.uploadFiles(f, {
                  model: 'task',
                  modelId: task.id,
                  modelField: 'files'
                })
              )
            )

            this.$emit('success', { ...task, files: _.flatten(files) })
          })
        )

        this.syncedValue = false
        this.reset()
        this.providers.snackbar.addSuccess()
      } catch (error) {
        this.providers.snackbar.commonError(error)
      }
    }
  }
}
</script>

<style scoped></style>

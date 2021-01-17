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
            <v-col cols="12" sm="6" class="pa-2">
              <app-text-field v-model="code" :rules="$appRules.taskCode" label="Số/ký hiệu" />
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
              <div class="text-subtitle-2">Thông tin văn bản chỉ đạo, điều hành</div>
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
                class="mb-6"
                :value.sync="expiredDate"
                :disabled="deadlineType !== 'hasDeadline'"
                label="Hạn xử lý"
              />
              <unit-autocomplete :value.sync="supervisorUnitId" label="Đơn vị theo dõi" />
              <comrade-autocomplete :value.sync="supervisorId" :unit="supervisorUnitId" label="Chuyên viên theo dõi" />
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
import { createTaskBody, TaskDeadlineType, TaskModel, TaskPriorityType } from '@/models/task-model'
import { authStore } from '@/stores/auth-store'
import _ from 'lodash'
import { Component, Inject, PropSync, Prop, Ref, Vue } from 'vue-property-decorator'

@Component({
  components: {
    UnitAutocomplete: () => import('@/components/autocomplete/unit-autocomplete.vue'),
    ComradeAutocomplete: () => import('@/components/autocomplete/comrade-autocomplete.vue'),
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue'),
    TaskPrioritySelect: () => import('@/components/autocomplete/task-priority-select.vue'),
    TaskDeadlineTypeSelect: () => import('@/components/autocomplete/task-deadline-type-select.vue')
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
  description = ''
  deadlineType: TaskDeadlineType = 'noDeadline'
  expiredDate: string = null
  priority: TaskPriorityType = null

  executedUnitId = ''
  supportedUnitIds: string[] = []
  supervisorUnitId = ''

  executedComradeId = ''
  supportedComradeIds: string[] = []
  supervisorId = ''
  selectedFiles: File[] = []

  async save() {
    if (this.form.validate()) {
      try {
        const task = await this.providers.api.task.create(
          createTaskBody(
            {},
            {
              code: this.code,
              title: this.title,
              description: this.description,
              priority: this.priority,
              state: 'waiting',
              publishedDate: this.publishedDate,
              type: this.deadlineType,
              expiredDate: this.deadlineType === 'hasDeadline' ? this.expiredDate : undefined,
              parent: this.taskParent?.id ?? undefined,

              executedUnit: this.executedUnitId,
              executedComrade: this.executedComradeId,

              supportedUnits: this.supportedUnitIds,
              supervisors: this.supervisorId ? [this.supervisorId] : [],

              supervisorUnit: this.supervisorUnitId,
              supportedComrades: this.supportedComradeIds,

              createdBy: authStore.comrade.id,
              createdDepartment: _.get(authStore.comrade.department, 'id'),
              createdUnit: _.get(authStore.comrade.unit, 'id'),
              documentInfo: this.docsInfo
            }
          )
        )
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
        this.syncedValue = false
        this.form.reset()
        this.providers.snackbar.addSuccess()
      } catch (error) {
        this.providers.snackbar.commonError(error)
      }
    }
  }
}
</script>

<style scoped></style>

<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="884" v-model="syncedValue" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>{{ title }} {{ code }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form ref="form" style="overflow-y: auto">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12">
              <div class="text-subtitle-2">Thông tin văn bản chỉ đạo, điều hành</div>
            </v-col>
            <v-col cols="12" sm="6">
              <app-text-field v-model="code" label="Số/ký hiệu" />
              <date-picker-input :value.sync="pushlishedDate" label="Ngày ban hành" />
              <app-text-field v-model="shortDescription" label="Trích yếu" />
            </v-col>
            <v-col cols="12" sm="6">
              <task-priority-select :value.sync="priority" label="Mức độ quan trọng" />
              <app-file-input label="File đính kèm" />
              <app-text-field v-model="documentInfo" label="Thông tin văn bản đến" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <div class="text-subtitle-2">Thông tin văn bản chỉ đạo, điều hành</div>
            </v-col>
            <v-col cols="12" sm="6">
              <app-text-field v-model="description" label="Nội dung nhiệm vụ" />
              <unit-autocomplete :value.sync="executeUnit" label="Đơn vị thực hiện" />
              <unit-autocomplete :value.sync="supportUnit" label="Đơn vị phối hợp" />
              <unit-autocomplete :value.sync="executeStaff" label="Chuyên viên thực hiện" />
              <unit-autocomplete :value.sync="supportStaff" label="Chuyên viên phối hợp" />
            </v-col>
            <v-col>
              <task-processing-expire-select
                class="mb-6"
                hide-details
                :value.sync="processingExpire"
                label="Loại hạn xử lý"
              />
              <date-picker-input :value.sync="expireDate" label="Hạn xử lý" />
              <unit-autocomplete :value.sync="supervisorUnit" label="Đơn vị theo dõi" />
              <unit-autocomplete :value.sync="supervisorStaff" label="Chuyên viên theo dõi" />
              <task-status-select :value.sync="status" label="Trạng thái" />
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
import { TaskModel } from '@/models/task-model'
import { UnitModel } from '@/models/unit-model'
import { Component, Inject, Prop, PropSync, Ref, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {
    UnitAutocomplete: () => import('@/components/autocomplete/unit-autocomplete.vue'),
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue'),
    TaskPrioritySelect: () => import('@/components/autocomplete/task-priority-select.vue'),
    TaskStatusSelect: () => import('@/components/autocomplete/task-status-select.vue'),
    TaskProcessingExpireSelect: () => import('@/components/autocomplete/task-processing-expire-select.vue'),
  }
})
export default class TaskEditDialog extends Vue {
  @Inject() providers: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Ref('form') form: any
  @Prop() task: TaskModel
  @Prop() title!: string

  code = ''
  pushlishedDate = ''
  shortDescription = ''
  priority = ''
  attachFile = ''
  documentInfo = ''
  description = ''
  executeUnit = ''
  supportUnit = ''
  executeStaff = ''
  supportStaff = ''

  processingExpire = ''
  status = ''
  supervisorStaff = ''
  supervisorUnit = ''
  expireDate = ''

  @Watch('task') onUnitChanged(val: TaskModel) {
    if (val) {
      this.code = val.code
      this.description = val.description
      this.executeUnit = (val.executeUnit as UnitModel).title
      this.supportUnit = (val.suportUnit as UnitModel).title
      // this.executeStaff =
      // this.supportStaff =
    }
  }

  save() {
    //
  }
}
</script>

<style scoped></style>

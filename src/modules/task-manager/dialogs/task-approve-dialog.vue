<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="884" v-model="syncedValue" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>PHÊ DUYỆT NHIỆM VỤ</v-toolbar-title>
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
              <app-text-field v-model="executeDate" label="Ngày thực hiện" />
              <app-text-field v-model="description" label="Nội dung nhiệm vụ" />
            </v-col>
            <v-col cols="12" sm="6">
              <task-state-select label="Trạng thái" />
              <app-text-field label="File đính kèm" />
              <app-text-field label="Diễn giải trạng thái" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <div class="text-subtitle-2 mb-4">Chuyên viên phê duyệt kết quả</div>
              <v-radio-group row class="ma-0 pa-0" v-model="approveStatus">
                <v-radio label="Phê duyệt" value="approve" />
                <v-radio label="Trả lại" value="return" />
              </v-radio-group>
            </v-col>
            <v-col cols="12" sm="6">
              <app-text-field v-model="reason" label="Lý do" />
            </v-col>
            <v-col>
              <app-text-field label="File đính kèm" />
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
import { Component, Inject, PropSync, Ref, Vue } from 'vue-property-decorator'
import { TaskApprovementStatusType } from '@/models/task-model'

@Component({
  components: {
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue'),
    TaskStateSelect: () => import('@/components/autocomplete/task-state-select.vue')
  }
})
export default class TaskApproveDialog extends Vue {
  @Inject() providers: AppProvider

  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean

  @Ref('form') form: any

  code = ''
  executeDate = ''
  description = ''
  reason = ''
  approveStatus: TaskApprovementStatusType = 'return'
  save() {
    //
  }
}
</script>

<style scoped></style>

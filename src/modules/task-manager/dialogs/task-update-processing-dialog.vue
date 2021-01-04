<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="884" v-model="syncedValue" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>CẬP NHẬT TIẾN ĐỘ XỬ LÝ NHIỆM VỤ</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form ref="form" style="overflow-y: auto">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12">
              <task-status-select hide-details :value.sync="taskStatus" label="Trạng thái" />
              <date-picker-input label="Ngày thực hiện" />
              <app-text-field label="Diễn giải trạng thái" />
              <app-file-input label="File đính kèm" />
            </v-col>
            <v-col cols="12" class="pa-2 d-flex justify-end">
              <v-btn depressed medium @click="syncedValue = false">
                <span>Đóng</span>
              </v-btn>
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

@Component({
  components: {
    TaskStatusSelect: () => import('@/components/autocomplete/task-status-select.vue'),
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue')
  }
})
export default class TaskUpdateProcessingDialog extends Vue {
  @Inject() providers: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Ref('form') form: any

  taskStatus = ''
  save() {
    //
  }
}
</script>

<style scoped></style>

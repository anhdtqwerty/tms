<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="884" v-model="syncedValue" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>GIA HẠN NHIỆM VỤ {{ code }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form ref="form" style="overflow-y: auto">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12">
              <app-text-field v-model="code" label="Số/ký hiệu" />
              <date-picker-input :value.sync="expireDateOld" label="Hạn xử lý" />
              <date-picker-input :value.sync="expireDateNew" label="Hạn xử lý mới" />
              <app-text-field v-model="description" label="Nội dung nhiệm vụ" />
              <app-text-field v-model="reasonExtend" label="Lý do gia hạn" />
              <app-file-input label="File đính kèm" />
            </v-col>
            <v-col cols="12" class="pa-2 d-flex justify-end">
              <v-btn depressed outlined medium @click="syncedValue = false">
                <span>Đóng</span>
              </v-btn>
              <v-btn depressed color="primary" class="ml-8" medium @click="save">
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
import { TaskModel } from '@/models/task-model'
import { Component, Inject, Prop, PropSync, Ref, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue')
  }
})
export default class TaskExtendDialog extends Vue {
  @Inject() providers: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Ref('form') form: any
  @Prop() task: TaskModel

  code = ''
  description = ''
  reasonExtend = ''
  expireDateOld: string = null
  expireDateNew: string = null

  @Watch('task') onTaskChanged(val: TaskModel) {
    if (val) {
      this.code = val.code
      this.description = val.description
    }
  }

  async save() {
    if (this.form.validate()) {
      let task: TaskModel = {
        ...this.task
      }
      task = await this.providers.api.task.update(task.id, task)
      this.$emit('success', task)
      this.syncedValue = false
    }
  }
}
</script>

<style scoped></style>
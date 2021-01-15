<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="884" v-model="syncedValue" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>CẬP NHẬT TIẾN ĐỘ XỬ LÝ NHIỆM VỤ {{ task && task.code }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form ref="form" style="overflow-y: auto">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12">
              <task-state-select :value.sync="state" label="Trạng thái" />
              <date-picker-input label="Ngày thực hiện" />
              <app-text-field v-model="description" label="Diễn giải trạng thái" />
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
import { TaskModel, TaskStateType } from '@/models/task-model'
import { authStore } from '@/stores/auth-store'
import { Component, Inject, Prop, PropSync, Ref, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {
    TaskStateSelect: () => import('@/components/autocomplete/task-state-select.vue'),
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue')
  }
})
export default class TaskUpdateStateDialog extends Vue {
  @Inject() providers: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Ref('form') form: any
  @Prop() task: TaskModel

  code = ''
  state: TaskStateType = null
  description = ''
  data: any = {}

  @Watch('task', { immediate: true }) onTaskChanged(val: TaskModel) {
    if (val) {
      this.code = val.code
      this.state = val.state
      this.data = val.data
    }
  }

  async save() {
    if (this.form.validate()) {
      try {
        const api = this.providers.api
        const resquest = await api.request.create({
          // title, files, approver
          description: this.description,
          type: 'updateState',
          requestor: authStore.comrade.id,
          task: this.task
        })
        try {
          let task: TaskModel = {
            ...this.task,
            state: this.state,
            data: { ...this.data, explain: this.description }
          }

          task = await api.task.update(task.id, task)
          this.$emit('success', task)
          this.syncedValue = false
          this.form.reset()
          this.providers.snackbar.addSuccess()
        } catch (error) {
          await api.request.delete(resquest.id)
          throw error
        }
      } catch (error) {
        this.providers.snackbar.commonError(error)
      }
    }
  }
}
</script>

<style scoped></style>
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
            <v-col cols="12" class="pa-2">
              <task-state-select :includes="taskStateIncludes" :value.sync="state" label="Trạng thái" />
              <date-picker-input :value.sync="startedDate" :rules="$appRules.taskStartedDate" label="Ngày thực hiện" />
              <app-text-field v-model="explain" :rules="$appRules.taskExplain" label="Diễn giải trạng thái" />
              <app-file-input :value.sync="selectedFiles" label="File đính kèm" />
              <div class="d-flex">
                <div class="d-flex">
                  File đã tải trước đó
                  <v-menu :close-on-content-click="true" transition="scale-transition" left>
                    <template v-slot:activator="{ on }">
                      <div class="blue--text ml-4" v-on="on">Xem</div>
                    </template>
                    <task-files-component :container="task" />
                  </v-menu>
                </div>
              </div>
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
import { mailBuilder } from '@/helpers/mail-helper'
import { RequestModel } from '@/models/request-model'
import { createTaskBody, getLastRequest, TaskModel, TaskStateType } from '@/models/task-model'
import { authStore } from '@/stores/auth-store'
import _ from 'lodash'
import moment from 'moment'
import { Component, Inject, Prop, PropSync, Ref, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {
    TaskStateSelect: () => import('@/components/autocomplete/task-state-select.vue'),
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue'),
    TaskFilesComponent: () => import('@/components/files/task-files-component.vue')
  }
})
export default class TaskUpdateStateDialog extends Vue {
  @Inject() providers: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Ref('form') form: any
  @Prop() task: TaskModel
  @Prop() isUpdateTask!: boolean

  code = ''
  state: TaskStateType = null
  explain = ''
  startedDate: string = null
  taskStateIncludes: TaskStateType[] = ['todo', 'doing', 'waiting', 'done']
  request: RequestModel = null
  selectedFiles: File[] = []

  @Watch('value', { immediate: true }) onValueChanged(val: string) {
    if (val) {
      if (this.isUpdateTask) {
        this.code = this.task.code
        this.state = this.task.state
      } else {
        const lastRequest = getLastRequest(this.task)
        if (!lastRequest) {
          this.syncedValue = false
        } else {
          this.request = lastRequest
          this.state = lastRequest.type as TaskStateType
          this.startedDate = lastRequest.startedDate
          this.explain = lastRequest.description
        }
      }
    }
  }

  async save() {
    if (this.form.validate()) {
      try {
        const api = this.providers.api
        let request: RequestModel = null
        if (this.request) {
          // modify update -> edit request
          request = await api.request.update(this.request.id, {
            type: this.state,
            startedDate: this.startedDate,
            description: this.explain
          })
        } else {
          // update state task
          request = await api.request.create({
            description: this.explain,
            type: this.state,
            startedDate: this.startedDate,
            requestor: authStore.comrade.id,
            task: this.task.id
          })
        }

        if (this.selectedFiles.length) {
          await Promise.all(
            this.selectedFiles.map(f =>
              this.providers.api.uploadFiles(f, {
                model: 'request',
                modelId: request.id,
                modelField: 'files'
              })
            )
          )
        }

        try {
          const modifyTask = await api.task.update(
            this.task.id,
            createTaskBody(this.task, {
              state: this.state,
              status: this.state === 'done' ? 'approving' : null,
              doneDate: this.state === 'done' ? moment().toISOString() : null,
              explainState: this.explain
            })
          )
          this.providers.api.sendMail(mailBuilder.updateProgressTask(modifyTask))
          this.$emit('success', modifyTask)
          this.syncedValue = false
          this.form.reset()
          this.providers.snackbar.success(
            this.request
              ? 'Lưu thành công'
              : 'Cập nhật tiến độ xử lý thành công, sau 24 giờ bạn sẽ không thể thay đổi kết quả đã cập nhật.'
          )
        } catch (error) {
          if (!this.request) await api.request.delete(request.id)
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

<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="884" v-model="syncedValue" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>GIA HẠN NHIỆM VỤ {{ task && task.code }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form ref="form" style="overflow-y: auto">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12" class="pa-2">
              <app-text-field disabled v-model="code" label="Số/ký hiệu" />
              <date-picker-input disabled :value="expireDateOld" label="Hạn xử lý" />
              <date-picker-input :value.sync="expireDateNew" :rules="$appRules.taskExtendDate" label="Hạn xử lý mới" />
              <app-textarea v-model="description" rows="2" disabled label="Nội dung nhiệm vụ" />
              <app-text-field v-model="reasonExtend" :rules="$appRules.taskExplain" label="Lý do gia hạn" />
              <app-file-input hide-details :value.sync="selectedFiles" label="File đính kèm" />
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
import { createTaskBody, TaskModel } from '@/models/task-model'
import { authStore } from '@/stores/auth-store'
import _ from 'lodash'
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
  selectedFiles: File[] = []

  @Watch('task', { immediate: true }) onTaskChanged(val: TaskModel) {
    if (val) {
      this.code = val.code
      this.expireDateOld = val.expiredDate
      this.description = val.description
    }
  }

  async save() {
    if (this.form.validate()) {
      try {
        const api = this.providers.api

        const request = await api.request.create({
          description: this.reasonExtend,
          type: 'extended',
          requestor: authStore.comrade.id,
          task: this.task.id,
          data: {
            oldExpiredDate: this.expireDateOld,
            newExpiredDate: this.expireDateNew
          }
        })

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
              expiredDate: this.expireDateNew,
              explainState: this.reasonExtend
            })
          )
          this.providers.api.sendMail(mailBuilder.extendTask(modifyTask))
          this.$emit('success', modifyTask, request)
          this.syncedValue = false
          this.form.reset()
          this.providers.snackbar.success('Gia hạn thành công')
        } catch (error) {
          await api.request.delete(request.id)
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

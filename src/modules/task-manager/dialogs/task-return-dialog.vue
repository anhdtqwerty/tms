<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="884" v-model="syncedValue" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>TRẢ LẠI NHIỆM VỤ {{ task && task.code }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form ref="form" style="overflow-y: auto">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12" class="pa-2">
              <app-textarea
                v-model="reasonReturn"
                :rules="$appRules.taskExplain"
                counter="1000"
                label="Lý do trả lại"
              />
            </v-col>
            <v-col cols="12" class="pa-2 d-flex justify-end">
              <v-btn depressed outlined medium @click="syncedValue = false">
                <span>Đóng</span>
              </v-btn>
              <v-btn depressed color="primary" class="ml-8" medium @click="save">
                <span>Trả lại</span>
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
import { UnitModel } from '@/models/unit-model'
import { authStore } from '@/stores/auth-store'
import _ from 'lodash'
import { Component, Inject, Prop, PropSync, Ref, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class TaskReturnDialog extends Vue {
  @Inject() providers: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Ref('form') form: any
  @Prop() task: TaskModel

  code = ''
  reasonReturn = ''

  @Watch('task', { immediate: true }) onTaskChanged(val: TaskModel) {
    if (val) {
      this.code = val.code
    }
  }

  async save() {
    if (this.form.validate()) {
      try {
        const api = this.providers.api
        const request = await api.request.create({
          description: this.reasonReturn,
          type: 'returned',
          requestor: authStore.comrade.id,
          task: this.task.id,
          metadata: {
            unitId: _.get(authStore.comrade.unit, 'id'),
            unitTitle: _.get(authStore.comrade.unit, 'title'),
            departmentId: _.get(authStore.comrade.department, 'id'),
            departmentTitle: _.get(authStore.comrade.department, 'title')
          }
        })
        try {
          const userUnit = authStore.comrade.unit as UnitModel

          const modifyTask = await api.task.update(
            this.task.id,
            createTaskBody(this.task, {
              state: 'waiting',
              executedUnit: userUnit && userUnit.type === 'unit' ? null : undefined,
              executedDepartment: authStore.comrade.department && authStore.isLeader ? null : undefined,
              executedComrade: null,
              explainState: this.reasonReturn
            })
          )
          this.providers.api.sendMail(mailBuilder.returnTask(modifyTask))
          this.$emit('success', modifyTask, request)
          this.syncedValue = false
          this.form.reset()
          this.providers.snackbar.updateSuccess()
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

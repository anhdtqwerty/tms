<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="884" v-model="syncedValue" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>THU HỒI NHIỆM VỤ {{ task && task.code }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form ref="form" style="overflow-y: auto">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12" class="pa-2">
              <app-textarea v-model="reasonRecover" :rules="$appRules.taskExplain" label="Lý do thu hồi" />
              <app-file-input hide-details label="File đính kèm" />
            </v-col>
            <v-col cols="12" class="pa-2 d-flex justify-end">
              <v-btn depressed outlined medium @click="syncedValue = false">
                <span>Đóng</span>
              </v-btn>
              <v-btn depressed color="primary" class="ml-8" medium @click="save">
                <span>Thu hồi</span>
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
import { createTaskBody, TaskModel } from '@/models/task-model'
import { authStore } from '@/stores/auth-store'
import _ from 'lodash'
import { Component, Inject, Prop, PropSync, Ref, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class TaskRecoverDialog extends Vue {
  @Inject() providers: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Ref('form') form: any
  @Prop() task: TaskModel

  title = ''
  code = ''
  reasonRecover = ''

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
          // title, files, approver
          description: this.reasonRecover,
          type: 'recovered',
          requestor: authStore.comrade.id,
          task: this.task.id
        })
        try {
          const subtaskIds = this.task.subtasks.map(x => _.get(x, 'id'))
          let subsubTasks: TaskModel[] = []
          if (!_.isEmpty(subtaskIds)) {
            subsubTasks = await api.task.find({ parent_in: subtaskIds })
          }

          const allTasks = [this.task, ...(this.task.subtasks as TaskModel[]), ...subsubTasks]
          if (allTasks.length) {
            await Promise.all(
              allTasks.map(task => {
                return api.task.update(
                  task.id,
                  createTaskBody(
                    {},
                    {
                      state: 'recovered',
                      status: null,
                      executedUnit: null,
                      executedComrade: null,
                      supportedUnits: null,
                      supportedComrades: null,
                      supervisorUnit: null,
                      supervisors: null,
                      data: { ...task.data, explain: this.reasonRecover }
                    }
                  )
                )
              })
            )
          }

          this.$emit('success')
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

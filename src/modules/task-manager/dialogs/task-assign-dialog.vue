<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="884" v-model="syncedValue" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>GIAO NHIỆM VỤ {{ task && task.code }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form ref="form" style="overflow-y: auto">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12" class="pa-2">
              <div class="font-weight-bold">Chuyển thực hiện</div>
            </v-col>
            <v-col cols="12" class="pa-2">
              <unit-department-autocomplete :value.sync="executedUnitDep" label="Đơn vị xử lý" />
              <comrade-autocomplete
                :value.sync="executedComradeId"
                :unitDep="executedUnitDep"
                label="Chuyên viên thực hiện"
              />
            </v-col>
            <v-col cols="12" class="pa-2 d-flex justify-end">
              <v-btn depressed outlined medium @click="syncedValue = false">
                <span>Hủy</span>
              </v-btn>
              <v-btn depressed color="primary" class="ml-8" medium @click="save">
                <span>Chuyển xử lý</span>
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
import { ComradeModel } from '@/models/comrade-model'
import { TaskModel } from '@/models/task-model'
import _ from 'lodash'
import { Component, Inject, Prop, PropSync, Ref, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {
    ComradeAutocomplete: () => import('@/components/autocomplete/comrade-autocomplete.vue'),
    UnitDepartmentAutocomplete: () => import('@/components/autocomplete/unit-department-autocomplete.vue')
  }
})
export default class TaskAssignDialog extends Vue {
  @Inject() providers: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Ref('form') form: any
  @Prop() task: TaskModel

  code = ''
  executedUnitId = ''
  executedComradeId = ''
  executedDepartmentId = ''

  executedUnitDep = {}

  @Watch('task', { immediate: true }) onTaskChanged(val: TaskModel) {
    if (val) {
      const unitId = _.get(val.executedUnit, 'id')
      const departmentId = _.get(val.executedDepartment, 'id')

      this.code = val.code
      this.executedUnitDep = {
        unit: unitId,
        department: departmentId
      }

      this.executedUnitId = unitId
      this.executedDepartmentId = departmentId
      this.executedComradeId = (val.executedComrade as ComradeModel)?.id
    }
  }

  async save() {
    if (this.form.validate()) {
      try {
        let task: TaskModel = {
          executedUnit: _.get(this.executedUnitDep, 'unit') ?? null,
          executedComrade: this.executedComradeId,
          executedDepartment: _.get(this.executedUnitDep, 'department') ?? null
        }
        console.log('task', task)
        task = await this.providers.api.task.update(this.task.id, task)
        this.providers.api.sendMail(mailBuilder.assignTask(task))
        this.$emit('success', task)
        this.syncedValue = false
        this.providers.snackbar.updateSuccess()
      } catch (error) {
        this.providers.snackbar.commonError(error)
      }
    }
  }
}
</script>

<style scoped></style>

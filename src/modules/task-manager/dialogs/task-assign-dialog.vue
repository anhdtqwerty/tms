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
            <div>Chuyển thực hiện</div>
            <v-col cols="12">
              <unit-autocomplete :value.sync="executedUnitId" label="Đơn vị xử lý" />
              <comrade-autocomplete :unit="executedUnitId" :value.sync="executedComradeId" label="Người xử lý" />
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
import { ComradeModel } from '@/models/comrade-model'
import { TaskModel } from '@/models/task-model'
import { UnitModel } from '@/models/unit-model'
import { Component, Inject, Prop, PropSync, Ref, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {
    UnitAutocomplete: () => import('@/components/autocomplete/unit-autocomplete.vue'),
    ComradeAutocomplete: () => import('@/components/autocomplete/comrade-autocomplete.vue')
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

  @Watch('task', { immediate: true }) onTaskChanged(val: TaskModel) {
    if (val) {
      this.code = val.code
      this.executedUnitId = (val.executedUnit as UnitModel)?.id
      this.executedComradeId = (val.executedComrade as ComradeModel)?.id
    }
  }

  async save() {
    if (this.form.validate()) {
      let task: TaskModel = {
        executedUnit: this.executedUnitId,
        executedComrade: this.executedComradeId
      }
      task = await this.providers.api.task.update(this.task.id, task)
      this.$emit('success', task)
      this.syncedValue = false
    }
  }
}
</script>

<style scoped></style>

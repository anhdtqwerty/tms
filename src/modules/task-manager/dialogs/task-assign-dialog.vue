<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="884" v-model="syncedValue" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>GIAO NHIỆM VỤ {{ code }}</v-toolbar-title>
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
              <unit-autocomplete :value.sync="executeUnit" label="Đơn vị xử lý" />
              <app-text-field label="Người xử lý" />
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
import { TaskModel } from '@/models/task-model'
import { UnitModel } from '@/models/unit-model'
import { Component, Inject, Prop, PropSync, Ref, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {
    UnitAutocomplete: () => import('@/components/autocomplete/unit-autocomplete.vue')
  }
})
export default class TaskAssignDialog extends Vue {
  @Inject() providers: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Ref('form') form: any
  @Prop() task: TaskModel

  code = ''
  executeUnit = ''

  @Watch('task') onTaskChanged(val: TaskModel) {
    if (val) {
      this.code = val.code
      this.executeUnit = (val.executeUnit as UnitModel).title
    }
  }

  async save() {
    if (this.form.validate()) {
      let task: TaskModel = {
        ...this.task,
        executeUnit: this.executeUnit
      }
      task = await this.providers.api.task.update(task.id, task)
      this.$emit('success', task)
      this.syncedValue = false
    }
  }
}
</script>

<style scoped></style>
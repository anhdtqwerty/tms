<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="700" v-model="syncedValue" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>XÁC NHẬN XÓA</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form ref="form" style="overflow-y: auto">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12">
              <div>Bạn có chắc chắn muốn xóa nhiệm vụ này không?</div>
            </v-col>
            <v-col cols="12" class="pa-2 d-flex justify-end">
              <v-btn depressed outlined medium @click="syncedValue = false">
                <span>Hủy</span>
              </v-btn>
              <v-btn depressed color="primary" class="ml-8" medium @click="save">
                <span>Đồng ý</span>
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
import { Component, Inject, Prop, PropSync, Ref, Vue } from 'vue-property-decorator'
import _ from 'lodash'

@Component({
  components: {}
})
export default class TaskDeleteDialog extends Vue {
  @Inject() providers: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Ref('form') form: any
  @Prop() task: TaskModel

  title = ''
  code = ''
  reasonRecover = ''

  async save() {
    try {
      await this.providers.api.task.delete(this.task.id)
      if (this.task.files) {
        Promise.all(this.task.files.map(f => this.providers.api.deleteFile(_.get(f, 'id'))))
      }
      this.$emit('success', this.task.id)
      this.syncedValue = false
      this.providers.snackbar.deleteSuccess()
    } catch (error) {
      this.providers.snackbar.commonError(error)
    }
  }
}
</script>

<style scoped></style>

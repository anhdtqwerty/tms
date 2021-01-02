<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="884" v-model="syncedValue" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>THU HỒI NHIỆM VỤ</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form ref="form" style="overflow-y: auto">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12">
              <v-textarea outlined v-model="reasonRetrieve" label="Lý do thu hồi" />
              <app-text-field label="File đính kèm" />
            </v-col>
          </v-row>
          <v-col cols="12" class="pa-2 d-flex justify-end">
            <v-btn depressed medium @click="syncedValue = false">
              <span>Đóng</span>
            </v-btn>
            <v-btn depressed color="primary" medium @click="save">
              <span>Thu hồi</span>
            </v-btn>
          </v-col>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Inject, PropSync, Ref, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class TaskRetrieveDialog extends Vue {
  @Inject() providers: AppProvider

  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean

  @Ref('form') form: any

  reasonRetrieve = ''
  save() {
    //
  }
}
</script>

<style scoped></style>

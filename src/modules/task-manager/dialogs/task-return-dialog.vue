<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="884" v-model="syncedValue" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>TRẢ LẠI NHIỆM VỤ</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form ref="form" style="overflow-y: auto">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12">
              <app-textarea label="Lý do trả lại" />
            </v-col>
          </v-row>
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
export default class TaskReturnDialog extends Vue {
  @Inject() providers: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Ref('form') form: any

  save() {
    //
  }
}
</script>

<style scoped></style>

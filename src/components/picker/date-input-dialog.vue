<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="600" v-model="syncedValue" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>CHỌN NGÀY</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form ref="form" style="overflow-y: auto">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12" class="pa-2">
              <v-menu
                v-model="show"
                :close-on-content-click="true"
                nudge-top="14"
                transition="scale-transition"
                offset-y
                left
                min-width="290px"
              >
                <template v-slot:activator="{ $attrs }">
                  <app-text-field
                    :v-bind="$attrs"
                    label="Chọn ngày"
                    append-icon="calendar_today"
                    @click:append="show = true"
                    validate-on-blur
                    clearable
                    @click:clear="selectDate = null"
                    v-model="selectedDate"
                    type="date"
                  />
                </template>
                <v-date-picker locale="vi" v-model="selectedDate" @input="selectDate" type="date"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" class="pa-2 d-flex justify-end">
              <v-btn depressed outlined medium @click="syncedValue = false">
                <span>Đóng</span>
              </v-btn>
              <v-btn depressed color="primary" class="ml-8" medium @click="save">
                <span>OK</span>
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
import moment from 'moment'
import { Component, Inject, PropSync, Ref, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class DateInputDialog extends Vue {
  @Inject() providers: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Ref('form') form: any

  show = false
  selectedDate: string = null

  date: string = null

  selectDate(date: string) {
    this.selectedDate = date
    this.show = false
  }

  save() {
    if (this.selectedDate) {
      this.date =
        moment(this.selectedDate, 'YYYY-MM-DD')
          .endOf('day')
          .toISOString() ?? moment().format('YYYY-MM-DD')
    }
    this.$emit('ok', this.date ?? undefined)
    this.syncedValue = false
    this.form.reset()
  }
}
</script>

<style>
input[type='date']::-webkit-calendar-picker-indicator {
  display: none;
}
</style>

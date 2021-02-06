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
              <!-- startDate -->
              <v-menu
                v-model="showStart"
                :close-on-content-click="false"
                nudge-top="14"
                transition="scale-transition"
                offset-y
                left
                min-width="290px"
              >
                <template v-slot:activator="{ $attrs }">
                  <app-text-field
                    :v-bind="$attrs"
                    label="Từ ngày"
                    :value="selectedStartDate | date('DD/MM/YYYY')"
                    append-icon="calendar_today"
                    @click:append="showStart = true"
                    validate-on-blur
                    clearable
                    @click:clear="selectStartDate = null"
                    v-model="selectedStartDate"
                    type="date"
                  />
                </template>
                <v-date-picker
                  locale="vi"
                  v-model="selectedStartDate"
                  @input="selectStartDate"
                  type="date"
                ></v-date-picker>
              </v-menu>

              <!-- endDate -->
              <v-menu
                v-model="showEnd"
                :close-on-content-click="false"
                nudge-top="14"
                transition="scale-transition"
                offset-y
                left
                min-width="290px"
              >
                <template v-slot:activator="{ $attrs }">
                  <app-text-field
                    :v-bind="$attrs"
                    label="Đến ngày"
                    :value="selectedEndDate | date('DD/MM/YYYY')"
                    append-icon="calendar_today"
                    @click:append="showEnd = true"
                    validate-on-blur
                    clearable
                    @click:clear="selectEndDate = null"
                    v-model="selectedEndDate"
                    type="date"
                    hide-details
                  />
                </template>
                <v-date-picker locale="vi" v-model="selectedEndDate" @input="selectEndDate" type="date"></v-date-picker>
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
export default class DateRangeDialog extends Vue {
  @Inject() providers: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Ref('form') form: any

  showStart = false
  selectedStartDate: string = null
  showEnd = false
  selectedEndDate: string = null

  dateRange: string[] = []

  selectStartDate(date: string) {
    this.selectedStartDate = date
    this.showStart = false
  }

  selectEndDate(date: string) {
    this.selectedEndDate = date
    this.showEnd = false
  }

  save() {
    if (this.selectedStartDate || this.selectedEndDate) {
      this.dateRange = [
        moment(this.selectedStartDate, 'YYYY-MM-DD').toISOString() ?? moment().format('YYYY-MM-DD'),
        moment(this.selectedEndDate, 'YYYY-MM-DD')
          .endOf('day')
          .toISOString() ?? moment().format('YYYY-MM-DD')
      ]
    }
    this.$emit('ok', this.dateRange)
    this.syncedValue = false
  }
}
</script>

<style>
input[type='date']::-webkit-calendar-picker-indicator {
  display: none;
}
</style>

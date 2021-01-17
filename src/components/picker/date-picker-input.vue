<template>
  <v-menu
    v-model="show"
    :attach="attach"
    :close-on-content-click="false"
    :nudge-top="14"
    transition="scale-transition"
    offset-y
    left
    min-width="290px"
  >
    <template v-slot:activator="{ on, $attrs }">
      <app-text-field
        :v-bind="$attrs"
        :value="syncedValue | date(displayFormatDate)"
        :label="label"
        readonly
        v-on="on"
        append-icon="expand_more"
        @click:append="show = true"
        :rules="rules"
        validate-on-blur
        :outlined="outlined"
        :hide-details="hideDetails"
        :disabled="disabled"
        clearable
        @click:clear="selectedDate = null"
      />
    </template>
    <v-date-picker locale="vi" :value="selectedDate" @input="selectDate" :type="type"></v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import moment from 'moment'
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'

@Component
export default class DatePickerInput extends Vue {
  @PropSync('value', { type: String, default: moment().toISOString() }) syncedValue!: string
  @Prop() width: number
  @Prop({ default: 'Chọn ngày' }) label: string
  @Prop() rules: any[]
  @Prop({ default: true }) outlined: boolean
  @Prop({ default: false }) attach: boolean
  @Prop({ default: 'date' }) type: 'date' | 'month'
  @Prop() dateFormat: string
  @Prop({ default: false }) hideDetails: boolean
  @Prop({ default: false }) disabled: boolean

  selectedDate: string = null
  show = false

  selectDate(date: string) {
    if (this.type === 'date') {
      this.syncedValue = moment(date, 'YYYY-MM-DD')
        .endOf('day')
        .toISOString()
    } else {
      this.syncedValue = moment(date, 'YYYY-MM').toISOString()
    }
    this.show = false
  }

  @Watch('value', { immediate: true }) onValueChanged(val: string) {
    if (!val) return
    if (this.type === 'date') {
      this.selectedDate = moment(val).format('YYYY-MM-DD')
    } else {
      this.selectedDate = moment(val).format('YYYY-MM')
    }
  }

  get displayFormatDate() {
    if (this.dateFormat) {
      return this.dateFormat
    } else {
      return this.type === 'date' ? 'DD/MM/YYYY' : 'MM/YYYY'
    }
  }
}
</script>

<style scoped></style>

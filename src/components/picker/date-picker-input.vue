<template>
  <v-menu
    v-model="show"
    attach
    :close-on-content-click="false"
    :nudge-top="14"
    transition="scale-transition"
    offset-y
    left
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <app-text-field
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
  @Prop({ default: 'date' }) type: 'date' | 'month'
  @Prop() dateFormat: string
  @Prop({ default: false }) hideDetails: boolean
  @Prop({ default: false }) disabled: boolean

  selectedDate: string = null
  show = false

  selectDate(date: string) {
    if (this.type === 'date') {
      this.syncedValue = moment(date, 'yyyy-MM-DD')
        .endOf('day')
        .toISOString()
    } else {
      this.syncedValue = moment(date, 'yyyy-MM').toISOString()
    }
    this.show = false
  }

  @Watch('value', { immediate: true }) onValueChanged(val: string) {
    if (!val) return
    if (this.type === 'date') {
      this.selectedDate = moment(val).format('yyyy-MM-DD')
    } else {
      this.selectedDate = moment(val).format('yyyy-MM')
    }
  }

  get displayFormatDate() {
    if (this.dateFormat) {
      return this.dateFormat
    } else {
      return this.type === 'date' ? 'DD/MM/yyyy' : 'MM/yyyy'
    }
  }
}
</script>

<style scoped></style>

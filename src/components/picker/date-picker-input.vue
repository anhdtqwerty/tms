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
        :value="displayDate"
        :label="label"
        readonly
        v-on="on"
        append-icon="expand_more"
        @click:append="show = true"
        :rules="rules"
        validate-on-blur
        :outlined="outlined"
        :hide-details="hideDetails"
      />
    </template>
    <v-date-picker locale="vi" :value="syncedValue" @input="selectDate" :type="type"></v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import moment from 'moment'
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'

@Component
export default class DatePickerInput extends Vue {
  @PropSync('value', { type: String, default: new Date().toISOString().substr(0, 10) }) syncedValue!: string
  @Prop() width: number
  @Prop({ default: 'Chọn ngày' }) label: string
  @Prop() rules: any[]
  @Prop({ default: true }) outlined: boolean
  @Prop({ default: 'date' }) type: 'date' | 'month'
  @Prop() dateFormat: string
  @Prop({ default: false }) hideDetails: boolean

  displayDate = ''
  show = false

  selectDate(date: string) {
    this.syncedValue = date
    this.show = false
  }

  @Watch('value', { immediate: true }) onValueChanged(val: string) {
    console.log(val, this.type, this.dateFormat)
    if (this.type === 'date') {
      if (this.dateFormat) {
        this.displayDate = moment(val, 'yyyy-MM-dd').format(this.dateFormat)
      } else {
        this.displayDate = val
      }
    } else {
      if (this.dateFormat) {
        this.displayDate = moment(val, 'yyyy-MM').format(this.dateFormat)
      } else {
        this.displayDate = val
      }
    }
  }
}
</script>

<style scoped></style>

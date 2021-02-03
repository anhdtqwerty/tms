<template>
  <v-menu
    v-model="show"
    :attach="attach"
    :close-on-content-click="false"
    :nudge-top="14"
    left
    transition="scale-transition"
    offset-y
    @input="menuChanged"
    min-width="290px"
  >
    <template v-slot:activator="{ on, $attrs }">
      <app-text-field
        :v-bind="$attrs"
        :value="displayDateRange"
        :label="label"
        readonly
        v-on="on"
        append-icon="expand_more"
        @click:append="show = true"
        :rules="rules"
        validate-on-blur
        :hide-details="hideDetails"
        :outlined="outlined"
        clearable
        @click:clear="clearDate"
      />
    </template>
    <v-date-picker locale="vi" v-model="selectedRange" range>
      <div class="d-flex justify-end" style="width: 100%">
        <v-btn small class="mr-4" @click="cancel">Cancel</v-btn>
        <v-btn small color="primary" @click="ok" :disabled="selectedRange.length !== 2">OK</v-btn>
      </div>
    </v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import moment from 'moment'
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'

@Component
export default class DateRangePickerInput extends Vue {
  @PropSync('value', { type: Array, default: [] }) syncedValue!: string[]
  @Prop() width: number
  @Prop({ default: 'Chọn ngày' }) label: string
  @Prop() rules: any[]
  @Prop({ default: true }) outlined: boolean
  @Prop({ default: false }) attach: boolean
  @Prop({ default: false }) hideDetails: boolean

  show = false
  selectedRange: string[] = []

  @Watch('value', { immediate: true }) onValueChanged(val: string[]) {
    this.selectedRange = (val ?? []).map(d => moment(d).format('YYYY-MM-DD'))
  }

  clearDate() {
    this.selectedRange = []
    this.syncedValue = []
  }

  cancel() {
    this.show = false
    this.selectedRange = []
    this.syncedValue = []
  }

  ok() {
    this.syncedValue = [
      moment(this.selectedRange[0], 'YYYY-MM-DD').toISOString(),
      moment(this.selectedRange[1], 'YYYY-MM-DD')
        .endOf('day')
        .toISOString()
    ]
    this.show = false
  }

  menuChanged(open: boolean) {
    if (!open) {
      this.selectedRange = (this.syncedValue ?? []).map(d => moment(d).format('YYYY-MM-DD'))
    }
  }

  get displayDateRange() {
    return this.syncedValue.map(d => moment(d).format('DD/MM/YYYY')).join(' - ')
  }
}
</script>

<style scoped></style>

<template>
  <div>
    <v-menu
      v-model="show"
      :close-on-content-click="false"
      :nudge-top="14"
      transition="scale-transition"
      offset-y
      min-width="290px"
      style="width:100%"
    >
      <!-- :style="`max-width: ${width}px`" -->

      <template v-slot:activator="{ on }">
        <app-text-field
          :value="syncedValue"
          :label="label"
          readonly
          single-line
          v-on="on"
          append-icon="expand_more"
          @click:append="show = true"
          :rules="rules"
          validate-on-blur
          :outlined="outlined"
        />
      </template>
      <v-date-picker locale="vi" :value="syncedValue" @input="selectDate"></v-date-picker>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'

@Component
export default class DatePickerInput extends Vue {
  @PropSync('value', { type: String, default: new Date().toISOString().substr(0, 10) }) syncedValue!: string
  @Prop() width: number
  @Prop({ default: 'Chọn ngày' }) label: string
  @Prop() rules: any[]
  @Prop({ default: true }) outlined: boolean

  show = false

  selectDate(date: string) {
    this.syncedValue = date
    this.show = false
  }
}
</script>

<style scoped></style>

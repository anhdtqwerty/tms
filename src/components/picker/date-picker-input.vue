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
          label="Chọn Ngày"
          readonly
          single-line
          v-on="on"
          append-icon="expand_more"
          @click:append="show = true"
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
  @Prop() width: number
  @PropSync('value', { type: String, default: new Date().toISOString().substr(0, 10) }) syncedValue!: string

  show = false

  selectDate(date: string) {
    this.syncedValue = date
    this.show = false
  }
}
</script>

<style scoped></style>

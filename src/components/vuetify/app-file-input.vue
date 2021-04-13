<template>
  <v-file-input
    outlined
    dense
    multiple
    prepend-icon=""
    append-icon="publish"
    :accept="accept"
    v-bind="$attrs"
    :rules="rules"
    show-size
    small-chips
    v-model="syncedValue"
  ></v-file-input>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator'

@Component
export default class AppFileInput extends Vue {
  @PropSync('value', { default: null }) syncedValue: string

  rules = [
    (files: File[]) => {
      const invalidFile = files.find(f => f.size > 104857600)
      if (invalidFile) return 'File đính kèm không quá 100MB'
      else return true
    }
  ]

  accept =
    'application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/pdf, application/x-rar-compressed, text/plain, application/zip'
}
</script>

<style scoped></style>

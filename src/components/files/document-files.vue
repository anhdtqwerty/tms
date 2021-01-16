<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-column" v-for="(file, index) in files" :key="index">
      <a :href="file.url | apiFileUrl" download>{{ file.name }}</a>
      <v-divider v-if="index < files.length - 1" />
    </div>
  </div>
</template>

<script lang="ts">
import { FileModel } from '@/models/file-model'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class DocumentFiles extends Vue {
  @Prop({ default: (): FileModel[] => [] }) files: FileModel
}
</script>

<style scoped></style>

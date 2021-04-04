<template>
  <v-list v-if="files.length">
    <v-list-item v-for="(file, index) in files" :key="index">
      <a :href="file | apiFileUrl" download>{{ file.name }}</a>
      <v-spacer />
      <v-icon v-if="canDelete" class="ml-4" color="red" @click="deleteFile(file)" right>delete</v-icon>
    </v-list-item>
  </v-list>
  <v-card class="pa-5" v-else>Không có file</v-card>
</template>
<script lang="ts">
import { Component, Inject, Prop, Vue, Watch } from 'vue-property-decorator'
import { AppProvider } from '@/app-provider'
import _ from 'lodash'
import { FileModel } from '@/models/file-model'

@Component
export default class TaskFilesComponent extends Vue {
  @Inject() providers!: AppProvider
  @Prop() task: any
  @Prop() requests: []
  @Prop({ default: 'files' }) fileField: string
  @Prop({ default: true }) canDelete: boolean

  files: any[] = []

  @Watch('task', { immediate: true }) onTaskChange() {
    this.getFiles()
  }

  @Watch('requests', { immediate: true }) onRequestsChange() {
    this.getFiles()
  }

  getFiles() {
    let taskFiles: any[] = []
    if (this.task && this.task[this.fileField]) {
      taskFiles = [...this.task[this.fileField]]
    }

    for (const request of this.requests ?? []) {
      if (request) taskFiles = [...taskFiles, ...(request[this.fileField] as [])]
    }

    this.files = taskFiles
  }

  async deleteFile(file: FileModel) {
    if (await this.providers.alert.confirmDelete('file')) {
      try {
        await this.providers.api.deleteFile(file.id)
        this.providers.snackbar.deleteSuccess()
        this.files = this.files.filter(f => f.id !== file.id)
        this.$emit('fileDeleted', file.id)
      } catch (error) {
        this.providers.snackbar.commonError(error)
      }
    }
  }
}
</script>

<style scoped></style>

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

@Component
export default class TaskFilesComponent extends Vue {
  @Inject() providers!: AppProvider
  @Prop() container: any
  @Prop({ default: 'files' }) fileField: string
  @Prop({ default: true }) canDelete: boolean

  files: any[] = []

  @Watch('container', { immediate: true }) onContainerChange(val: any) {
    this.files = this.container ? this.container[this.fileField] : []
  }

  async deleteFile(file: File) {
    if (await this.providers.alert.confirmDelete('file')) {
      try {
        await this.providers.api.deleteFile(_.get(file, 'id'))
        this.providers.snackbar.deleteSuccess()
        if (this.container) {
          this.container[this.fileField] = this.container[this.fileField].filter((x: any) => x.id !== _.get(file, 'id'))
          this.files = this.container[this.fileField]
        }
      } catch (error) {
        this.providers.snackbar.commonError(error)
      }
    }
  }
}
</script>

<style scoped></style>

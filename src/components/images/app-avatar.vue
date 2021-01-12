<template>
  <v-avatar v-bind="$attrs" @click="$emit('click', $event)">
    <v-img :src="url" :lazy-src="defaultUrl"></v-img>
  </v-avatar>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue, Watch } from 'vue-property-decorator'
import _ from 'lodash'
import { AppProvider } from '@/app-provider'

@Component
export default class AppAvatar extends Vue {
  @Inject() providers!: AppProvider

  @Prop() avatar: any
  @Prop({ default: '/default-avatar.png' }) defaultUrl: string

  url: string = null

  @Watch('avatar', { immediate: true }) async onAvatarChanged(val: any) {
    try {
      if (val instanceof File) {
        this.url = URL.createObjectURL(val)
      } else if (typeof val === 'string') {
        const model = await this.providers.api.getFile(val)
        this.url = this.providers.api.getFileUrl(model)
      } else if (val) {
        this.url = this.providers.api.getFileUrl(val)
      }
      if (!this.url) {
        this.url = '/default-avatar.png'
      }
    } catch (error) {
      console.error('onAvatarChanged', error)
    }
  }
}
</script>

<style scoped></style>

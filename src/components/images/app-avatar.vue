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

  @Watch('avatar') async onAvatarChanged(val: any) {
    try {
      console.log('onAvatarChanged', val)
      if (val instanceof File) {
        this.url = val
      } else if (typeof val === 'string') {
        const model = await this.providers.api.getFile(val)
        this.url = _.get(model, 'url')
      } else if (typeof val === 'object') {
        this.url = _.get(val, 'url')
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

<template>
  <v-clamp :class="this.isBold ? 'font-weight-bold' : null" :autoresize="autoresize" :max-lines="maxLines">
    {{ text }}
    <template v-slot:after="{ clamped }">
      <span v-if="clamped" class="blue--text caption" style="cursor: pointer" @click="showReadMore">
        Xem thêm
      </span>
    </template>
  </v-clamp>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Prop, Inject, Vue } from 'vue-property-decorator'

@Component({
  components: {
    VClamp: () => import('vue-clamp')
  }
})
export default class ReadMoreComponent extends Vue {
  @Inject() providers!: AppProvider
  @Prop({ default: 3 }) maxLines: number
  @Prop() text: string
  @Prop({ default: false }) isBold: boolean
  @Prop({ default: false }) autoresize: boolean

  async showReadMore() {
    await this.providers.alert.info('Chi tiết', this.text)
  }
}
</script>

<style scoped></style>

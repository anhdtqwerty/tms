<template>
  <span>
    {{ text && textDisplay }}
    <span
      v-if="text && text.length > maxLength"
      class="blue--text caption"
      style="cursor: pointer"
      @click="showReadMore"
    >
      Xem thêm
    </span>
  </span>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Prop, Inject, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class MaxLengthText extends Vue {
  @Inject() providers!: AppProvider
  @Prop() text: string
  @Prop({ default: 150 }) maxLength: number

  textDisplay = ''

  @Watch('text', { immediate: true }) onTextChanged(val: string) {
    if (val) {
      if (val.length > this.maxLength) {
        this.textDisplay = val.substring(0, this.maxLength) + '...'
      } else {
        this.textDisplay = val
      }
    } else {
      this.textDisplay = val
    }
  }
  async showReadMore() {
    await this.providers.alert.info('Chi tiết', this.text)
  }
}
</script>

<style scoped></style>

<template>
  <v-card class="px-4 pt-4 pb-2">
    <div class="d-flex flex-column">
      <div class="d-flex align-center">
        <v-icon class="v-icon--outline" :color="color" size="32">{{ icon }}</v-icon>
        <div class="ml-4">
          <div class="body-2 text-no-wrap" :class="{ caption: $vuetify.breakpoint.sm }">{{ title }}</div>
          <div class="text-h4 font-weight-medium" :style="{ color }">{{ value }}</div>
        </div>
      </div>
      <div class="d-flex justify-space-between caption mt-4">
        <div>
          <div v-if="leftValue > 0">
            {{ leftText }} <span class="green--text font-weight-medium">{{ leftValue }}</span>
          </div>
        </div>
        <div>
          <div v-if="rightValue > 0">
            {{ rightText }} <span class="red--text font-weight-medium">{{ rightValue }}</span>
          </div>
        </div>
        <div v-if="leftValue < 1 && rightValue < 1" class="transparent--text">|</div>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class OverviewCard extends Vue {
  @Prop() title!: string
  @Prop() value!: number
  @Prop() icon!: string
  @Prop({ default: 'black' }) color!: string
  @Prop({ default: 'Trong hạn' }) leftText: string
  @Prop({ default: 'Quá hạn' }) rightText: string
  @Prop({ default: 0 }) leftValue: number
  @Prop({ default: 0 }) rightValue: number
}
</script>

<style scoped>
.v-icon--outline {
  background-color: #e3f2fd;
  border: 1px solid transparent;
  border-radius: 50%;
  height: 56px;
  width: 56px;
  min-width: 56px;
  min-height: 56px;
}
</style>

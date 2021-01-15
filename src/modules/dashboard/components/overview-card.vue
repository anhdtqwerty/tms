<template>
  <v-card class="px-4 pt-4 pb-2">
    <div class="d-flex flex-column">
      <div class="d-flex align-center">
        <v-icon class="v-icon--outline" color="primary" size="32">{{ icon }}</v-icon>
        <div class="ml-4">
          <div class="body-2 text-no-wrap" :class="{ caption: $vuetify.breakpoint.sm }">{{ title }}</div>
          <div class="text-h4 font-weight-medium">{{ value }}</div>
        </div>
      </div>
      <div class="d-flex justify-space-between caption mt-4">
        <div>
          <div v-if="intime > 0">
            Trong hạn <span class="green--text font-weight-medium">{{ intime }}</span>
          </div>
        </div>
        <div>
          <div v-if="overtime > 0">
            Quá hạn <span class="red--text font-weight-medium">{{ overtime }}</span>
          </div>
        </div>
        <div v-if="intime < 1 && overtime < 1" class="transparent--text">|</div>
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
  @Prop({ default: 0 }) intime: number
  @Prop({ default: 0 }) overtime: number
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

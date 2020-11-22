<template>
  <v-card class="pa-4">
    <div class="d-flex align-center">
      <v-icon class="v-icon--outline" color="primary" size="20">{{ icon }}</v-icon>
      <div class="ml-4">
        <div class="body-2 text-no-wrap" :class="{ caption: $vuetify.breakpoint.sm }">{{ title }}</div>
        <div class="text-h4 font-weight-medium">{{ value }}</div>
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

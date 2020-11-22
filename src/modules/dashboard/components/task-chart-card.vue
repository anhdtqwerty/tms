<template>
  <v-card>
    <v-tabs background-color="transparent" color="primary" grow>
      <v-tab style="text-transform: none">
        Nhiệm vụ đã giao
      </v-tab>
      <v-tab style="text-transform: none">
        Nhiệm vụ được giao
      </v-tab>
    </v-tabs>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class TaskChartCard extends Vue {}
</script>

<style scoped></style>

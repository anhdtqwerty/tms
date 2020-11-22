<template>
  <v-container fluid class="px-4">
    <v-row>
      <v-col class="px-2 py-0">
        <div class="text-h6">Dashboard</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card icon="list_alt" title="Tổng số" value="320" />
      </v-col>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card icon="list_alt" title="Đang thực hiện" value="160" />
      </v-col>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card icon="list_alt" title="Hoàn thành" value="100" />
      </v-col>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card icon="list_alt" title="Đã quá hạn" value="60" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-2">
        <task-column-chart-card />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import OverviewCard from './components/overview-card.vue'
import TaskColumnChartCard from './components/task-column-chart-card.vue'

@Component({
  components: {
    OverviewCard,
    TaskColumnChartCard
  }
})
export default class DashboardPage extends Vue {}
</script>

<style scoped></style>

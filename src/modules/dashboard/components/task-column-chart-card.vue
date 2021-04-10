<template>
  <v-card>
    <v-container class="pa-4" fluid>
      <v-row>
        <v-col cols="12" md="3" class="pa-2">
          <div class="primary--text text-h6">Nhiệm vụ</div>
        </v-col>
        <v-col cols="12" md="9" class="pa-2 d-flex" :class="{ 'justify-end': $vuetify.breakpoint.mdAndUp }">
          <task-state-select
            class="date-picker pl-4"
            hide-details
            :value.sync="vm.taskStateFilter"
            @update:name="vm.changeTaskStateFilter"
            :includes="taskStateIncludes"
            label="Tình hình thực hiện"
          />
          <date-picker-input
            class="date-picker pl-4"
            :value.sync="selectedMonth"
            type="month"
            label="Chọn tháng"
            dateFormat="[Tháng] M [Năm] YYYY"
            hide-details
            :attach="true"
          />
        </v-col>
        <v-col cols="12" class="pa-2">
          <apexchart
            v-if="vm.unitTaskChart"
            width="100%"
            height="300"
            type="bar"
            :options="vm.unitTaskChart.options"
            :series="vm.unitTaskChart.series"
          ></apexchart>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Component, Inject, Vue, Watch } from 'vue-property-decorator'
import moment from 'moment'
import { DashboardLeaderViewModel } from '../dashboard-leader-viewmodel'
import { Observer } from 'mobx-vue'
import { TaskStateType } from '@/models/task-model'

@Observer
@Component({
  components: {
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue'),
    TaskStateSelect: () => import('@/components/autocomplete/task-state-select.vue')
  }
})
export default class TaskColumnChartCard extends Vue {
  @Inject() vm: DashboardLeaderViewModel

  taskStateIncludes: TaskStateType[] = ['waiting', 'todo', 'doing', 'done', 'recovered']

  selectedMonth = moment().toISOString()

  @Watch('selectedMonth', { immediate: true }) onSelectedMonthChange(val: string) {
    const time = moment(val)
    const start = time.clone().startOf('month')
    const end = time.clone().endOf('month')
    this.vm.loadUnitStats(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'))
  }
}
</script>

<style scoped>
.selector {
  max-width: 164px;
}
.date-picker {
  max-width: 220px;
}
</style>

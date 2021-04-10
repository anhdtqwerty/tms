<template>
  <v-card>
    <v-container class="pa-4" fluid>
      <v-row>
        <v-col cols="12" class="pa-2 d-flex justify-space-between">
          <div class="primary--text text-h6 pr-4">Nhiệm vụ</div>
          <date-picker-input
            class="date-picker"
            :value.sync="selectedMonth"
            type="month"
            label="Chọn tháng"
            dateFormat="[Tháng] M [Năm] YYYY"
            hide-details
          />
        </v-col>
        <v-col cols="12" class="pa-2">
          <apexchart
            v-if="vm.personalHasData"
            width="100%"
            height="300"
            type="pie"
            :options="vm.personalTaskChart.options"
            :series="vm.personalTaskChart.series"
          ></apexchart>
          <div v-else>
            Không có dữ liệu
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Component, Inject, Vue, Watch } from 'vue-property-decorator'
import moment from 'moment'
import { DashboardComradeViewModel } from '../dashboard-comrade-viewmodel'
import { Observer } from 'mobx-vue'

@Observer
@Component({
  components: {
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue')
  }
})
export default class TaskCircleChartCard extends Vue {
  @Inject() vm: DashboardComradeViewModel

  selectedMonth = moment().toISOString()

  @Watch('selectedMonth', { immediate: true }) onSelectedMonthChange(val: string) {
    const time = moment(val)
    const start = time.clone().startOf('month')
    const end = time.clone().endOf('month')
    this.vm.loadPersonalStats(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'))
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

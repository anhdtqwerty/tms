<template>
  <v-card>
    <v-container class="pa-4" fluid>
      <v-row>
        <v-col cols="12" class="pa-2 d-flex justify-space-between">
          <div class="primary--text text-h6">Nhiệm vụ</div>
          <date-picker-input
            class="date-picker pl-4"
            :value.sync="selectedMonth"
            type="month"
            label="Chọn tháng"
            dateFormat="[Tháng] M [Năm] YYYY"
            hide-details
          />
        </v-col>
        <v-col cols="12" class="pa-2">
          <apexchart
            v-if="viewmodel.personalTaskChart"
            width="100%"
            height="300"
            type="pie"
            :options="viewmodel.personalTaskChart.options"
            :series="viewmodel.personalTaskChart.series"
          ></apexchart>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Component, Inject, Vue, Watch } from 'vue-property-decorator'
import moment from 'moment'
import { DashboardViewModel } from '../dashboard-viewmodel'
import { Observer } from 'mobx-vue'

@Observer
@Component({
  components: {
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue')
  }
})
export default class TaskCircleChartCard extends Vue {
  @Inject() viewmodel: DashboardViewModel

  selectedMonth = moment().format('YYYY-MM')

  @Watch('selectedMonth') onSelectedMonthChange(val: string) {
    console.log('onSelectedMonthChange', val)
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

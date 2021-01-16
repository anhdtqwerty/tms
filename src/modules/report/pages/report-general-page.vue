<template>
  <v-container fluid px-5 py-2>
    <v-row>
      <v-col cols="12" class="pa-2">
        <div class="text-h6">BÁO CÁO TỔNG HỢP</div>
        <breadcrumbs />
      </v-col>
      <v-col cols="12" class="pa-2">
        <v-card>
          <div class="d-flex flex-column pa-4 pb-0">
            <div class="text-subtitle-1 font-weight-medium">Quản lý báo cáo</div>
            <v-row>
              <v-col cols="5">
                <date-picker-input class="mr-4" hide-details :value.sync="fromDate" />
              </v-col>
              <v-col cols="5">
                <date-picker-input class="mr-4" hide-details :value.sync="toDate" />
              </v-col>
              <v-col cols="2">
                <v-btn depressed color="primary" medium block @click="search">
                  <span class="d-none d-lg-flex mr-4">Tìm kiếm</span>
                  <v-icon dark>search</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" class="pa-2">
        <v-card>
          <div class="d-flex flex-column pa-4 align-center">
            <p class="text-h6 ma-0">BÁO CÁO TỔNG HỢP CÔNG VIỆC</p>
            <p>Thời gian xuất báo cáo {{ viewmodel.exportedDate | ddmmyyyyhhmmss }}</p>
            <table class="align-self-stretch">
              <tr class="header-footer-row">
                <th rowspan="2">Đơn vị</th>
                <th rowspan="2">Tổng nhiệm vụ</th>
                <th colspan="2">Đang thực hiện</th>
                <th colspan="2">Đã hoàn thành</th>
                <th rowspan="2">Chờ phê duyệt</th>
              </tr>
              <tr class="header-footer-row">
                <th>Trong hạn</th>
                <th>Quá hạn</th>
                <th>Trong hạn</th>
                <th>Quá hạn</th>
              </tr>
              <tr v-for="report in viewmodel.reports" :key="report.id">
                <td style="text-align: left;">{{ report.title }}</td>
                <td>{{ report.total }}</td>
                <td>{{ report.doing }}</td>
                <td>{{ report.doingOutDate }}</td>
                <td>{{ report.done }}</td>
                <td>{{ report.doneOutDate }}</td>
                <td>{{ report.approving }}</td>
              </tr>
              <tr class="header-footer-row">
                <td>Tổng</td>
                <td>{{ viewmodel.totals.total }}</td>
                <td>{{ viewmodel.totals.doing }}</td>
                <td>{{ viewmodel.totals.doingOutDate }}</td>
                <td>{{ viewmodel.totals.done }}</td>
                <td>{{ viewmodel.totals.doneOutDate }}</td>
                <td>{{ viewmodel.totals.approving }}</td>
              </tr>
            </table>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Observer } from 'mobx-vue'
import moment from 'moment'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { ReportGeneralViewModel } from '../viewmodels/report-general-viewmodel'

@Observer
@Component({
  components: {
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue')
  }
})
export default class ReportGeneralPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new ReportGeneralViewModel(this.providers)

  fromDate = moment()
    .add(-1, 'month')
    .toISOString()
  toDate = moment().toISOString()

  search() {
    this.viewmodel.loadData(this.fromDate, this.toDate)
  }
}
</script>

<style scoped type="scss">
table,
th,
td {
  border: 1px solid #e0e0e0;
  border-collapse: collapse;
  padding: 12px;
  text-align: center;
}

.header-footer-row td {
  font-weight: 500;
}
</style>

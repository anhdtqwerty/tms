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
                <v-btn depressed color="primary" medium block>
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
            <p>BÁO CÁO TỔNG HỢP CÔNG VIỆC</p>
            <p>Thời gian xuất báo cáo {{ currentTime }}</p>
            <table border="1" class="align-self-stretch">
              <tr>
                <th rowspan="2">Đơn vị</th>
                <th rowspan="2">Tổng nhiệm vụ</th>
                <th colspan="2">Đang thực hiện</th>
                <th colspan="2">Đã hoàn thành</th>
                <th rowspan="2">Đã phê duyệt</th>
              </tr>
              <tr>
                <th>Trong hạn</th>
                <th>Quá hạn</th>
                <th>Trong hạn</th>
                <th>Quá hạn</th>
              </tr>
            </table>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import moment from 'moment'
import { Component, Vue } from 'vue-property-decorator'

@Observer
@Component({
  components: {
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue')
  }
})
export default class ReportGeneralPage extends Vue {
  fromDate: string = null
  toDate: string = null
  currentTime = moment().format('MM/DD/YYYY hh:mm:ss')
}
</script>

<style scoped></style>

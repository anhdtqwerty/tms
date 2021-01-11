<template>
  <v-container fluid px-5 py-2>
    <v-row justify="space-between" align="center">
      <v-col cols="12">
        <div class="text-h6">Tra cứu log</div>
        <breadcrumbs />
      </v-col>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table
            :items="viewmodel.displayLogs"
            item-key="id"
            :headers="headers"
            mobile-breakpoint="0"
            :server-items-length="viewmodel.totalCount"
            :footer-props="{ itemsPerPageOptions: [25] }"
            @update:page="viewmodel.loadData($event)"
          >
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { LogManagerViewModel } from '../viewmodels/log-manager-viewmodel'

@Component
export default class LogManagerPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new LogManagerViewModel(this.providers)

  headers = [
    { text: 'Tài khoản', value: 'comrade.code', sortable: false },
    { text: 'Hành động', value: 'displayAction', sortable: false },
    { text: 'Chức năng đã thao tác', value: 'displayFeature', sortable: false },
    { text: 'Nội dung thay đổi', value: 'displayDescription', sortable: false },
    { text: 'Thời gian thay đổi', value: 'displayDatetime', sortable: false },
    { text: 'Địa chỉ IP', value: 'data.ip', sortable: false },
    { text: 'Trình duyệt', value: 'data.browser', sortable: false }
  ]
}
</script>

<style scoped></style>

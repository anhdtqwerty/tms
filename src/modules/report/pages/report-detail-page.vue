<template>
  <v-container fluid px-5 py-2>
    <v-row>
      <v-col cols="12" class="pa-2">
        <div class="text-h6">BÁO CÁO CHI TIẾT</div>
        <breadcrumbs />
      </v-col>
      <v-col cols="12" class="pa-2">
        <v-card>
          <div class="d-flex flex-column pa-4 pb-0">
            <div class="text-subtitle-1 font-weight-medium">Quản lý báo cáo</div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" class="pa-2">
        <v-data-table
          :items="viewmodel.reports"
          item-key="id"
          @click:row="showDetail"
          :headers="selectedHeaders"
          :footer-props="{ itemsPerPageOptions: [25] }"
          mobile-breakpoint="0"
        >
          <template v-slot:top>
            <task-search-component title="Danh sách các nhiệm vụ giao">
              <div>
                <table-header-setting :headers="headers" @change="selectedHeaders = $event" />
                <v-btn icon small>
                  <v-icon>more_horiz</v-icon>
                </v-btn>
              </div>
            </task-search-component>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { ReportDetailViewModel } from '../viewmodels/report-detail-viewmodel'

@Component
export default class ReportDetailPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new ReportDetailViewModel(this.providers)

  selectedHeaders: any[] = []
  headers = [
    { text: 'Số/ký hiệu', value: 'code', sortable: false },
    { text: 'Ngày ban hành', value: 'publishedDate', sortable: false },
    { text: 'Trích yếu', value: 'title', sortable: true },
    { text: 'Nội dung nhiệm vụ', value: 'description', sortable: false },
    { text: 'ĐV theo dõi', value: 'supervisorUnit.title', sortable: false },
    { text: 'Trạng thái', value: 'status', sortable: false },
    { text: 'Hạn xử lý', value: 'expireDate', sortable: false }
  ]
}
</script>

<style scoped></style>

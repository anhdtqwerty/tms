<template>
  <v-container fluid px-5 py-2>
    <v-row>
      <v-col cols="12" class="pa-2">
        <div class="text-h6">BÁO CÁO CHI TIẾT</div>
        <breadcrumbs />
      </v-col>
      <v-col cols="12" class="pa-2">
        <v-card>
          <div class="d-flex flex-column pa-4">
            <div class="text-subtitle-1 font-weight-medium mb-4">Quản lý báo cáo</div>
            <v-select
              v-model="selectedTaskType"
              dense
              outlined
              hide-details
              item-text="name"
              item-value="type"
              :items="items"
              label="Chọn nhiệm vụ"
              style="max-width: 220px"
            />
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" class="pa-2">
        <v-data-table
          :items="viewmodel.tasks"
          item-key="id"
          :headers="selectedHeaders"
          :server-items-length="viewmodel.totalTask"
          @update:page="viewmodel.search($event)"
          :footer-props="{ itemsPerPageOptions: [25] }"
          mobile-breakpoint="0"
        >
          <template v-slot:top>
            <task-search-component
              title="Danh sách Nhiệm Vụ"
              @advance-search="viewmodel.advanceSearch($event)"
              @simple-search="viewmodel.simpleSearch($event)"
            >
              <div>
                <table-header-setting :headers="headers" @change="selectedHeaders = $event" />
                <v-btn icon small @click="viewmodel.exportExcel()">
                  <v-icon>more_horiz</v-icon>
                </v-btn>
              </div>
            </task-search-component>
          </template>
          <template v-slot:[`item.state`]="{ item }">
            <task-state-component :state="item.state" />
          </template>
          <template v-slot:[`item.supervisors`]="{ item }">
            {{ item.supervisors | _get('[0].name') }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Inject, Provide, Vue, Watch } from 'vue-property-decorator'
import { ReportDetailViewModel } from '../viewmodels/report-detail-viewmodel'
import { taskRouteNames, TaskRouteType } from '@/models/task-model'

@Component({
  components: {
    TaskSearchComponent: () => import('@/modules/task-manager/components/task-search-component.vue'),
    TaskStateComponent: () => import('@/modules/task-manager/components/task-state-component.vue')
  }
})
export default class ReportDetailPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new ReportDetailViewModel(this.providers)

  selectedHeaders: any[] = []
  headers = [
    { text: 'Số/ký hiệu', value: 'code', sortable: false },
    { text: 'Ngày ban hành', value: 'publishedDate', sortable: false },
    { text: 'Trích yếu', value: 'title', sortable: false },
    { text: 'Nội dung nhiệm vụ', value: 'description', sortable: false },
    { text: 'ĐV thực hiện', value: 'executedUnitDep', sortable: false, defaultHide: true },
    { text: 'CV thực hiện', value: 'executedComrade.name', sortable: false },
    { text: 'ĐV theo dõi', value: 'supervisorUnitDep', sortable: false },
    { text: 'CV theo dõi', value: 'supervisors', sortable: false, defaultHide: true },
    { text: 'Hạn xử lý', value: 'expiredDate', sortable: false },
    { text: 'Trạng thái', value: 'state', sortable: false }
  ]

  selectedTaskType: TaskRouteType = 'task-created'
  items = taskRouteNames

  @Watch('selectedTaskType', { immediate: true }) onSelectedTaskTypeChanged(val: TaskRouteType) {
    this.viewmodel.changeTaskType(val)
  }
}
</script>

<style scoped></style>

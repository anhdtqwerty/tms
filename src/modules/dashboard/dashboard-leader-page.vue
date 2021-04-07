<template>
  <v-container fluid px-5 py-2>
    <v-row>
      <v-col cols="12" class="pa-2">
        <div class="text-h6">Trang chủ</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card icon="list_alt" title="Tổng số" :value="viewmodel.topStats.total" />
      </v-col>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card
          icon="schedule"
          title="Đang thực hiện"
          :value="viewmodel.topStats.doing + viewmodel.topStats.doingOutDate || 0"
          :intime="viewmodel.topStats.doing"
          :overtime="viewmodel.topStats.doingOutDate"
        />
      </v-col>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card
          icon="done"
          title="Hoàn thành"
          :value="viewmodel.topStats.done + viewmodel.topStats.doneOutDate || 0"
          :intime="viewmodel.topStats.done"
          :overtime="viewmodel.topStats.doneOutDate"
        />
      </v-col>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card icon="restore" title="Đã quá hạn" value="0" />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="providers.isLeader" cols="12" class="pa-2">
        <task-column-chart-card />
      </v-col>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table
            :items="viewmodel.updateTaskHistory"
            item-key="title"
            :headers="headers"
            :footer-props="{ itemsPerPageOptions: [25] }"
            mobile-breakpoint="0"
          >
            <template v-slot:top>
              <div class="d-flex flex-column">
                <div class="primary--text text-h6 px-4 pt-4 pb-2">
                  {{ providers.authStore.isLeader ? 'Các nhiệm vụ mới cập nhật' : 'Các nhiệm vụ cập nhật' }}
                </div>
                <div class="px-4" v-if="!providers.isLeader">
                  <v-btn
                    :text="viewmodel.personalHistoryFilter !== 'new'"
                    :outlined="viewmodel.personalHistoryFilter === 'new'"
                    color="primary"
                    small
                    @click="viewmodel.changePersonalHistoryFilter('new')"
                    >Nhiệm vụ mới</v-btn
                  >
                  <!-- <v-btn
                    :text="viewmodel.updatedTaskFilter !== 'soon_expired'"
                    :outlined="viewmodel.updatedTaskFilter === 'soon_expired'"
                    color="error"
                    small
                    @click="viewmodel.changeUpdatedTaskFilter('soon_expired')"
                    >Sắp hết hạn</v-btn
                  > -->
                  <v-btn
                    :text="viewmodel.personalHistoryFilter !== 'expired'"
                    :outlined="viewmodel.personalHistoryFilter === 'expired'"
                    color="grey"
                    small
                    @click="viewmodel.changePersonalHistoryFilter('expired')"
                    >Quá hạn</v-btn
                  >
                </div>
              </div>
            </template>
            <template v-slot:[`item.created_at`]="{ item }">
              {{ item.created_at | ddmmyyyy }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { DashboardLeaderViewModel } from './dashboard-leader-viewmodel'

@Component({
  components: {
    OverviewCard: () => import('./components/overview-card.vue'),
    TaskColumnChartCard: () => import('./components/task-column-chart-card.vue'),
    TaskCircleChartCard: () => import('./components/task-circle-chart-card.vue')
  }
})
export default class DashboardLeaderPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new DashboardLeaderViewModel(this.providers)

  headers = [
    { text: 'Tên nhiệm vụ', value: 'task.title', sortable: false },
    { text: 'Thời gian cập nhật', value: 'created_at', sortable: false },
    { text: 'Người cập nhật', value: 'requestor.name', sortable: false }
  ]
}
</script>

<style scoped></style>

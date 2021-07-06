<template>
  <v-container fluid px-5 py-2>
    <v-row>
      <v-col cols="12" class="pa-2">
        <div class="text-h6">Trang chủ</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card
          icon="list_alt"
          title="Tổng số"
          :value="vm.totalCreated + vm.totalExecuted"
          left-text="Được giao"
          right-text="Giao"
          :left-value="vm.totalExecuted"
          :right-value="vm.totalCreated"
          :color="`#4BCA81`"
        />
      </v-col>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card
          icon="schedule"
          title="Đang thực hiện"
          :value="vm.topTotalDoing"
          :left-value="vm.topDoing"
          :right-value="vm.topDoingOutDate"
          :color="`#0084FF`"
        />
      </v-col>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card
          icon="done"
          title="Hoàn thành"
          :value="vm.topTotalDone"
          :left-value="vm.topDone"
          :right-value="vm.topDoneOutDate"
          :color="`#FFC410`"
        />
      </v-col>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card icon="restore" title="Đã quá hạn" :value="vm.topOutOfDate" :color="`#FF1D30`" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-2">
        <task-column-chart-card />
      </v-col>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table
            class="row-pointer"
            :items="vm.latestTasks"
            item-key="id"
            :headers="headers"
            @click:row="showDetail"
            :footer-props="{ itemsPerPageOptions: [25] }"
            mobile-breakpoint="0"
          >
            <template v-slot:top>
              <div class="d-flex flex-column">
                <div class="primary--text text-h6 px-4 pt-4 pb-2">
                  Các nhiệm vụ cập nhật
                </div>
                <div class="px-4">
                  <v-btn
                    :text="vm.lastTaskFilter !== 'new'"
                    :outlined="vm.lastTaskFilter === 'new'"
                    color="primary"
                    small
                    @click="vm.changeLatestTaskType('new')"
                    >Nhiệm vụ mới</v-btn
                  >
                  <v-btn
                    :text="vm.lastTaskFilter !== 'expired_soon'"
                    :outlined="vm.lastTaskFilter === 'expired_soon'"
                    color="error"
                    small
                    @click="vm.changeLatestTaskType('expired_soon')"
                    >Sắp hết hạn</v-btn
                  >
                  <v-btn
                    :text="vm.lastTaskFilter !== 'expired'"
                    :outlined="vm.lastTaskFilter === 'expired'"
                    color="grey"
                    small
                    @click="vm.changeLatestTaskType('expired')"
                    >Quá hạn</v-btn
                  >
                </div>
              </div>
            </template>
            <template v-slot:[`item.updated_at`]="{ item }">
              {{ item.updated_at | ddmmyyyy }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { TaskModel } from '@/models/task-model'
import { Observer } from 'mobx-vue'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { DashboardLeaderViewModel } from './dashboard-leader-viewmodel'

@Observer
@Component({
  components: {
    OverviewCard: () => import('./components/overview-card.vue'),
    TaskColumnChartCard: () => import('./components/task-column-chart-card.vue'),
    TaskCircleChartCard: () => import('./components/task-circle-chart-card.vue')
  }
})
export default class DashboardLeaderPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() vm = new DashboardLeaderViewModel(this.providers)

  headers = [
    { text: 'Số/ký hiệu', value: 'code', sortable: false },
    { text: 'Trích yếu', value: 'title', sortable: false },
    { text: 'Nội dung nhiệm vụ', value: 'description', sortable: false },
    { text: 'Thời gian cập nhật', value: 'updated_at', sortable: false }
  ]

  showDetail(item: TaskModel) {
    this.$router.push({ path: '/task/' + item.id })
  }
}
</script>

<style scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>

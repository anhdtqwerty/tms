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
        />
      </v-col>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card
          icon="schedule"
          title="Đang thực hiện"
          :value="vm.topTotalDoing"
          :left-value="vm.topDoing"
          :right-value="vm.topDoingOutDate"
        />
      </v-col>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card
          icon="done"
          title="Hoàn thành"
          :value="vm.topTotalDone"
          :left-value="vm.topDone"
          :right-value="vm.topDoneOutDate"
        />
      </v-col>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card icon="restore" title="Đã quá hạn" :value="vm.topOutOfDate" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" class="pa-2">
        <task-circle-chart-card />
      </v-col>
      <v-col cols="12" md="6" class="pa-2">
        <v-card>
          <div>
            <div class="primary--text text-h6 px-4 pt-4">Nhiệm vụ chưa cập nhật</div>
            <v-list v-if="vm.unupdatedTasks.length > 0">
              <v-list-item v-for="(item, index) in vm.unupdatedTasks" :key="index">
                <v-list-item-action>
                  {{ index + 1 }}
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-list-item v-else>
              <v-list-item-content>
                <v-list-item-title>Không có</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table
            class="row-pointer"
            :items="vm.latestTasks"
            item-key="id"
            @click:row="showDetail"
            :headers="headers"
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
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { DashboardComradeViewModel } from './dashboard-comrade-viewmodel'

@Component({
  components: {
    OverviewCard: () => import('./components/overview-card.vue'),
    TaskColumnChartCard: () => import('./components/task-column-chart-card.vue'),
    TaskCircleChartCard: () => import('./components/task-circle-chart-card.vue')
  }
})
export default class DashboardPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() vm = new DashboardComradeViewModel(this.providers)

  headers = [
    { text: 'Tên nhiệm vụ', value: 'title', sortable: false },
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

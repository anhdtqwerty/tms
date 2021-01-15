<template>
  <v-container fluid px-5 py-2>
    <v-row>
      <v-col cols="12" class="pa-2">
        <div class="text-h6">Dashboard</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card icon="list_alt" title="Tổng số" :value="viewmodel.topStatCriterias.total" />
      </v-col>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card
          icon="schedule"
          title="Đang thực hiện"
          :value="viewmodel.topStatCriterias.doing"
          :intime="viewmodel.topStatCriterias.doing - viewmodel.topStatCriterias.doingOutDate"
          :overtime="viewmodel.topStatCriterias.doingOutDate"
        />
      </v-col>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card
          icon="done"
          title="Hoàn thành"
          :value="viewmodel.topStatCriterias.done"
          :intime="viewmodel.topStatCriterias.done - viewmodel.topStatCriterias.doneOutDate"
          :overtime="viewmodel.topStatCriterias.doneOutDate"
        />
      </v-col>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card icon="restore" title="Đã quá hạn" value="0" />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-leader cols="12" class="pa-2">
        <task-column-chart-card />
      </v-col>
      <v-col v-member cols="12" md="6" class="pa-2">
        <task-circle-chart-card />
      </v-col>
      <v-col v-member cols="12" md="6" class="pa-2">
        <v-card>
          <div>
            <div class="primary--text text-h6 px-4 pt-4">Nhiệm vụ chưa cập nhật</div>
            <v-list v-if="viewmodel.unupdatedTasks.length > 0">
              <v-list-item v-for="(item, index) in viewmodel.unupdatedTasks" :key="index">
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
                <div class="px-4" v-member>
                  <v-btn
                    :text="viewmodel.updatedTaskFilter !== 'new'"
                    :outlined="viewmodel.updatedTaskFilter === 'new'"
                    color="primary"
                    small
                    @click="viewmodel.changeUpdatedTaskFilter('new')"
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
                    :text="viewmodel.updatedTaskFilter !== 'expired'"
                    :outlined="viewmodel.updatedTaskFilter === 'expired'"
                    color="grey"
                    small
                    @click="viewmodel.changeUpdatedTaskFilter('expired')"
                    >Quá hạn</v-btn
                  >
                </div>
              </div>
            </template>
            <template v-slot:[`item.created_at`]="{ item }">
              {{ item.created_at | mmddyyyy }}
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
import { DashboardViewModel } from './dashboard-viewmodel'

@Component({
  components: {
    OverviewCard: () => import('./components/overview-card.vue'),
    TaskColumnChartCard: () => import('./components/task-column-chart-card.vue'),
    TaskCircleChartCard: () => import('./components/task-circle-chart-card.vue')
  }
})
export default class DashboardPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new DashboardViewModel(this.providers)

  headers = [
    { text: 'Tên nhiệm vụ', value: 'task.title', sortable: false },
    { text: 'Thời gian cập nhật', value: 'created_at', sortable: false },
    { text: 'Người cập nhật', value: 'requestor.name', sortable: false }
  ]
}
</script>

<style scoped></style>

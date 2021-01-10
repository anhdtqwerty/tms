<template>
  <v-container fluid px-5 py-2>
    <v-row>
      <v-col cols="12" class="pa-2">
        <div class="text-h6">Dashboard</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card icon="list_alt" title="Tổng số" value="320" />
      </v-col>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card icon="list_alt" title="Đang thực hiện" value="160" intime="150" overtime="10" />
      </v-col>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card icon="list_alt" title="Hoàn thành" value="100" />
      </v-col>
      <v-col cols="6" lg="3" class="pa-2">
        <overview-card icon="list_alt" title="Đã quá hạn" value="60" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-2">
        <task-column-chart-card />
      </v-col>
      <v-col cols="12" md="6" class="pa-2">
        <task-circle-chart-card />
      </v-col>
      <v-col cols="12" md="6" class="pa-2">
        <v-card>
          <div>
            <div class="primary--text text-h6 px-4 pt-4">Nhiệm vụ chưa cập nhật</div>
            <v-list>
              <v-list-item v-for="(item, index) in viewmodel.unupdatedTasks" :key="index">
                <v-list-item-action>
                  {{ index + 1 }}
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ item }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table
            :items="viewmodel.updatedTasks"
            item-key="title"
            :headers="headers"
            :footer-props="{ itemsPerPageOptions: [25] }"
            mobile-breakpoint="0"
          >
            <template v-slot:top>
              <div class="d-flex flex-column">
                <div class="primary--text text-h6 px-4 pt-4 pb-2">Các nhiệm vụ cập nhật</div>
                <div class="px-4">
                  <v-btn
                    :text="viewmodel.updatedTaskFilter !== 'new'"
                    :outlined="viewmodel.updatedTaskFilter === 'new'"
                    color="primary"
                    small
                    @click="viewmodel.changeUpdatedTaskFilter('new')"
                    >Nhiệm vụ mới</v-btn
                  >
                  <v-btn
                    :text="viewmodel.updatedTaskFilter !== 'soon_expired'"
                    :outlined="viewmodel.updatedTaskFilter === 'soon_expired'"
                    color="error"
                    small
                    @click="viewmodel.changeUpdatedTaskFilter('soon_expired')"
                    >Sắp hết hạn</v-btn
                  >
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
    { text: 'Tên nhiệm vụ', value: 'title', sortable: false },
    { text: 'Thời gian cập nhật', value: 'updatedDate', sortable: false },
    { text: 'Người cập nhật', value: 'updatedComrade', sortable: false }
  ]
}
</script>

<style scoped></style>

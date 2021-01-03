<template>
  <v-container fluid px-5 py-2>
    <v-row justify="space-between" align="center">
      <v-col cols="8" class="pa-2">
        <div class="text-h6">Nhiệm vụ giao</div>
        <breadcrumbs />
      </v-col>
      <v-col cols="4" align="right" class="pa-2">
        <v-btn medium color="success" @click="showAddTask = true">
          <v-icon left>add</v-icon>
          <span>Thêm nhiệm vụ</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table
            :items="viewmodel.task"
            item-key="id"
            :headers="headers"
            :footer-props="{ itemsPerPageOptions: [25] }"
            mobile-breakpoint="0"
          >
            <template v-slot:top>
              <v-container fluid class="px-5 py-0">
                <v-row>
                  <v-col cols="12" class="pa-2 d-flex justify-space-between">
                    <div class="text-h6">Danh sách Nhiệm vụ giao</div>
                    <div>
                      <v-btn icon small>
                        <v-icon>settings</v-icon>
                      </v-btn>
                      <v-btn icon small>
                        <v-icon>more</v-icon>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
                <v-row v-if="advanceSearch">
                  <v-col cols="12" class="d-flex pa-0">
                    <div class="flex-grow-1">
                      <v-container fluid class="py-0">
                        <v-row>
                          <v-col cols="12" md="3" class="d-none d-sm-flex pa-2 align-center">
                            <app-text-field hide-details v-model="searchCode" label="Số/ký hiệu" />
                          </v-col>
                          <v-col cols="12" md="3" class="d-none d-sm-flex pa-2 align-center">
                            <app-text-field hide-details v-model="searchShortDescription" label="Trích yếu" />
                          </v-col>
                          <v-col cols="12" md="3" class="d-none d-sm-flex pa-2 align-center">
                            <task-priority-select
                              hide-details
                              :value.sync="searchPriority"
                              label="Mức độ quan trọng"
                              :unitRequired="false"
                            />
                          </v-col>
                          <v-col cols="12" md="3" class="d-none d-sm-flex pa-2 align-center">
                            <task-state-select
                              hide-details
                              :value.sync="searchState"
                              label="Trạng thái phê duyệt"
                              :unitRequired="false"
                            />
                          </v-col>

                          <v-col cols="12" md="3" class="pa-2">
                            <app-text-field hide-details v-model="searchExecuteUnit" label="Đơn vị được giao" />
                          </v-col>
                          <v-col cols="12" md="3" class="pa-2">
                            <app-text-field hide-details v-model="searchExecuteStaff" label="Cá nhân được giao" />
                          </v-col>
                          <v-col cols="12" md="3" class="pa-2">
                            <task-status-select
                              hide-details
                              :value.sync="searchStatus"
                              label="Tình hình thực hiện"
                              :unitRequired="false"
                            />
                          </v-col>
                          <v-col cols="12" md="3" class="pa-2">
                            <task-processing-expire-select
                              hide-details
                              :value.sync="searchProcessingExpire"
                              label="Hạn xử lý nhiệm vụ"
                              :unitRequired="false"
                            />
                          </v-col>

                          <v-col cols="12" md="3" class="pa-2">
                            <app-text-field hide-details v-model="searchSupervisorUnit" label="Đơn vị theo dõi" />
                          </v-col>
                          <v-col cols="12" md="3" class="pa-2">
                            <app-text-field hide-details v-model="searchSupervisor" label="Cá nhân theo dõi" />
                          </v-col>
                          <v-col cols="12" md="3" class="pa-2">
                            <date-picker-input hide-details v-model="searchPushlishedDate" label="Ngày ban hành" />
                          </v-col>
                          <v-col cols="12" md="3" class="pa-2">
                            <app-text-field hide-details v-model="searchExpiredDate" label="Thời hạn xử lý" />
                          </v-col>
                        </v-row>
                      </v-container>
                    </div>
                    <div class="pa-2">
                      <v-btn depressed color="transparent" medium @click="toggleAdvanceSearch" class="mb-4">
                        <span class="d-none d-md-flex blue--text mr-4">Tìm kiếm nâng cao</span>
                        <v-icon color="blue">expand_more</v-icon>
                      </v-btn>
                      <v-btn depressed color="primary" medium @click="search">
                        <span class="d-none d-md-flex mr-4">Tìm kiếm</span>
                        <v-icon dark>search</v-icon>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
                <v-row v-else>
                  <v-col cols="12" class="d-none d-sm-flex pa-2 align-center">
                    <app-text-field class="mr-4" hide-details label="Nhập từ khóa để tìm kiếm nhiệm vụ" />
                    <v-btn depressed color="transparent" medium @click="toggleAdvanceSearch" class="mr-4 pa-2">
                      <span class="d-none d-md-flex blue--text mr-4">Tìm kiếm nâng cao</span>
                      <v-icon color="blue">expand_less</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <task-add-dialog :value.sync="showAddTask" />
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { TaskManagerViewModel } from '../viewmodels/task-manager-viewmodel'

@Component({
  components: {
    TaskAddDialog: () => import('../dialogs/task-add-dialog.vue'),
    TaskPrioritySelect: () => import('@/components/autocomplete/task-priority-select.vue'),
    TaskStateSelect: () => import('@/components/autocomplete/task-state-select.vue'),
    TaskStatusSelect: () => import('@/components/autocomplete/task-status-select.vue'),
    TaskProcessingExpireSelect: () => import('@/components/autocomplete/task-processing-expire-select.vue'),
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue')
  }
})
export default class TaskManagerPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new TaskManagerViewModel(this.providers)

  advanceSearch = true

  showAddTask = false

  searchCode = ''
  searchShortDescription = ''
  searchPriority: string = null
  searchState: string = null

  searchExecuteUnit = ''
  searchExecuteStaff = ''
  searchStatus: string = null
  searchProcessingExpire: string = null

  searchSupervisorUnit = ''
  searchSupervisor = ''
  searchPushlishedDate: string = null
  searchExpiredDate = ''

  headers = [
    { text: 'Số/ký hiệu', value: 'code', sortable: false },
    { text: 'Ngày ban hành', value: 'publishedDate', sortable: false },
    { text: 'Trích yếu', value: 'shortDescription', sortable: true },
    { text: 'Nội dung nhiệm vụ', value: 'description', sortable: false },
    { text: 'ĐV theo dõi', value: 'supervisorUnit', sortable: false },
    { text: 'Trạng thái', value: 'status', sortable: false },
    { text: 'Hạn xử lý', value: 'expireDate', sortable: false },
    { value: 'actions', align: 'right', sortable: false }
  ]

  search() {
    // this.viewmodel.search(this.searchCode, this.searchShortDescription, this.searchPriority, this.searchState)
  }

  toggleAdvanceSearch() {
    this.advanceSearch = !this.advanceSearch
  }
}
</script>

<style scoped></style>

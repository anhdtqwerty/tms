<template>
  <v-container fluid class="px-5 py-0">
    <v-row>
      <v-col cols="12" class="pa-2 d-flex justify-space-between">
        <div class="text-h6">{{ title }}</div>
        <slot></slot>
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
                  :value.sync="searchApprovementState"
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
                <date-picker-input hide-details :value.sync="searchPushlishedDate" label="Ngày ban hành" />
              </v-col>
              <v-col cols="12" md="3" class="pa-2">
                <date-picker-input hide-details :value.sync="searchRangeDate" label="Thời hạn xử lý" />
              </v-col>
            </v-row>
          </v-container>
        </div>

        <div class="ml-3">
          <v-row>
            <v-col cols="12" class="pa-2">
              <v-btn depressed color="transparent" medium @click="toggleAdvanceSearch">
                <span class="d-none d-md-flex blue--text mr-4">Tìm kiếm nâng cao</span>
                <v-icon color="blue">expand_more</v-icon>
              </v-btn>
              <v-btn depressed color="primary" medium @click="search" class="mt-5">
                <span class="d-none d-md-flex mr-4">Tìm kiếm</span>
                <v-icon dark>search</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" class="d-none d-sm-flex pa-2 align-center">
        <app-text-field
          class="mr-4 search-input"
          hide-details
          label="Nhập từ khóa để tìm kiếm nhiệm vụ"
          append-icon="search"
          @click:append="search"
        />
        <v-btn depressed color="transparent" medium @click="toggleAdvanceSearch">
          <span class="d-none d-md-flex blue--text mr-4">Tìm kiếm nâng cao</span>
          <v-icon color="blue">expand_less</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {
    TaskPrioritySelect: () => import('@/components/autocomplete/task-priority-select.vue'),
    TaskStateSelect: () => import('@/components/autocomplete/task-state-select.vue'),
    TaskStatusSelect: () => import('@/components/autocomplete/task-status-select.vue'),
    TaskProcessingExpireSelect: () => import('@/components/autocomplete/task-processing-expire-select.vue'),
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue')
  }
})
export default class TaskSearchComponent extends Vue {
  @Prop() title!: string

  advanceSearch = true
  searchCode = ''
  searchShortDescription = ''
  searchPriority: string = null
  searchApprovementState: string = null

  searchExecuteUnit = ''
  searchExecuteStaff = ''
  searchStatus: string = null
  searchProcessingExpire: string = null

  searchSupervisorUnit = ''
  searchSupervisor = ''
  searchPushlishedDate: string = null
  searchRangeDate = ''

  search() {
    //
  }

  toggleAdvanceSearch() {
    this.advanceSearch = !this.advanceSearch
  }
}
</script>

<style scoped>
>>> .v-input__icon--append .v-icon {
  color: #2196f3;
}
</style>

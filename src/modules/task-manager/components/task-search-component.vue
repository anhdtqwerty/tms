<template>
  <v-container fluid class="px-5 py-0">
    <v-row>
      <v-col cols="12" class="pa-2 d-flex justify-space-between">
        <div class="text-h6">{{ title }}</div>
        <slot></slot>
      </v-col>
    </v-row>
    <v-row v-show="advanceSearch">
      <v-col cols="12" class="d-flex px-2 py-0">
        <div class="flex-grow-1">
          <v-container fluid class="px-1 py-0">
            <v-row>
              <v-col cols="12" md="4" lg="3" class="d-none d-sm-flex pa-2 align-center">
                <app-text-field hide-details v-model="searchCode" label="Số/ký hiệu" />
              </v-col>
              <v-col cols="12" md="4" lg="3" class="d-none d-sm-flex pa-2 align-center">
                <app-text-field hide-details v-model="searchTitle" label="Trích yếu" />
              </v-col>
              <v-col cols="12" md="4" lg="3" class="d-none d-sm-flex pa-2 align-center">
                <task-priority-select
                  hide-details
                  :value.sync="searchPriority"
                  label="Mức độ quan trọng"
                  :unitRequired="false"
                />
              </v-col>
              <v-col cols="12" md="4" lg="3" class="d-none d-sm-flex pa-2 align-center">
                <task-approvement-status-select
                  hide-details
                  :value.sync="searchApprovementStatus"
                  label="Trạng thái phê duyệt"
                  :unitRequired="false"
                />
              </v-col>

              <v-col cols="12" md="4" lg="3" class="pa-2">
                <unit-autocomplete hide-details :value.sync="searchExecuteUnit" label="Đơn vị được giao" />
              </v-col>
              <v-col cols="12" md="4" lg="3" class="pa-2">
                <comrade-autocomplete
                  hide-details
                  :value.sync="searchExecuteStaff"
                  :unit="searchExecuteUnit"
                  label="Cá nhân được giao"
                />
              </v-col>
              <v-col cols="12" md="4" lg="3" class="pa-2">
                <task-state-select
                  hide-details
                  :value.sync="searchState"
                  label="Tình hình thực hiện"
                  :unitRequired="false"
                />
              </v-col>
              <v-col cols="12" md="4" lg="3" class="pa-2">
                <task-processing-expire-select
                  hide-details
                  :value.sync="searchProcessingExpire"
                  label="Hạn xử lý nhiệm vụ"
                  :unitRequired="false"
                />
              </v-col>

              <v-col cols="12" md="4" lg="3" class="pa-2">
                <unit-autocomplete hide-details :value.sync="searchSupervisorUnit" label="Đơn vị theo dõi" />
              </v-col>
              <v-col cols="12" md="4" lg="3" class="pa-2">
                <comrade-autocomplete
                  hide-details
                  :value.sync="searchSupervisor"
                  :unit="searchSupervisorUnit"
                  label="Cá nhân theo dõi"
                />
              </v-col>
              <v-col cols="12" md="4" lg="3" class="pa-2">
                <date-picker-input
                  hide-details
                  :value.sync="searchPushlishedDate"
                  :attach="true"
                  label="Ngày ban hành"
                />
              </v-col>
              <v-col cols="12" md="4" lg="3" class="pa-2">
                <date-range-picker-input
                  hide-details
                  :value.sync="searchRangeDate"
                  :attach="true"
                  label="Thời hạn xử lý"
                />
              </v-col>
            </v-row>
          </v-container>
        </div>

        <div class="ml-3 py-2">
          <div class="d-flex flex-column">
            <v-btn depressed color="transparent" medium @click="toggleAdvanceSearch" class="px-0">
              <span class="d-none d-md-flex blue--text">Tìm kiếm nâng cao</span>
              <v-icon color="blue">expand_less</v-icon>
            </v-btn>
            <v-btn depressed color="primary" medium @click="search" class="mt-5">
              <span class="d-none d-md-flex mr-4">Tìm kiếm</span>
              <v-icon dark>search</v-icon>
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row v-show="!advanceSearch">
      <v-col cols="12" class="d-none d-sm-flex pa-2">
        <app-text-field
          class="mr-4 search-input"
          hide-details
          label="Nhập từ khóa để tìm kiếm nhiệm vụ"
          v-model="simpleSearchKeyword"
          v-on:keyup.enter="search"
          ><v-icon slot="append" color="blue">
            search
          </v-icon>
        </app-text-field>
        <v-btn depressed color="transparent" medium @click="toggleAdvanceSearch" class="px-0">
          <span class="d-none d-md-flex blue--text">Tìm kiếm nâng cao</span>
          <v-icon color="blue">expand_more</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  TaskApprovementStatusType,
  TaskModel,
  TaskPriorityType,
  TaskProcessingExpireType,
  TaskStateType
} from '@/models/task-model'
import moment from 'moment'
import { Component, Prop, Vue } from 'vue-property-decorator'
import _ from 'lodash'
import { textHelpers } from '@/helpers/text-helper'

@Component({
  components: {
    UnitAutocomplete: () => import('@/components/autocomplete/unit-autocomplete.vue'),
    ComradeAutocomplete: () => import('@/components/autocomplete/comrade-autocomplete.vue'),
    TaskPrioritySelect: () => import('@/components/autocomplete/task-priority-select.vue'),
    TaskApprovementStatusSelect: () => import('@/components/autocomplete/task-approvement-status-select.vue'),
    TaskStateSelect: () => import('@/components/autocomplete/task-state-select.vue'),
    TaskProcessingExpireSelect: () => import('@/components/autocomplete/task-processing-expire-select.vue'),
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue'),
    DateRangePickerInput: () => import('@/components/picker/date-range-picker-input.vue')
  }
})
export default class TaskSearchComponent extends Vue {
  @Prop() title!: string

  simpleSearchKeyword = ''

  advanceSearch = true
  searchCode = ''
  searchTitle = ''
  searchPriority: TaskPriorityType = null
  searchApprovementStatus: TaskApprovementStatusType = null

  searchExecuteUnit = ''
  searchExecuteStaff = ''
  searchState: TaskStateType = null
  searchProcessingExpire: TaskProcessingExpireType = null

  searchSupervisorUnit = ''
  searchSupervisor = ''
  searchPushlishedDate: string = null
  searchRangeDate: string[] = []

  search() {
    console.log('search', this.advanceSearch)
    if (this.advanceSearch) {
      const params: TaskModel = {}
      if (this.searchCode) _.set(params, 'code_contains', this.searchCode)
      if (this.searchTitle) _.set(params, 'title_contains', this.searchTitle)
      if (this.searchPriority) params.priority = this.searchPriority
      if (this.searchState) params.state = this.searchState
      if (this.searchExecuteUnit) params.executedUnit = this.searchExecuteUnit
      if (this.searchExecuteStaff) params.executedComrade = this.searchExecuteStaff
      if (this.searchApprovementStatus) params.status = this.searchApprovementStatus
      if (this.searchProcessingExpire) {
        switch (this.searchProcessingExpire) {
          case 'inProcessing':
            params.type = 'hasDeadline'
            _.set(params, 'expiredDate_gt', moment().toISOString())
            break
          case 'expired':
            params.type = 'hasDeadline'
            _.set(params, 'expiredDate_lt', moment().toISOString())
            break
          case 'almostExpired':
            console.warn('Sắp hết hạn chưa hỗ trợ')
            break
        }
      }
      if (this.searchSupervisorUnit) params.supervisorUnit = this.searchSupervisorUnit
      if (this.searchSupervisor) _.set(params, 'supervisors_contains', this.searchSupervisor)
      if (this.searchPushlishedDate) params.publishedDate = this.searchPushlishedDate
      if (this.searchRangeDate.length === 2) {
        params.type = 'hasDeadline'
        _.set(params, 'expiredDate_gt', this.searchRangeDate[0])
        _.set(params, 'expiredDate_lt', this.searchRangeDate[1])
      }
      this.$emit('advance-search', params)
    } else {
      const cleaned = textHelpers.clearUnicode(this.simpleSearchKeyword)
      const simpleParam = cleaned ? { keywords_contains: cleaned } : {}
      console.log(cleaned, simpleParam)
      this.$emit('simple-search', simpleParam)
    }
  }

  toggleAdvanceSearch() {
    this.advanceSearch = !this.advanceSearch
  }
}
</script>

<style scoped></style>

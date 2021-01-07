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
            :items="viewmodel.tasks"
            item-key="id"
            @click:row="taskDetail"
            :headers="headers"
            :footer-props="{ itemsPerPageOptions: [25] }"
            mobile-breakpoint="0"
          >
            <template v-slot:top>
              <task-search-component title="Danh sách các nhiệm vụ giao">
                <div>
                  <v-btn icon small>
                    <v-icon>settings</v-icon>
                  </v-btn>
                  <v-btn icon small>
                    <v-icon>more_horiz</v-icon>
                  </v-btn>
                </div>
              </task-search-component>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click.stop="taskAction(item)">
                more_vert
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <task-add-dialog :value.sync="showAddTask" @success="viewmodel.taskAdded" />
    <task-action-dialog :value.sync="showTaskActionDialog" :task="task" />
    <task-detail-page :value.sync="showTaskDetailDialog" :task="task" />
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { TaskModel } from '@/models/task-model'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { TaskManagerViewModel } from '../viewmodels/task-manager-viewmodel'

@Component({
  components: {
    TaskAddDialog: () => import('../dialogs/task-add-dialog.vue'),
    TaskPrioritySelect: () => import('@/components/autocomplete/task-priority-select.vue'),
    TaskStateSelect: () => import('@/components/autocomplete/task-state-select.vue'),
    TaskStatusSelect: () => import('@/components/autocomplete/task-status-select.vue'),
    TaskProcessingExpireSelect: () => import('@/components/autocomplete/task-processing-expire-select.vue'),
    TaskSearchComponent: () => import('../components/task-search-component.vue'),
    TaskActionDialog: () => import('../dialogs/task-action-dialog.vue'),
    TaskDetailPage: () => import('./task-detail-page.vue')
  }
})
export default class TaskManagerPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new TaskManagerViewModel(this.providers)

  showAddTask = false
  showTaskActionDialog = false
  showTaskDetailDialog = false
  task: TaskModel = null

  headers = [
    { text: 'Số/ký hiệu', value: 'code', sortable: false },
    { text: 'Ngày ban hành', value: 'publishedDate', sortable: false },
    { text: 'Trích yếu', value: 'shortDescription', sortable: true },
    { text: 'Nội dung nhiệm vụ', value: 'description', sortable: false },
    { text: 'ĐV theo dõi', value: 'supervisorUnit.title', sortable: false },
    { text: 'Trạng thái', value: 'status', sortable: false },
    { text: 'Hạn xử lý', value: 'expireDate', sortable: false },
    { value: 'actions', align: 'right', sortable: false }
  ]

  taskAction(item: TaskModel) {
    this.task = item
    this.showTaskActionDialog = true
  }

  taskDetail(item: TaskModel) {
    this.task = item
    this.showTaskDetailDialog = true
  }

  search() {
    // this.viewmodel.search(this.searchCode, this.searchShortDescription, this.searchPriority, this.searchState)
  }
}
</script>

<style scoped></style>

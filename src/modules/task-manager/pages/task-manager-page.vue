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
            @click:row="showDetail"
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
              <v-icon small class="mr-2" @click.stop="showAction(item)">
                more_vert
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <task-add-dialog :value.sync="showAddTask" @success="viewmodel.taskAdded" />
    <task-action-dialog
      :value.sync="showActionDialog"
      @showEdit="showEdit"
      @showRetrive="showRetrive"
      @showExtend="showExtend"
      @showAssign="showAssign"
      @showApprove="showApprove"
      @showReturn="showReturn"
      @showEditStatus="showEditStatus"
    />
    <task-detail-page
      :value.sync="showDetailDialog"
      @showActionDialog="showActionDialog = true"
      :task="this.viewmodel.selectedTask"
    />
    <task-edit-dialog
      :value.sync="showEditDialog"
      :task="this.viewmodel.selectedTask"
      @success="viewmodel.taskUpdated"
    />
    <task-retrieve-dialog
      :value.sync="showRetriveDialog"
      :task="this.viewmodel.selectedTask"
      @success="viewmodel.taskUpdated"
    />
    <task-extend-dialog
      :value.sync="showExtendDialog"
      :task="this.viewmodel.selectedTask"
      @success="viewmodel.taskUpdated"
    />
    <task-assign-dialog
      :value.sync="showAssignDialog"
      :task="this.viewmodel.selectedTask"
      @success="viewmodel.taskUpdated"
    />
    <task-approve-dialog
      :value.sync="showApproveDialog"
      :task="this.viewmodel.selectedTask"
      @success="viewmodel.taskUpdated"
    />
    <task-return-dialog
      :value.sync="showReturnDialog"
      :task="this.viewmodel.selectedTask"
      @success="viewmodel.taskUpdated"
    />
    <task-update-processing-dialog
      :value.sync="showEditStatusDialog"
      :task="this.viewmodel.selectedTask"
      @success="viewmodel.taskUpdated"
    />
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
    TaskDetailPage: () => import('./task-detail-page.vue'),
    TaskEditDialog: () => import('../dialogs/task-edit-dialog.vue'),
    TaskRetrieveDialog: () => import('../dialogs/task-retrieve-dialog.vue'),
    TaskExtendDialog: () => import('../dialogs/task-extend-dialog.vue'),
    TaskAssignDialog: () => import('../dialogs/task-assign-dialog.vue'),
    TaskApproveDialog: () => import('../dialogs/task-approve-dialog.vue'),
    TaskReturnDialog: () => import('../dialogs/task-return-dialog.vue'),
    TaskUpdateProcessingDialog: () => import('../dialogs/task-update-processing-dialog.vue')
  }
})
export default class TaskManagerPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new TaskManagerViewModel(this.providers)

  showAddTask = false
  showDetailDialog = false
  showActionDialog = false
  showEditDialog = false
  showRetriveDialog = false
  showExtendDialog = false
  showAssignDialog = false
  showReturnDialog = false
  showApproveDialog = false
  showEditStatusDialog = false

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

  showAction(item: TaskModel) {
    this.viewmodel.selectedTask = item
    this.showActionDialog = true
  }

  showDetail(item: TaskModel) {
    this.viewmodel.selectedTask = item
    this.showDetailDialog = true
  }

  showEdit() {
    this.showEditDialog = true
    this.showActionDialog = false
  }

  showRetrive() {
    this.showRetriveDialog = true
    this.showActionDialog = false
  }

  showExtend() {
    this.showExtendDialog = true
    this.showActionDialog = false
  }

  showAssign() {
    this.showAssignDialog = true
    this.showActionDialog = false
  }

  showApprove() {
    this.showApproveDialog = true
    this.showActionDialog = false
  }

  showReturn() {
    this.showReturnDialog = true
    this.showActionDialog = false
  }

  showEditStatus() {
    this.showEditStatusDialog = true
    this.showActionDialog = false
  }

  search() {
    // this.viewmodel.search(this.searchCode, this.searchShortDescription, this.searchPriority, this.searchState)
  }
}
</script>

<style scoped></style>

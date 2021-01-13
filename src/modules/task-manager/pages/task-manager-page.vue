<template>
  <v-container fluid px-5 py-2>
    <v-row justify="space-between" align="center">
      <v-col cols="8" class="pa-2">
        <div class="text-h6">Nhiệm vụ giao</div>
        <breadcrumbs />
      </v-col>
      <v-col cols="4" align="right" class="pa-2">
        <v-btn v-permission="'task.main.add'" medium color="success" @click="showAddTask = true">
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
              <v-menu attach :close-on-content-click="true" transition="scale-transition" left>
                <template v-slot:activator="{ on }">
                  <v-btn small icon v-on="on">
                    <v-icon>
                      more_vert
                    </v-icon>
                  </v-btn>
                </template>
                <task-action-component @task-action="taskActionCommon($event, item)" />
              </v-menu>
            </template>

            <template v-slot:[`item.state`]="{ item }">
              <task-state-component :state="item.state" />
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <task-add-dialog :value.sync="showAddTask" @success="viewmodel.taskAdded" />
    <task-edit-dialog :value.sync="showEditDialog" :task="selectedTask" @success="viewmodel.taskUpdated" />
    <task-retrieve-dialog :value.sync="showRetriveDialog" :task="selectedTask" @success="viewmodel.taskUpdated" />
    <task-extend-dialog :value.sync="showExtendDialog" :task="selectedTask" @success="viewmodel.taskUpdated" />
    <task-assign-dialog :value.sync="showAssignDialog" :task="selectedTask" @success="viewmodel.taskUpdated" />
    <task-approve-dialog :value.sync="showApproveDialog" :task="selectedTask" @success="viewmodel.taskUpdated" />
    <task-return-dialog :value.sync="showReturnDialog" :task="selectedTask" @success="viewmodel.taskUpdated" />
    <task-update-processing-dialog
      :value.sync="showEditStateDialog"
      :task="selectedTask"
      @success="viewmodel.taskUpdated"
    />
    <task-reopen-dialog :value.sync="showReopenDialog" :task="selectedTask" @success="viewmodel.taskUpdated" />
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { TaskModel, TaskRouteType } from '@/models/task-model'
import { Component, Inject, Provide, Vue, Watch } from 'vue-property-decorator'
import { TaskManagerViewModel } from '../viewmodels/task-manager-viewmodel'

@Component({
  components: {
    TaskAddDialog: () => import('../dialogs/task-add-dialog.vue'),
    TaskPrioritySelect: () => import('@/components/autocomplete/task-priority-select.vue'),
    TaskProcessingExpireSelect: () => import('@/components/autocomplete/task-processing-expire-select.vue'),
    TaskSearchComponent: () => import('../components/task-search-component.vue'),
    TaskDetailPage: () => import('./task-detail-page.vue'),
    TaskEditDialog: () => import('../dialogs/task-edit-dialog.vue'),
    TaskRetrieveDialog: () => import('../dialogs/task-retrieve-dialog.vue'),
    TaskExtendDialog: () => import('../dialogs/task-extend-dialog.vue'),
    TaskAssignDialog: () => import('../dialogs/task-assign-dialog.vue'),
    TaskApproveDialog: () => import('../dialogs/task-approve-dialog.vue'),
    TaskReturnDialog: () => import('../dialogs/task-return-dialog.vue'),
    TaskUpdateProcessingDialog: () => import('../dialogs/task-update-processing-dialog.vue'),
    TaskReopenDialog: () => import('../dialogs/task-reopen-dialog.vue'),
    TaskActionComponent: () => import('../components/task-action-component.vue'),
    TaskStateComponent: () => import('../components/task-state-component.vue')
  }
})
export default class TaskManagerPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new TaskManagerViewModel(this.providers)

  showAddTask = false
  showDetailDialog = false
  showEditDialog = false
  showRetriveDialog = false
  showExtendDialog = false
  showAssignDialog = false
  showReturnDialog = false
  showApproveDialog = false
  showEditStateDialog = false
  showReopenDialog = false

  selectedTask: TaskModel = null

  @Watch('$route.params.tasktype', { immediate: true }) onTaskParamChange(val: TaskRouteType) {
    this.viewmodel.loadData(val)
  }

  headers = [
    { text: 'Số/ký hiệu', value: 'code', sortable: false },
    { text: 'Ngày ban hành', value: 'publishedDate', sortable: false },
    { text: 'Trích yếu', value: 'title', sortable: true },
    { text: 'Nội dung nhiệm vụ', value: 'description', sortable: false },
    { text: 'ĐV theo dõi', value: 'supervisorUnit.title', sortable: false },
    { text: 'Trạng thái', value: 'state', sortable: false },
    { text: 'Hạn xử lý', value: 'expireDate', sortable: false },
    { value: 'actions', align: 'right', sortable: false }
  ]

  taskActionCommon(typeAction: any, item: any) {
    switch (typeAction) {
      case 'edit':
        this.showEditDialog = true
        this.selectedTask = item
        break
      case 'retrive':
        this.showRetriveDialog = true
        this.selectedTask = item
        break
      case 'extend':
        this.showExtendDialog = true
        this.selectedTask = item
        break
      case 'return':
        this.showReturnDialog = true
        this.selectedTask = item
        break
      case 'assign':
        this.showAssignDialog = true
        this.selectedTask = item
        break
      case 'approve':
        this.showApproveDialog = true
        this.selectedTask = item
        break
      case 'editState':
        this.showEditStateDialog = true
        this.selectedTask = item
        break
      case 'reOpen':
        this.showReopenDialog = true
        this.selectedTask = item
        break

      default:
        break
    }
  }

  showDetail(item: TaskModel) {
    this.$router.push({ path: '/task/' + item.id })
  }

  search() {
    // this.viewmodel.search(this.searchCode, this.searchtitle, this.searchPriority, this.searchState)
  }
}
</script>

<style scoped></style>

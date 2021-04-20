<template>
  <v-container fluid px-5 py-2>
    <v-row justify="space-between" align="center">
      <v-col cols="8" class="pa-2">
        <div class="text-h6">{{ pageTitle }}</div>
        <breadcrumbs />
      </v-col>
      <v-col cols="4" align="right" class="pa-2">
        <v-btn v-if="$permission('task.main.add')" medium color="success" @click="showAddTask = true">
          <v-icon left>add</v-icon>
          <span>Thêm nhiệm vụ</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table
            class="row-pointer"
            :item-class="row_classes"
            :items="viewmodel.tasks"
            item-key="id"
            @click:row="showDetail"
            :headers="selectedHeaders"
            :server-items-length="viewmodel.totalCount"
            @update:page="viewmodel.search($event)"
            :footer-props="{ itemsPerPageOptions: [25] }"
            mobile-breakpoint="0"
          >
            <template v-slot:top>
              <task-search-component
                title="Danh sách các nhiệm vụ"
                @advance-search="viewmodel.advanceSearch($event)"
                @simple-search="viewmodel.simpleSearch($event)"
              >
                <div>
                  <table-header-setting :headers="headers" @change="selectedHeaders = $event" />
                  <v-btn icon small @click="viewmodel.exportExcel()">
                    <v-icon>more_horiz</v-icon>
                  </v-btn>
                </div>
              </task-search-component>
            </template>

            <template v-slot:[`item.supervisorUnitDep`]="{ item }">
              {{ supervisorUnitDepDisplay(item) }}
            </template>

            <template v-slot:[`item.executedUnitDep`]="{ item }">
              {{ executedUnitDepDisplay(item) }}
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-menu :close-on-content-click="true" transition="scale-transition" left>
                <template v-slot:activator="{ on }">
                  <v-btn small icon v-on="on">
                    <v-icon>
                      more_vert
                    </v-icon>
                  </v-btn>
                </template>
                <task-action-component
                  @task-action="taskActionCommon($event, item)"
                  :task="item"
                  :task-route="$route.params.tasktype"
                />
              </v-menu>
            </template>

            <template v-slot:[`item.state`]="{ item }">
              <task-state-component :state="item.state" />
            </template>
            <template v-slot:[`item.supervisors`]="{ item }">
              {{ item.supervisors.length ? item.supervisors[0].name : '' }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <task-add-dialog :value.sync="showAddTask" @success="viewmodel.taskAdded" />
    <task-edit-dialog :value.sync="showEditDialog" :task="selectedTask" @success="viewmodel.taskUpdated" />
    <task-recover-dialog :value.sync="showRetriveDialog" :task="selectedTask" @success="viewmodel.taskRecovered" />
    <task-extend-dialog :value.sync="showExtendDialog" :task="selectedTask" @success="viewmodel.taskUpdated" />
    <task-assign-dialog :value.sync="showAssignDialog" :task="selectedTask" @success="viewmodel.taskUpdated" />
    <task-approve-dialog :value.sync="showApproveDialog" :task="selectedTask" @success="viewmodel.taskUpdated" />
    <task-return-dialog :value.sync="showReturnDialog" :task="selectedTask" @success="viewmodel.taskReturned" />
    <task-update-state-dialog
      :value.sync="showEditStateDialog"
      :task="selectedTask"
      :isUpdateTask="true"
      @success="viewmodel.taskUpdated"
    />
    <task-update-state-dialog
      :value.sync="showModifyRequest"
      :task="selectedTask"
      :isUpdateTask="false"
      @success="viewmodel.taskUpdated"
    />

    <task-reopen-dialog :value.sync="showReopenDialog" :task="selectedTask" @success="viewmodel.taskUpdated" />
    <task-delete-dialog :value.sync="showDeletingDialog" :task="selectedTask" @success="viewmodel.taskDeleted" />
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { RequestModel } from '@/models/request-model'
import { TaskActionType, TaskModel, taskRouteNameMap, TaskRouteType } from '@/models/task-model'
import _, { maxBy } from 'lodash'
import moment from 'moment'
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
    TaskRecoverDialog: () => import('../dialogs/task-recover-dialog.vue'),
    TaskExtendDialog: () => import('../dialogs/task-extend-dialog.vue'),
    TaskAssignDialog: () => import('../dialogs/task-assign-dialog.vue'),
    TaskApproveDialog: () => import('../dialogs/task-approve-dialog.vue'),
    TaskReturnDialog: () => import('../dialogs/task-return-dialog.vue'),
    TaskUpdateStateDialog: () => import('../dialogs/task-update-state-dialog.vue'),
    TaskReopenDialog: () => import('../dialogs/task-reopen-dialog.vue'),
    TaskActionComponent: () => import('../components/task-action-component.vue'),
    TaskStateComponent: () => import('../components/task-state-component.vue'),
    TaskDeleteDialog: () => import('../dialogs/task-delete-dialog.vue')
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
  showModifyRequest = false
  showReopenDialog = false
  showDeletingDialog = false

  selectedTask: TaskModel = null

  pageTitle = ''

  @Watch('$route.params.tasktype', { immediate: true }) onTaskParamChange(val: TaskRouteType) {
    if (val) {
      this.pageTitle = taskRouteNameMap[val]
      this.viewmodel.changeTaskType(val)
    }
  }

  selectedHeaders: any[] = []
  headers = [
    { text: 'Số/ký hiệu', value: 'code', sortable: false },
    { text: 'Ngày ban hành', value: 'publishedDate', sortable: false },
    { text: 'Trích yếu', value: 'title', sortable: false },
    { text: 'Nội dung nhiệm vụ', value: 'description', sortable: false },
    { text: 'ĐV theo dõi', value: 'supervisorUnitDep', sortable: false },
    { text: 'CV theo dõi', value: 'supervisors', sortable: false, defaultHide: true },
    { text: 'ĐV thực hiện', value: 'executedUnitDep', sortable: false, defaultHide: true },
    { text: 'CV thực hiện', value: 'executedComrade.name', sortable: false },
    { text: 'Hạn xử lý', value: 'expiredDate', sortable: false },
    { text: 'Trạng thái', value: 'state', sortable: false },
    { value: 'actions', align: 'right', sortable: false }
  ]

  taskActionCommon(typeAction: TaskActionType, item: any) {
    switch (typeAction) {
      case 'edit':
        this.showEditDialog = true
        this.selectedTask = item
        break
      case 'revoke':
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
      case 'update':
        this.showEditStateDialog = true
        this.selectedTask = item
        break
      case 'modify-update':
        this.showModifyRequest = true
        this.selectedTask = item
        break
      case 'delete-update':
        this.viewmodel.deleteLastRequest(item)
        break
      case 'reopen':
        this.showReopenDialog = true
        this.selectedTask = item
        break
      case 'delete':
        this.showDeletingDialog = true
        this.selectedTask = item
        break
      default:
        console.warn('taskActionCommon not handle', typeAction)
        break
    }
  }

  showDetail(item: TaskModel) {
    this.$router.push({ path: '/task/' + item.id })
  }

  executedUnitDepDisplay(task: TaskModel) {
    if (_.get(task.executedDepartment, 'title')) return _.get(task.executedDepartment, 'title')
    return _.get(task.executedUnit, 'title')
  }

  supervisorUnitDepDisplay(task: TaskModel) {
    if (_.get(task.supervisorDepartment, 'title')) return _.get(task.supervisorDepartment, 'title')
    return _.get(task.supervisorUnit, 'title')
  }

  row_classes(task: TaskModel) {
    const lastest = maxBy(task.requests, r => moment(_.get(r, 'created_at'))) as RequestModel
    const news = lastest && moment().isBefore(moment(lastest.created_at).add(1, 'day'))
    if (news) return 'blue lighten-4'
  }
}
</script>

<style scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>

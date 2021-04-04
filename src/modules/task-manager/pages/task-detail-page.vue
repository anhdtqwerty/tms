<template>
  <v-container fluid px-5 py-2>
    <v-row v-if="vm.task">
      <v-col cols="12" align="right" class="pa-2">
        <v-menu attach :close-on-content-click="true" transition="scale-transition" left>
          <template v-slot:activator="{ on }">
            <v-btn medium color="success" v-on="on">
              <span>Hành động</span>
              <v-icon right>expand_more</v-icon>
            </v-btn>
          </template>
          <task-action-component @task-action="taskActionCommon" :task="vm.task" />
        </v-menu>
      </v-col>
    </v-row>

    <!-- task parent -->
    <v-row v-if="vm.task">
      <v-col cols="12" md="6" lg="3" class="pa-2">
        <v-card height="100%" class="pa-4">
          <div>
            <v-row>
              <v-col cols="6">
                <div>Số ký hiệu</div>
              </v-col>
              <v-col cols="6">
                <div class="font-weight-bold">{{ vm.task.code }}</div>
              </v-col>
              <v-col cols="6">
                <div>Ngày ban hành</div>
              </v-col>
              <v-col cols="6">
                <div class="font-weight-bold">{{ vm.task.publishedDate | ddmmyyyy }}</div>
              </v-col>
              <v-col cols="6">
                <div>Trích yếu</div>
              </v-col>
              <v-col cols="6">
                <div>
                  <read-more-component :text="vm.task.title" :isBold="true" />
                </div>
              </v-col>
              <v-col cols="6">
                <div>Mức độ</div>
              </v-col>
              <v-col cols="6">
                <div class="font-weight-bold">{{ vm.task.priority | taskPriority }}</div>
              </v-col>
              <v-col cols="6">
                <div>Trạng thái</div>
              </v-col>
              <v-col cols="6">
                <task-state-component :state="vm.task.state" />
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3" class="pa-2">
        <v-card height="100%" class="pa-4">
          <div>
            <v-row>
              <v-col cols="6">
                <div>Văn bản đính kèm</div>
              </v-col>
              <v-col cols="6">
                <v-menu :close-on-content-click="true" transition="scale-transition" left>
                  <template v-slot:activator="{ on }">
                    <div class="blue--text" style="cursor: pointer" v-on="on">Xem</div>
                  </template>
                  <task-files-component
                    :task="vm.task"
                    :requests="vm.task && vm.task.requests"
                    @fileDeleted="vm.fileDeleted($event)"
                  />
                </v-menu>
              </v-col>
              <v-col cols="6">
                <div>Văn bản đến</div>
              </v-col>
              <v-col cols="6">
                <div class="blue--text" style="cursor: pointer" @click="showDocsInfo">Xem</div>
              </v-col>
              <v-col cols="6">
                <div>Thời hạn xử lý</div>
              </v-col>
              <v-col cols="6">
                <div class="font-weight-bold">{{ vm.task.expiredDate | ddmmyyyy }}</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div>Nội dung nhiệm vụ</div>
              </v-col>
              <v-col cols="12">
                <div>
                  <read-more-component :text="vm.task.description" :isBold="true" />
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3" class="pa-2">
        <v-card height="100%" class="pa-4">
          <!-- supervisor -->
          <v-row cols="12">
            <v-col cols="6">
              <div>Theo dõi</div>
            </v-col>
            <v-col cols="6">
              <div v-if="vm.task" class="font-weight-bold">{{ supervisorUnitDepDisplay() }}</div>
            </v-col>
            <v-col cols="6">
              <div>Chuyên viên</div>
            </v-col>
            <v-col cols="6" v-if="!$_empty(vm.task.supervisors)" class="d-flex">
              <app-avatar :avatar="vm.task.supervisors[0].avatar" size="24" />
              <div class="ml-2 font-weight-bold">
                {{ vm.task.supervisors[0].name }}
              </div>
            </v-col>
          </v-row>

          <!-- execute -->
          <v-row cols="12">
            <v-col cols="6">
              <div>Thực hiện</div>
            </v-col>
            <v-col cols="6">
              <div v-if="vm.task" class="font-weight-bold">{{ executedUnitDepDisplay() }}</div>
            </v-col>
            <v-col cols="6">
              <div>Chuyên viên</div>
            </v-col>
            <v-col cols="6" v-if="vm.task.executedComrade" class="d-flex">
              <app-avatar :avatar="vm.task.executedComrade.avatar" size="24" />
              <div class="ml-2 font-weight-bold">{{ vm.task.executedComrade.name }}</div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3" class="pa-2">
        <v-card height="100%" class="pa-4">
          <v-row cols="12">
            <v-col class="font-weight-bold">Tiến độ thực hiện</v-col>
          </v-row>
          <v-row cols="12">
            <v-col cols="6">
              <div>Trạng thái</div>
            </v-col>
            <v-col cols="6">
              <div>
                <task-state-component :state="vm.lastRequest | _get('type')" />
              </div>
            </v-col>
            <v-col cols="6">
              <div>Ngày thực hiện</div>
            </v-col>
            <v-col cols="6">
              <div class="font-weight-bold">{{ vm.lastRequest && vm.lastRequest.startedDate | ddmmyyyy }}</div>
            </v-col>
            <v-col cols="6">
              <div>Diễn giải trạng thái</div>
            </v-col>
            <v-col cols="6">
              <div class="font-weight-bold">{{ vm.lastRequest | _get('description') }}</div>
            </v-col>
            <v-col cols="6">
              <div>File đính kèm</div>
            </v-col>
            <v-col cols="6" class="pa-2">
              <v-menu :close-on-content-click="true" transition="scale-transition" left>
                <template v-slot:activator="{ on }">
                  <div class="blue--text" style="cursor: pointer" v-on="on">Xem</div>
                </template>
                <task-files-component :requests="[vm.lastRequest]" @fileDeleted="vm.fileDeleted($event)" />
              </v-menu>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- child task list -->
    <v-row v-if="$permission('task.sub.read')">
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table
            item-key="id"
            :items="vm.subtasks"
            :headers="selectedHeaders"
            :server-items-length="vm.subtaskTotalCount"
            @update:page="vm.search($event)"
            :footer-props="{ itemsPerPageOptions: [25] }"
            mobile-breakpoint="0"
          >
            <template v-slot:top>
              <task-search-component
                title="Danh sách các nhiệm vụ chia nhỏ"
                @advance-search="vm.advanceSearch($event)"
                @simple-search="vm.simpleSearch($event)"
              >
                <div>
                  <v-btn
                    v-if="$permission('task.sub.add') && vm.task && !vm.task.createdDepartment"
                    small
                    color="success"
                    class="mr-2"
                    @click="showAddSubtask = true"
                  >
                    <v-icon left>add</v-icon>
                    <span>Thêm</span>
                  </v-btn>
                  <table-header-setting :headers="subtaskHeaders" @change="selectedHeaders = $event" />
                  <v-btn icon small @click="vm.exportExcel()">
                    <v-icon>more_horiz</v-icon>
                  </v-btn>
                </div>
              </task-search-component>
            </template>

            <template v-slot:[`item.description`]="{ item }">
              <max-length-text :text="item.description" />
            </template>
            <template v-slot:[`item.executedUnitDep`]="{ item }">
              {{ executedUnitDepSubTask(item) }}
            </template>
            <template v-slot:[`item.supervisorUnitDep`]="{ item }">
              {{ supervisorUnitDepSubTask(item) }}
            </template>
            <template v-slot:[`item.explainState`]="{ item }">
              <max-length-text :text="item.explainState" />
            </template>
            <template v-slot:[`item.state`]="{ item }">
              <task-state-component :state="item.state" />
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <task-sub-action-menu :task="item" @task-action="subTaskAction($event, item)" />
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- processing -->
    <v-row>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table
            item-key="id"
            :items="vm.progressHistory"
            :headers="processingHeaders"
            :footer-props="{ itemsPerPageOptions: [25] }"
            mobile-breakpoint="0"
          >
            <template v-slot:top>
              <v-container fluid class="px-5 py-0">
                <v-row>
                  <v-col cols="12" class="pa-2">
                    <div class="text-h6">Tiến độ thực hiện</div>
                  </v-col>
                </v-row>
              </v-container>
            </template>
            <template v-slot:[`item.description`]="{ item }">
              <max-length-text :text="item.description" />
            </template>
            <template v-slot:[`item.task.description`]="{ item }">
              <max-length-text :text="item.task.description" />
            </template>
            <template v-slot:[`item.type`]="{ item }">
              <task-state-component :state="item.type" />
            </template>
            <template v-slot:[`item.startedDate`]="{ item }">
              {{ item.startedDate | ddmmyyyy }}
            </template>
            <template v-slot:[`item.updated_at`]="{ item }">
              {{ item.updated_at | ddmmyyyy }}
            </template>
            <template v-slot:[`item.attachFile`]="{ item }">
              <v-menu :close-on-content-click="true" transition="scale-transition" left>
                <template v-slot:activator="{ on }">
                  <div class="blue--text" v-on="on" style="cursor: pointer">Xem</div>
                </template>
                <task-files-component :requests="[item]" />
              </v-menu>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- history return -->
    <v-row>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table
            item-key="id"
            :items="vm.returnedHistory"
            :headers="taskReturnHistoryHeaders"
            :footer-props="{ itemsPerPageOptions: [25] }"
            mobile-breakpoint="0"
          >
            <template v-slot:top>
              <v-container fluid class="px-5 py-0">
                <v-row>
                  <v-col cols="12" class="pa-2">
                    <div class="text-h6">Lịch sử trả nhiệm vụ</div>
                  </v-col>
                </v-row>
              </v-container>
            </template>
            <template v-slot:[`item.task.description`]="{ item }">
              <max-length-text :text="item.task.description" />
            </template>
            <template v-slot:[`item.description`]="{ item }">
              <max-length-text :text="item.description" />
            </template>
            <template v-slot:[`item.created_at`]="{ item }">
              {{ item.created_at | ddmmyyyy }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- history extend -->
    <v-row>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table
            item-key="id"
            :items="vm.extendedHistory"
            :headers="taskExtendDateHistoryHeaders"
            :footer-props="{ itemsPerPageOptions: [25] }"
            mobile-breakpoint="0"
          >
            <template v-slot:top>
              <v-container fluid class="px-5 py-0">
                <v-row>
                  <v-col cols="12" class="pa-2">
                    <div class="text-h6">Lịch sử gia hạn nhiệm vụ</div>
                  </v-col>
                </v-row>
              </v-container>
            </template>
            <template v-slot:[`item.task.description`]="{ item }">
              <max-length-text :text="item.task.description" />
            </template>
            <template v-slot:[`item.description`]="{ item }">
              <max-length-text :text="item.description" />
            </template>
            <template v-slot:[`item.created_at`]="{ item }">
              {{ item.created_at | ddmmyyyy }}
            </template>
            <template v-slot:[`item.data.oldExpiredDate`]="{ item }">
              {{ $_get(item, 'data.oldExpiredDate') | ddmmyyyy }}
            </template>
            <template v-slot:[`item.data.newExpiredDate`]="{ item }">
              {{ $_get(item, 'data.newExpiredDate') | ddmmyyyy }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <task-add-dialog :value.sync="showAddSubtask" :taskParent="vm.task" @success="vm.taskAdded" />
    <task-edit-dialog :value.sync="showEditDialog" :task="editingTask" @success="vm.taskUpdated" />
    <task-recover-dialog :value.sync="showRetriveDialog" :task="editingTask" @success="vm.taskRecovered" />
    <task-extend-dialog :value.sync="showExtendDialog" :task="editingTask" @success="vm.taskUpdated" />
    <task-assign-dialog :value.sync="showAssignDialog" :task="editingTask" @success="vm.taskUpdated" />
    <task-approve-dialog :value.sync="showApproveDialog" :task="editingTask" @success="vm.taskUpdated" />
    <task-return-dialog :value.sync="showReturnDialog" :task="editingTask" @success="vm.taskReturned" />
    <task-update-state-dialog
      :value.sync="showEditStateDialog"
      :isUpdateTask="true"
      :task="editingTask"
      @success="vm.taskUpdated"
    />
    <task-update-state-dialog
      :value.sync="showModifyRequest"
      :task="editingTask"
      :isUpdateTask="false"
      @success="vm.taskUpdated"
    />
    <task-reopen-dialog :value.sync="showReopenDialog" :task="editingTask" @success="vm.taskUpdated" />
    <task-delete-dialog :value.sync="showDeletingDialog" :task="editingTask" @success="vm.taskDeleted" />
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Observer } from 'mobx-vue'
import { Component, PropSync, Vue, Provide, Inject, Watch } from 'vue-property-decorator'
import { TaskDetailViewModel } from '../viewmodels/task-detail-viewmodel'
import { TaskActionType, TaskModel } from '@/models/task-model'
import { authStore } from '@/stores/auth-store'
import { UnitModel } from '@/models/unit-model'
import _ from 'lodash'

@Observer
@Component({
  components: {
    TaskAddDialog: () => import('../dialogs/task-add-dialog.vue'),
    TaskSearchComponent: () => import('../components/task-search-component.vue'),
    TaskActionComponent: () => import('../components/task-action-component.vue'),
    TaskSubActionMenu: () => import('../components/task-sub-action-menu.vue'),
    TaskEditDialog: () => import('../dialogs/task-edit-dialog.vue'),
    TaskRecoverDialog: () => import('../dialogs/task-recover-dialog.vue'),
    TaskExtendDialog: () => import('../dialogs/task-extend-dialog.vue'),
    TaskAssignDialog: () => import('../dialogs/task-assign-dialog.vue'),
    TaskApproveDialog: () => import('../dialogs/task-approve-dialog.vue'),
    TaskReturnDialog: () => import('../dialogs/task-return-dialog.vue'),
    TaskUpdateStateDialog: () => import('../dialogs/task-update-state-dialog.vue'),
    TaskReopenDialog: () => import('../dialogs/task-reopen-dialog.vue'),
    AppAvatar: () => import('@/components/images/app-avatar.vue'),
    TaskStateComponent: () => import('../components/task-state-component.vue'),
    TaskDeleteDialog: () => import('../dialogs/task-delete-dialog.vue'),
    TaskFilesComponent: () => import('@/components/files/task-files-component.vue'),
    ReadMoreComponent: () => import('@/components/read-more/read-more-component.vue'),
    MaxLengthText: () => import('@/components/read-more/max-length-text.vue')
  }
})
export default class TaskDetailPage extends Vue {
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Inject() providers!: AppProvider
  @Provide() vm = new TaskDetailViewModel(this.providers)

  showAddSubtask = false
  showEditDialog = false
  showDeletingDialog = false
  showDetailDialog = false
  showRetriveDialog = false
  showExtendDialog = false
  showAssignDialog = false
  showReturnDialog = false
  showApproveDialog = false
  showEditStateDialog = false
  showReopenDialog = false

  editingTask: TaskModel = null

  showModifyRequest = false

  userUnit: UnitModel = authStore.comrade.unit as UnitModel

  @Watch('$route.params.taskid', { immediate: true }) onTaskParamChange(val: any) {
    if (val) {
      this.vm.loadData(val)
    }
  }

  async showReadMore(text: string) {
    await this.providers.alert.info('Chi tiết', text)
  }

  subTaskAction(typeAction: TaskActionType, task: TaskModel) {
    this.editingTask = task
    switch (typeAction) {
      case 'read':
        this.$router.push({ path: '/task/' + task.id })
        break
      case 'edit':
        this.showEditDialog = true
        break
      case 'revoke':
        this.showRetriveDialog = true
        break
      case 'extend':
        this.showExtendDialog = true
        break
      case 'return':
        this.showReturnDialog = true
        break
      case 'assign':
        this.showAssignDialog = true
        break
      case 'approve':
        this.showApproveDialog = true
        break
      case 'update':
        this.showEditStateDialog = true
        break
      case 'modify-update':
        this.showModifyRequest = true
        break
      case 'reopen':
        this.showReopenDialog = true
        break
      case 'delete':
        this.showDeletingDialog = true
        break
      default:
        console.warn('subTaskAction doesnt handle', typeAction)
        break
    }
  }

  taskActionCommon(typeAction: TaskActionType) {
    this.editingTask = this.vm.task
    switch (typeAction) {
      case 'edit':
        this.showEditDialog = true
        break
      case 'revoke':
        this.showRetriveDialog = true
        break
      case 'extend':
        this.showExtendDialog = true
        break
      case 'return':
        this.showReturnDialog = true
        break
      case 'assign':
        this.showAssignDialog = true
        break
      case 'approve':
        this.showApproveDialog = true
        break
      case 'update':
        this.showEditStateDialog = true
        break
      case 'modify-update':
        this.showModifyRequest = true
        break
      case 'delete-update':
        this.vm.deleteLastRequest()
        break
      case 'reopen':
        this.showReopenDialog = true
        break
      case 'delete':
        this.showDeletingDialog = true
        break
      default:
        console.warn('taskActionCommon not handle', typeAction)
        break
    }
  }

  async showDocsInfo() {
    await this.providers.alert.info('Thông tin văn bản đến', this.vm.task.documentInfo)
  }

  executedUnitDepDisplay() {
    if (_.get(this.vm.task, 'executedDepartment.title')) return _.get(this.vm.task, 'executedDepartment.title')
    return _.get(this.vm.task, 'executedUnit.title')
  }

  supervisorUnitDepDisplay() {
    if (_.get(this.vm.task, 'supervisorDepartment.title')) return _.get(this.vm.task, 'supervisorDepartment.title')
    return _.get(this.vm.task, 'supervisorUnit.title')
  }

  executedUnitDepSubTask(task: TaskModel) {
    if (_.get(task.executedDepartment, 'title')) return _.get(task.executedDepartment, 'title')
    return _.get(task.executedUnit, 'title')
  }

  supervisorUnitDepSubTask(task: TaskModel) {
    if (_.get(task.supervisorDepartment, 'title')) return _.get(task.supervisorDepartment, 'title')
    return _.get(task.supervisorUnit, 'title')
  }

  selectedHeaders: any[] = []
  subtaskHeaders = [
    { text: 'Nội dung nhiệm vụ', value: 'description', sortable: false },
    { text: 'Hạn xử lý', value: 'expiredDate', sortable: false },
    { text: 'ĐV thực hiện', value: 'executedUnitDep', sortable: true },
    { text: 'CV thực hiện', value: 'executedComrade.name', sortable: false },
    { text: 'Trạng thái', value: 'state', sortable: false },
    { text: 'Tình hình thực hiện', value: 'explainState', sortable: false },
    { text: 'Số/ký hiệu', value: 'code', sortable: false, defaultHide: true },
    { text: 'Ngày ban hành', value: 'publishedDate', sortable: false, defaultHide: true },
    { text: 'Trích yếu', value: 'title', sortable: true, defaultHide: true },
    { text: 'ĐV theo dõi', value: 'supervisorUnitDep', sortable: false, defaultHide: true },
    { value: 'actions', align: 'right', sortable: false }
  ]

  processingHeaders = [
    { text: 'Ngày cập nhật', value: 'updated_at', sortable: false },
    { text: 'Ngày thực hiện', value: 'startedDate', sortable: false },
    { text: 'Trạng thái', value: 'type', sortable: true },
    { text: 'Diễn giải trạng thái', value: 'description', sortable: false },
    { text: 'Nội dung nhiệm vụ', value: 'task.description', sortable: false },
    { text: 'Người cập nhật', value: 'requestor.name', sortable: false },
    { text: 'File đính kèm', value: 'attachFile', sortable: false }
  ]

  taskReturnHistoryHeaders = [
    { text: 'Nội dung nhiệm vụ', value: 'task.description', sortable: false },
    { text: 'Ngày trả lại', value: 'created_at', sortable: false },
    { text: 'Lý do trả lại', value: 'description', sortable: false },
    { text: 'Đơn vị gửi trả', value: 'metadata.unitTitle', sortable: false },
    { text: 'Người gửi trả', value: 'requestor.name', sortable: false }
  ]

  taskExtendDateHistoryHeaders = [
    { text: 'Nội dung nhiệm vụ', value: 'task.description', sortable: false },
    { text: 'Ngày gia hạn', value: 'created_at', sortable: false },
    { text: 'Hạn xử lý cũ', value: 'data.oldExpiredDate', sortable: false },
    { text: 'Hạn xử lý mới', value: 'data.newExpiredDate', sortable: true },
    { text: 'Lý do gia hạn', value: 'description', sortable: false }
  ]
}
</script>

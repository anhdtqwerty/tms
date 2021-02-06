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
              <v-col cols="6" class="pa-2">
                <div>Số ký hiệu</div>
              </v-col>
              <v-col cols="6" class="pa-2">
                <div class="font-weight-bold">{{ vm.task.code }}</div>
              </v-col>
              <v-col cols="6" class="pa-2">
                <div>Ngày ban hành</div>
              </v-col>
              <v-col cols="6" class="pa-2">
                <div class="font-weight-bold">{{ vm.task.publishedDate | ddmmyyyy }}</div>
              </v-col>
              <v-col cols="6" class="pa-2">
                <div>Trích yếu</div>
              </v-col>
              <v-col cols="6" class="pa-2">
                <div>
                  <v-clamp class="font-weight-bold" autoresize :max-lines="3">
                    {{ vm.task.title }}
                    <template v-slot:after="{ clamped }">
                      <span
                        v-if="clamped"
                        class="blue--text caption"
                        style="cursor: pointer"
                        @click="showReadMore(vm.task.title)"
                      >
                        Xem thêm
                      </span>
                    </template>
                  </v-clamp>
                </div>
              </v-col>
              <v-col cols="6" class="pa-2">
                <div>Mức độ</div>
              </v-col>
              <v-col cols="6" class="pa-2">
                <div class="font-weight-bold">{{ vm.task.priority | taskPriority }}</div>
              </v-col>
              <v-col cols="6" class="pa-2">
                <div>Trạng thái</div>
              </v-col>
              <v-col cols="6" class="pa-2">
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
              <v-col cols="6" class="pa-2">
                <div>Văn bản đính kèm</div>
              </v-col>
              <v-col cols="6" class="pa-2">
                <v-menu :close-on-content-click="true" transition="scale-transition" left>
                  <template v-slot:activator="{ on }">
                    <div class="blue--text" style="cursor: pointer" v-on="on">Xem</div>
                  </template>
                  <task-files-component :container="vm.task" />
                </v-menu>
              </v-col>
              <v-col cols="6" class="pa-2">
                <div>Văn bản đến</div>
              </v-col>
              <v-col cols="6" class="pa-2">
                <div class="blue--text" style="cursor: pointer" @click="showDocsInfo">Xem</div>
              </v-col>
              <v-col cols="6" class="pa-2">
                <div>Thời hạn xử lý</div>
              </v-col>
              <v-col cols="6" class="pa-2">
                <div class="font-weight-bold">{{ vm.task.expiredDate | ddmmyyyy }}</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="pa-2">
                <div>Nội dung nhiệm vụ</div>
              </v-col>
              <v-col cols="12" class="pa-2">
                <div>
                  <v-clamp class="font-weight-bold" autoresize :max-lines="3">
                    {{ vm.task.description }}
                    <template v-slot:after="{ clamped }">
                      <span
                        v-if="clamped"
                        class="blue--text caption"
                        style="cursor: pointer"
                        @click="showReadMore(vm.task.description)"
                      >
                        Xem thêm
                      </span>
                    </template>
                  </v-clamp>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3" class="pa-2">
        <v-card height="100%" class="pa-4">
          <div>
            <v-col cols="12">
              <div>Theo dõi</div>
            </v-col>
            <v-col cols="12">
              <div class="font-weight-bold">{{ vm.task | _get('supervisorUnit.title') }}</div>
            </v-col>
            <v-col cols="12">
              <div>Chuyên viên</div>
            </v-col>
            <v-col cols="12" v-if="!$_empty(vm.task.supervisors)">
              <app-avatar :avatar="vm.task.supervisors[0].avatar" width="80" height="80" />
              <span class="ml-4 font-weight-bold">
                {{ vm.task.supervisors[0].name }}
              </span>
            </v-col>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3" class="pa-2">
        <v-card height="100%" class="pa-4">
          <div>
            <v-col cols="12">
              <div>Thực hiện</div>
            </v-col>
            <v-col cols="12">
              <div class="font-weight-bold">{{ vm.task | _get('executedUnit.title') }}</div>
            </v-col>
            <v-col cols="12">
              <div>Chuyên viên</div>
            </v-col>
            <v-col cols="12" v-if="vm.task.executedComrade">
              <app-avatar :avatar="vm.task.executedComrade.avatar" width="80" height="80" />
              <span class="ml-4 font-weight-bold">{{ vm.task.executedComrade.name }}</span>
            </v-col>
          </div>
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
                title="Danh sách các nhiệm vụ chi nhỏ"
                @advance-search="vm.advanceSearch($event)"
                @simple-search="vm.simpleSearch($event)"
              >
                <div>
                  <table-header-setting :headers="subtaskHeaders" @change="selectedHeaders = $event" />
                  <v-btn icon small @click="vm.exportExcel()">
                    <v-icon>more_horiz</v-icon>
                  </v-btn>
                </div>
              </task-search-component>
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
                  <div class="blue--text" v-on="on">Xem</div>
                </template>
                <task-files-component :container="item" />
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
    <task-recover-dialog :value.sync="showRetriveDialog" :task="vm.task" @success="vm.taskRecovered" />
    <task-extend-dialog :value.sync="showExtendDialog" :task="vm.task" @success="vm.taskUpdated" />
    <task-assign-dialog :value.sync="showAssignDialog" :task="vm.task" @success="vm.taskUpdated" />
    <task-approve-dialog :value.sync="showApproveDialog" :task="vm.task" @success="vm.taskUpdated" />
    <task-return-dialog :value.sync="showReturnDialog" :task="vm.task" @success="vm.taskUpdated" />
    <task-update-state-dialog
      :value.sync="showEditStateDialog"
      :isUpdateTask="true"
      :task="vm.task"
      @success="vm.taskUpdated"
    />
    <task-update-state-dialog
      :value.sync="showModifyRequest"
      :task="vm.task"
      :isUpdateTask="false"
      @success="vm.taskUpdated"
    />
    <task-reopen-dialog :value.sync="showReopenDialog" :task="vm.task" @success="vm.taskUpdated" />
    <task-delete-dialog :value.sync="showDeletingDialog" :task="deletingTask" @success="vm.taskDeleted" />
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Observer } from 'mobx-vue'
import { Component, PropSync, Vue, Provide, Inject, Watch } from 'vue-property-decorator'
import { TaskDetailViewModel } from '../viewmodels/task-detail-viewmodel'
import { TaskActionType, TaskModel } from '@/models/task-model'

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
    VClamp: () => import('vue-clamp')
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

  deletingTask: TaskModel = null
  editingTask: TaskModel = null

  showModifyRequest = false

  @Watch('$route.params.taskid', { immediate: true }) onTaskParamChange(val: any) {
    if (val) {
      this.vm.loadData(val)
    }
  }

  async showReadMore(text: string) {
    await this.providers.alert.info('Chi tiết', text)
  }

  subTaskAction(typeAction: TaskActionType, task: TaskModel) {
    switch (typeAction) {
      case 'edit':
        this.editingTask = task
        this.showEditDialog = true
        break
      case 'delete':
        this.deletingTask = task
        this.showDeletingDialog = true
        break
      case 'read':
        this.$router.push({ path: '/task/' + task.id })
        break
      default:
        console.warn('subTaskAction doesnt handle', typeAction)
        break
    }
  }

  taskActionCommon(typeAction: TaskActionType) {
    switch (typeAction) {
      case 'edit':
        this.showEditDialog = true
        this.editingTask = this.vm.task
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
        this.deletingTask = this.vm.task
        break
      default:
        console.warn('taskActionCommon not handle', typeAction)
        break
    }
  }

  async showDocsInfo() {
    await this.providers.alert.info('Thông tin văn bản đến', this.vm.task.documentInfo)
  }

  selectedHeaders: any[] = []
  subtaskHeaders = [
    { text: 'Nội dung nhiệm vụ', value: 'description', sortable: false },
    { text: 'Hạn xử lý', value: 'expiredDate', sortable: false },
    { text: 'ĐV thực hiện', value: 'supervisorUnit.title', sortable: true },
    { text: 'CV thực hiện', value: 'executedComrade.title', sortable: false },
    { text: 'Trạng thái', value: 'state', sortable: false },
    { text: 'Tình hình thực hiện', value: 'explainState', sortable: false },
    { text: 'Số/ký hiệu', value: 'code', sortable: false, defaultHide: true },
    { text: 'Ngày ban hành', value: 'publishedDate', sortable: false, defaultHide: true },
    { text: 'Trích yếu', value: 'title', sortable: true, defaultHide: true },
    { text: 'ĐV theo dõi', value: 'supervisorUnit.title', sortable: false, defaultHide: true },
    { value: 'actions', align: 'right', sortable: false }
  ]

  processingHeaders = [
    { text: 'Ngày cập nhật', value: 'updated_at', sortable: false },
    { text: 'Ngày thực hiện', value: 'startedDate', sortable: false },
    { text: 'Trạng thái', value: 'type', sortable: true },
    { text: 'Nội dung nhiệm vụ', value: 'task.description', sortable: false },
    { text: 'Người cập nhật', value: 'requestor.name', sortable: false },
    { text: 'File đính kèm', value: 'attachFile', sortable: false }
  ]

  taskReturnHistoryHeaders = [
    { text: 'Nội dung nhiệm vụ', value: 'task.description', sortable: false },
    { text: 'Ngày trả lại', value: 'created_at', sortable: false },
    { text: 'Lý do trả lại', value: 'description', sortable: false },
    { text: 'Đơn vị gửi trả', value: 'requestor.unit.title', sortable: false },
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

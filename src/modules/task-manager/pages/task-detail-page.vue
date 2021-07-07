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
                  <task-files-component :task="vm.task" :requests="vm.requestHistories" @fileDeleted="vm.fileDeleted" />
                </v-menu>
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
          <!-- execute -->
          <v-row cols="12">
            <v-col cols="6">
              <div>Đơn vị thực hiện</div>
            </v-col>
            <v-col cols="6">
              <div v-if="vm.task" class="font-weight-bold">{{ executedUnitDepDisplay() }}</div>
            </v-col>
            <v-col cols="6">
              <div>Chuyên viên thực hiện</div>
            </v-col>
            <v-col cols="6" v-if="vm.task.executedComrade" class="d-flex">
              <app-avatar :avatar="vm.task.executedComrade.avatar" size="24" />
              <div class="ml-2 font-weight-bold">{{ vm.task.executedComrade.name }}</div>
            </v-col>
          </v-row>

          <!-- supported -->
          <v-row cols="12">
            <v-col cols="6">
              <div>Đơn vị phối hợp</div>
            </v-col>
            <v-col cols="6">
              <div v-if="vm.task" class="font-weight-bold">{{ vm.supportedUnitDepDisplay }}</div>
            </v-col>
            <v-col cols="6">
              <div>Chuyên viên phối hợp</div>
            </v-col>
            <v-col cols="6" v-if="!$_empty(vm.task.supportedComrades)">
              <div class="d-flex flex-column">
                <div v-for="comrade in vm.task.supportedComrades" :key="comrade.id" class="d-flex">
                  <app-avatar :avatar="comrade.avatar" size="24" />
                  <div class="ml-2 font-weight-bold">
                    {{ comrade.name }}
                  </div>
                </div>
              </div>
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
              <div>Ngày cập nhật</div>
            </v-col>
            <v-col cols="6">
              <div class="font-weight-bold">{{ vm.lastRequest && vm.lastRequest.updated_at | ddmmyyyy }}</div>
            </v-col>
            <v-col cols="6">
              <div>Tình hình thực hiện</div>
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
                <task-files-component :requests="[vm.lastRequest]" @fileDeleted="vm.fileDeleted" />
              </v-menu>
            </v-col>
          </v-row>
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

    <!-- approvement history -->
    <v-row>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table
            item-key="id"
            :items="vm.approvementHistory"
            :headers="taskApprovementHistoryHeaders"
            :footer-props="{ itemsPerPageOptions: [25] }"
            mobile-breakpoint="0"
          >
            <template v-slot:top>
              <v-container fluid class="px-5 py-0">
                <v-row>
                  <v-col cols="12" class="pa-2">
                    <div class="text-h6">Lịch sử phê duyệt nhiệm vụ</div>
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
            <template v-slot:[`item.type`]="{ item }">
              {{ item.type | taskApprovementStatus }}
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

  processingHeaders = [
    { text: 'Nội dung nhiệm vụ', value: 'task.description', sortable: false },
    { text: 'Ngày cập nhật', value: 'updated_at', sortable: false },
    { text: 'Trạng thái', value: 'type', sortable: true },
    { text: 'Tình hình thực hiện', value: 'description', sortable: false },
    { text: 'Chuyên viên cập nhật', value: 'requestor.name', sortable: false },
    { text: 'File đính kèm', value: 'attachFile', sortable: false }
  ]

  taskReturnHistoryHeaders = [
    { text: 'Nội dung nhiệm vụ', value: 'task.description', sortable: false },
    { text: 'Ngày trả lại', value: 'created_at', sortable: false },
    { text: 'Lý do trả lại', value: 'description', sortable: false },
    {
      text: 'Đơn vị gửi trả',
      value: authStore.unitParams.department ? 'metadata.departmentTitle' : 'metadata.unitTitle',
      sortable: false
    },
    { text: 'Người gửi trả', value: 'requestor.name', sortable: false }
  ]

  taskExtendDateHistoryHeaders = [
    { text: 'Nội dung nhiệm vụ', value: 'task.description', sortable: false },
    { text: 'Ngày gia hạn', value: 'created_at', sortable: false },
    { text: 'Hạn xử lý cũ', value: 'data.oldExpiredDate', sortable: false },
    { text: 'Hạn xử lý mới', value: 'data.newExpiredDate', sortable: false },
    { text: 'Lý do gia hạn', value: 'description', sortable: false }
  ]

  taskApprovementHistoryHeaders = [
    { text: 'Nội dung nhiệm vụ', value: 'task.description', sortable: false },
    { text: 'Ngày phê duyệt', value: 'created_at', sortable: false },
    { text: 'Người phê duyệt', value: 'requestor.name', sortable: false },
    { text: 'Trạng thái phê duyệt', value: 'type', sortable: false },
    { text: 'Lý do', value: 'description', sortable: false },
    { text: 'File đính kèm', value: 'attachFile', sortable: false }
  ]
}
</script>

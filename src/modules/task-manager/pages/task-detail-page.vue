<template>
  <v-container v-if="vm.task" fluid px-5 py-2>
    <v-row>
      <v-col cols="12" align="right" class="pa-2">
        <v-menu attach :close-on-content-click="true" transition="scale-transition" left>
          <template v-slot:activator="{ on }">
            <v-btn medium color="success" v-on="on">
              <span>Hành động</span>
              <v-icon right>expand_more</v-icon>
            </v-btn>
          </template>
          <task-action-component @task-action="taskActionCommon" />
        </v-menu>
      </v-col>
    </v-row>

    <!-- task parent -->
    <v-row>
      <v-col cols="12" sm="3" class="pa-2">
        <v-card height="100%" class="pa-4">
          <div>
            <v-row>
              <v-col cols="12" sm="6">
                <div>Số ký hiệu</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="font-weight-bold">{{ vm.task.code }}</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <div>Ngày ban hành</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="font-weight-bold">{{ vm.task.publishedDate }}</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <div>Trích yếu</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="font-weight-bold">{{ vm.task.title }}</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <div>Mức độ</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="font-weight-bold">{{ vm.task.priority }}</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <div>Trạng thái</div>
              </v-col>
              <v-col cols="12" sm="6">
                <task-state-component :state="vm.task.state" />
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="3" class="pa-2">
        <v-card height="100%" class="pa-4">
          <div>
            <v-row>
              <v-col cols="12" sm="6">
                <div>Văn bản đính kèm</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="blue--text">Xem</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <div>Văn bản đến</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="blue--text">Xem</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <div>Thời hạn xử lý</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="font-weight-bold">{{ vm.task.expiredDate }}</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <div>Nội dung nhiệm vụ</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="font-weight-bold">{{ vm.task.description }}</div>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="3" class="pa-2">
        <v-card height="100%" class="pa-4">
          <div>
            <v-col cols="12">
              <div>Theo dõi</div>
            </v-col>
            <v-col cols="12">
              <div class="font-weight-bold">{{ vm.task.supervisorUnit.title }}</div>
            </v-col>
            <v-col cols="12">
              <div>Chuyên viên</div>
            </v-col>
            <v-col cols="12">
              <app-avatar
                :avatar="vm.task.supervisors && vm.task.supervisors.length && vm.task.supervisors[0]"
                width="80"
                height="80"
              />
              <span class="ml-4 font-weight-bold">{{ vm.task.supervisors[0].name }}</span>
            </v-col>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="3" class="pa-2">
        <v-card height="100%" class="pa-4">
          <div>
            <v-col cols="12">
              <div>Thực hiện</div>
            </v-col>
            <v-col cols="12">
              <div class="font-weight-bold">{{ vm.task.executedUnit.title }}</div>
            </v-col>
            <v-col cols="12">
              <div>Chuyên viên</div>
            </v-col>
            <v-col cols="12">
              <app-avatar :avatar="vm.task.executedComrade && vm.task.executedComrade.avatar" width="80" height="80" />
              <span class="ml-4 font-weight-bold">{{ vm.task.executedComrade.name }}</span>
            </v-col>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- child task list -->
    <v-row>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table
            item-key="id"
            :items="vm.subtasks"
            :headers="subtaskHeaders"
            :footer-props="{ itemsPerPageOptions: [25] }"
            mobile-breakpoint="0"
          >
            <template v-slot:top>
              <task-search-component title="Danh sách các nhiệm vụ chia nhỏ">
                <div>
                  <v-btn medium color="success" class="mr-8" @click="showAddSubtask = true">
                    <v-icon left>add</v-icon>
                    <span>Thêm</span>
                  </v-btn>
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
              <task-sub-action-menu :task="item.task" />
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
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <task-add-dialog :value.sync="showAddSubtask" :taskParent="vm.task" @success="vm.taskAdded" />
    <task-edit-dialog :value.sync="showEditDialog" :task="vm.task" @success="vm.taskUpdated" />
    <task-retrieve-dialog :value.sync="showRetriveDialog" :task="vm.task" @success="vm.taskUpdated" />
    <task-extend-dialog :value.sync="showExtendDialog" :task="vm.task" @success="vm.taskUpdated" />
    <task-assign-dialog :value.sync="showAssignDialog" :task="vm.task" @success="vm.taskUpdated" />
    <task-approve-dialog :value.sync="showApproveDialog" :task="vm.task" @success="vm.taskUpdated" />
    <task-return-dialog :value.sync="showReturnDialog" :task="vm.task" @success="vm.taskUpdated" />
    <task-update-processing-dialog :value.sync="showEditStateDialog" :task="vm.task" @success="vm.taskUpdated" />
    <task-reopen-dialog :value.sync="showReopenDialog" :task="vm.task" @success="vm.taskUpdated" />
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Observer } from 'mobx-vue'
import { Component, PropSync, Vue, Provide, Inject } from 'vue-property-decorator'
import { TaskDetailViewModel } from '../viewmodels/task-detail-viewmodel'

@Observer
@Component({
  components: {
    TaskAddDialog: () => import('../dialogs/task-add-dialog.vue'),
    TaskSearchComponent: () => import('../components/task-search-component.vue'),
    TaskActionComponent: () => import('../components/task-action-component.vue'),
    TaskSubActionMenu: () => import('../dialogs/task-sub-action-menu.vue'),
    TaskEditDialog: () => import('../dialogs/task-edit-dialog.vue'),
    TaskRetrieveDialog: () => import('../dialogs/task-retrieve-dialog.vue'),
    TaskExtendDialog: () => import('../dialogs/task-extend-dialog.vue'),
    TaskAssignDialog: () => import('../dialogs/task-assign-dialog.vue'),
    TaskApproveDialog: () => import('../dialogs/task-approve-dialog.vue'),
    TaskReturnDialog: () => import('../dialogs/task-return-dialog.vue'),
    TaskUpdateProcessingDialog: () => import('../dialogs/task-update-processing-dialog.vue'),
    TaskReopenDialog: () => import('../dialogs/task-reopen-dialog.vue'),
    AppAvatar: () => import('@/components/images/app-avatar.vue'),
    TaskStateComponent: () => import('../components/task-state-component.vue')
  }
})
export default class TaskDetailPage extends Vue {
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Inject() providers!: AppProvider
  @Provide() vm = new TaskDetailViewModel(this.providers)

  showAddSubtask = false
  showEditDialog = false
  showDetailDialog = false
  showRetriveDialog = false
  showExtendDialog = false
  showAssignDialog = false
  showReturnDialog = false
  showApproveDialog = false
  showEditStateDialog = false
  showReopenDialog = false

  taskActionCommon(typeAction: string) {
    switch (typeAction) {
      case 'edit':
        this.showEditDialog = true
        break
      case 'retrive':
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
      case 'editState':
        this.showEditStateDialog = true
        break
      case 'reOpen':
        this.showReopenDialog = true
        break

      default:
        break
    }
  }

  subtaskHeaders = [
    { text: 'Nội dung nhiệm vụ', value: 'description', sortable: false },
    { text: 'Hạn xử lý', value: 'expireDate', sortable: false },
    { text: 'ĐV thực hiện', value: 'supervisorUnit.title', sortable: true },
    { text: 'CV thực hiện', value: 'executeStaff', sortable: false },
    { text: 'Trạng thái', value: 'state', sortable: false },
    { text: 'Tình hình thực hiện', value: 'data.updateProcessing', sortable: false },
    { value: 'actions', align: 'right', sortable: false }
  ]

  processingHeaders = [
    { text: 'Ngày cập nhật', value: 'updateDate', sortable: false },
    { text: 'Ngày thực hiện', value: 'executeDate', sortable: false },
    { text: 'Trạng thái', value: 'status', sortable: true },
    { text: 'Nội dung nhiệm vụ', value: 'descriptionTask', sortable: false },
    { text: 'Người cập nhật', value: 'updator', sortable: false },
    { text: 'File đính kèm', value: 'attachFile', sortable: false }
  ]

  taskReturnHistoryHeaders = [
    { text: 'Nội dung nhiệm vụ', value: 'descriptionTask', sortable: false },
    { text: 'Ngày trả lại', value: 'returnDate', sortable: false },
    { text: 'Lý do trả lại', value: 'returnReason', sortable: false },
    { text: 'Nội dung', value: 'description', sortable: true },
    { text: 'Đơn vị gửi trả', value: 'returnUnit', sortable: false },
    { text: 'Người gửi trả', value: 'returner', sortable: false }
  ]

  taskExtendDateHistoryHeaders = [
    { text: 'Nội dung nhiệm vụ', value: 'descriptionTask', sortable: false },
    { text: 'Ngày gia hạn', value: 'extendDate', sortable: false },
    { text: 'Hạn xử lý cũ', value: 'oldExpireDate', sortable: false },
    { text: 'Hạn xử lý mới', value: 'newExpireDate', sortable: true },
    { text: 'Lý do gia hạn', value: 'extendReason', sortable: false }
  ]
}
</script>

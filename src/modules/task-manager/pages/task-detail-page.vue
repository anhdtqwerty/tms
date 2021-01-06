<template>
  <v-dialog :fullscreen="true" v-model="syncedValue" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>QUẢN LÝ NHIỆM VỤ GIAO</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container style="overflow-y: auto" fluid px-5 py-2>
        <v-row>
          <v-col cols="12" align="right" class="pa-2">
            <v-btn medium color="success">
              <span>Hành động</span>
              <v-icon right>expand_more</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="3" class="pa-2">
            <v-card height="100%" class="pa-4">
              <div>
                <v-row>
                  <v-col cols="12" sm="6">
                    <div>Số ký hiệu</div>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="font-weight-bold">26BTP-VPCP</div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6">
                    <div>Ngày ban hành</div>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="font-weight-bold">01/01/2021</div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6">
                    <div>Trích yếu</div>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="font-weight-bold">26BTP-VPCP</div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6">
                    <div>Mức độ</div>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="font-weight-bold">Quan trọng</div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6">
                    <div>Trạng thái</div>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <!-- <v-btn color="primary"> -->
                    <div>Đang thực hiện</div>
                    <!-- </v-btn> -->
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
                    <div class="font-weight-bold">01/01/2021</div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6">
                    <div>Nội dung nhiệm vụ</div>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="font-weight-bold">abc xyz</div>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="3" class="pa-2">
            <v-card height="100%" class="pa-4">
              <div>
                <div>Theo dõi</div>
                <div class="font-weight-bold">Vụ kế hoạch và đầu tư</div>
                <div>Chuyên viên</div>
                <div>Lâm Chấn Khang</div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="3" class="pa-2">
            <v-card height="100%" class="pa-4">
              <div>
                <div>Thực hiện</div>
                <div class="font-weight-bold">Vụ kế hoạch và đầu tư</div>
                <div>Chuyên viên</div>
                <div>Lâm Chấn Khang</div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <task-search-component title="Danh sách các nhiệm vụ chia nhỏ">
            <div>
              <v-btn medium color="success" class="mr-8">
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
        </v-row>
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
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator'
@Component({
  components: {
    TaskSearchComponent: () => import('../components/task-search-component.vue')
  }
})
export default class TaskDetailManagerPage extends Vue {
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean

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

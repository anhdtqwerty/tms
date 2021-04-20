<template>
  <v-container fluid px-5 py-2>
    <v-row>
      <v-col cols="12" class="pa-2">
        <div class="text-h6">Phòng ban</div>
        <breadcrumbs />
      </v-col>
    </v-row>
    <v-row v-if="viewmodel.department">
      <v-col cols="12" class="pa-2">
        <div class="intro-background pa-4">
          <div class="intro-wrap px-5 py-2">
            <v-row>
              <v-col cols="12" class="d-flex justify-space-between pa-2">
                <div class="text-h5 font-weight-medium primary--text">{{ viewmodel.department.title }}</div>
                <v-btn v-if="$permission('system.unit.edit')" icon small @click="showEditDialog = true">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" class="pa-2">
                <div class="font-weight-medium">
                  <div>Mã đơn vị: {{ viewmodel.department.code }}</div>
                  <div>Điện thoại: {{ viewmodel.department.phone }}</div>
                  <div>Địa chỉ: {{ viewmodel.department | _get('data.address') }}</div>
                  <div>Email: {{ viewmodel.department.email }}</div>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="pa-2">
                <div class="d-flex flex-column pa-4" style="border: 1px solid #1E88E5">
                  <span class="font-weight-medium">Mô tả chức năng nhiệm vụ</span>
                  <span class="mt-4">{{ viewmodel.department.description }} </span>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table :items="viewmodel.comrades" item-key="id" :headers="userHeaders" mobile-breakpoint="0">
            <template v-slot:top>
              <v-container fluid class="px-5 py-2">
                <v-row>
                  <v-col cols="12" class="pa-2 d-flex justify-space-between">
                    <div class="text-subtitle-1 font-weight-medium">Danh sách cán bộ công nhân viên</div>
                    <v-btn
                      v-if="$permission('system.unit.edit')"
                      color="primary"
                      small
                      @click="showAddUserDialog = true"
                      ><v-icon left>add</v-icon>Thêm</v-btn
                    >
                  </v-col>
                </v-row>
              </v-container>
            </template>
            <template v-slot:[`item.name`]="{ item }">
              <text-link :to="`/user/${item.id}`">
                {{ item.name }}
              </text-link>
            </template>
            <template v-slot:[`item.user.blocked`]="{ item }">
              <v-chip v-if="item.user" :color="item.user.blocked ? 'red' : 'green'" text-color="white">
                {{ item.user.blocked ? 'Blocked' : 'Hoạt động' }}
              </v-chip>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon v-if="$permission('system.unit.edit')" small @click="viewmodel.deleteComrade(item)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <user-add-dialog
      :value.sync="showAddUserDialog"
      :department="viewmodel.department"
      @success="viewmodel.comradeAdded"
    />
    <department-edit-dialog
      :value.sync="showEditDialog"
      :department="viewmodel.department"
      @success="viewmodel.departmentUpdated"
    />
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Observer } from 'mobx-vue'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { DepartmentDetailViewModel } from '../viewmodels/department-detail-viewmodel'

@Observer
@Component({
  components: {
    UserAddDialog: () => import('../dialogs/user-add-dialog.vue'),
    DepartmentEditDialog: () => import('../dialogs/department-edit-dialog.vue')
  }
})
export default class DepartmentDetailPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new DepartmentDetailViewModel(this.providers)

  showAddUserDialog = false
  showEditDialog = false

  userHeaders = [
    { text: 'Họ và Tên', value: 'name', sortable: false },
    { text: 'Mã cán bộ', value: 'code', sortable: false },
    { text: 'Tên truy cập', value: 'user.username', sortable: false },
    { text: 'Trạng Thái', value: 'user.blocked', sortable: false },
    { text: 'Chức vụ', value: 'data.title', sortable: false },
    { text: 'Email', value: 'user.email', sortable: false },
    { text: 'Xóa', value: 'actions', sortable: false }
  ]
}
</script>

<style scoped lang="scss">
.intro-background {
  background: url('../../../assets/ministry_cover.png') no-repeat center center;
  background-size: cover;
}
.intro-wrap {
  background-color: rgba($color: #fff, $alpha: 0.65);
}
</style>

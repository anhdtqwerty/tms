<template>
  <v-container fluid px-5 py-2>
    <v-row>
      <v-col cols="12" class="pa-2">
        <div class="text-h6">Đơn vị</div>
        <breadcrumbs />
      </v-col>
    </v-row>
    <v-row v-if="viewmodel.unit">
      <v-col cols="12" class="pa-2">
        <div class="intro-background pa-4">
          <div class="intro-wrap px-5 py-2">
            <v-row>
              <v-col cols="12" class="d-flex justify-space-between pa-2">
                <div class="text-h5 font-weight-medium primary--text">{{ viewmodel.unit.title }}</div>
                <v-btn v-if="$permission('system.unit.edit')" icon small @click="showEditUnit = true">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" class="pa-2">
                <div class="font-weight-medium">
                  <div>Mã đơn vị: {{ viewmodel.unit.code }}</div>
                  <div>Điện thoại: {{ viewmodel.unit.phone }}</div>
                  <div>Email: {{ viewmodel.unit.email }}</div>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="pa-2">
                <div class="d-flex flex-column pa-4" style="border: 1px solid #1E88E5">
                  <span class="font-weight-medium">Mô tả chức năng nhiệm vụ</span>
                  <span class="mt-4">{{ viewmodel.unit.description }} </span>
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
          <v-data-table
            :items="viewmodel.departments"
            item-key="id"
            :headers="departmentHeaders"
            :footer-props="{ itemsPerPageOptions: [25] }"
            mobile-breakpoint="0"
          >
            <template v-slot:top>
              <v-container fluid class="px-5 py-2">
                <v-row>
                  <v-col cols="12" class="pa-2 d-flex justify-space-between">
                    <div class="text-subtitle-1 font-weight-medium">Danh sách phòng ban trực thuộc</div>
                    <v-btn
                      v-if="$permission('system.unit.add')"
                      color="primary"
                      small
                      @click="showAddDepartment = true"
                    >
                      <v-icon left>add</v-icon>Thêm
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </template>
            <template v-slot:[`item.title`]="{ item }">
              <text-link :to="`/department/${item.id}`">
                {{ item.title }}
              </text-link>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon v-if="$permission('system.unit.edit')" small class="mr-2" @click="editDepartment(item)">
                mdi-pencil
              </v-icon>
              <v-icon v-if="$permission('system.unit.delete')" small @click="viewmodel.deleteDepartment(item)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <unit-edit-dialog :value.sync="showEditUnit" :unit="viewmodel.unit" @success="viewmodel.unitUpdated" />
    <department-add-dialog
      :value.sync="showAddDepartment"
      :unit="viewmodel.unit"
      @success="viewmodel.departmentAdded"
    />
    <department-edit-dialog
      :value.sync="showEditDepartment"
      :department="edtingDepartment"
      :unit="viewmodel.unit"
      @success="viewmodel.departmentUpdated"
    />
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { DepartmentModel } from '@/models/department-model'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { UnitDetailViewModel } from '../viewmodels/unit-detail-viewmodel'

@Component({
  components: {
    UnitEditDialog: () => import('../dialogs/unit-edit-dialog.vue'),
    DepartmentAddDialog: () => import('../dialogs/department-add-dialog.vue'),
    DepartmentEditDialog: () => import('../dialogs/department-edit-dialog.vue')
  }
})
export default class UnitDetailPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new UnitDetailViewModel(this.providers)

  showEditUnit = false
  showAddDepartment = false
  showEditDepartment = false
  edtingDepartment: DepartmentModel = null

  departmentHeaders = [
    { text: 'Tên phòng ban', value: 'title', sortable: false },
    { text: 'Mã phòng ban', value: 'code', sortable: false },
    { text: 'Số điện thoại', value: 'phone', sortable: false },
    { text: 'Email', value: 'email', sortable: true },
    { text: 'Mô tả', value: 'description', sortable: false },
    { value: 'actions', sortable: false, align: 'right' }
  ]

  // userHeaders = [
  //   { text: 'Họ và Tên', value: 'name', sortable: false },
  //   { text: 'Mã cán bộ', value: 'id', sortable: false },
  //   { text: 'Tên truy cập', value: 'username', sortable: true },
  //   { text: 'Trạng Thái', value: 'status', sortable: false },
  //   { text: 'Phòng ban', value: 'department', sortable: true },
  //   { text: 'Chức vụ', value: 'position', sortable: true },
  //   { text: 'Email', value: 'email', sortable: false },
  //   { text: 'Xóa', value: 'actions', sortable: false }
  // ]

  // users = [{ name: 'unit 1', id: 'unit1', email: 'unit1@unit.com', phone: '091231231' }]

  editDepartment(item: DepartmentModel) {
    this.edtingDepartment = item
    this.showEditDepartment = true
  }
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

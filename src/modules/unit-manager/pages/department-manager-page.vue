<template>
  <v-container fluid px-5 py-2>
    <v-row justify="space-between" align="center">
      <v-col cols="8" class="pa-2">
        <div class="text-h6">Phòng ban</div>
        <breadcrumbs />
      </v-col>
      <v-col cols="4" align="right" class="pa-2">
        <v-btn v-if="$permission('system.unit.add')" medium color="success" @click="showAddDialog = true">
          <v-icon left>add</v-icon>
          <span>Thêm phòng ban</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table
            :items="viewmodel.departments"
            item-key="id"
            :headers="headers"
            :footer-props="{ itemsPerPageOptions: [25] }"
            mobile-breakpoint="0"
          >
            <template v-slot:top>
              <v-container fluid class="px-5 py-0">
                <v-row>
                  <v-col cols="12" align="end" class="pa-2">
                    <v-btn icon small>
                      <v-icon>settings</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12" class="d-none d-sm-flex pa-2 align-center">
                    <app-text-field class="mr-4" hide-details v-model="searchName" label="Tên phòng ban" />
                    <app-text-field class="mr-4" hide-details v-model="searchParentUnit" label="Đơn vị cha" />
                    <app-text-field class="mr-4" hide-details v-model="searchCode" label="Mã phòng ban" />
                    <v-btn depressed color="primary" medium @click="search">
                      <span class="d-none d-md-flex">Tìm kiếm</span>
                      <v-icon dark>search</v-icon>
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

            <template v-slot:[`item.role.name`]="{ item }">
              <div class="staff-department">{{ item.department.title }}</div>
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
    <department-add-dialog :value.sync="showAddDialog" @success="viewmodel.departmentAdded" />
    <department-edit-dialog
      :value.sync="showEditDialog"
      :department="editingDepartment"
      @success="viewmodel.departmentUpdated"
    />
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { DepartmentModel } from '@/models/department-model'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { DepartmentManagerViewModel } from '../viewmodels/department-manager-viewmodel'

@Component({
  components: {
    DepartmentAddDialog: () => import('../dialogs/department-add-dialog.vue'),
    DepartmentEditDialog: () => import('../dialogs/department-edit-dialog.vue')
  }
})
export default class DepartmentManagerPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new DepartmentManagerViewModel(this.providers)

  searchName = ''
  searchCode = ''
  searchParentUnit = ''

  showAddUserDialog = false
  showAddDialog = false
  showEditDialog = false
  editingDepartment: DepartmentModel = null

  headers = [
    { text: 'Tên phòng ban', value: 'title', sortable: false },
    { text: 'Đơn vị cha', value: 'unit.title', sortable: false },
    { text: 'Mã phòng', value: 'code', sortable: false },
    { text: 'Email phòng', value: 'email', sortable: true },
    { text: 'SĐT phỏng', value: 'phone', sortable: false },
    { text: 'Địa chỉ', value: 'data.address', sortable: false },
    { text: 'Mô tả', value: 'description', sortable: false },
    { value: 'actions', align: 'right', sortable: false }
  ]

  editDepartment(item: DepartmentModel) {
    this.editingDepartment = item
    this.showEditDialog = true
  }

  search() {
    this.viewmodel.search(this.searchName, this.searchParentUnit, this.searchCode)
  }
}
</script>

<style scoped></style>

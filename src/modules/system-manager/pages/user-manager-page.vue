<template>
  <v-container fluid px-5 py-2>
    <v-row justify="space-between" align="center">
      <v-col cols="8" class="pa-2">
        <div class="text-h6">Người dùng</div>
        <breadcrumbs />
      </v-col>
      <v-col cols="4" align="right" class="pa-2">
        <v-btn medium color="success" @click="showAddUser = true">
          <v-icon left>add</v-icon>
          <span>Thêm mới user</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table :items="viewmodel.comrades" item-key="id" :headers="headers" mobile-breakpoint="0">
            <template v-slot:top>
              <v-container fluid class="px-5 py-0">
                <v-row>
                  <v-col cols="12" align="end" class="pa-2">
                    <v-btn icon x-small>
                      <v-icon>settings</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12" class="d-none d-sm-flex pa-2 align-center">
                    <app-text-field class="mr-4" hide-details v-model="searchName" label="Mã cán bộ" />
                    <app-text-field class="mr-4" hide-details v-model="searchCode" label="Họ và tên" />
                    <department-autocomplete
                      class="mr-4"
                      hide-details
                      :value.sync="searchDepartment"
                      label="Phòng ban"
                      :unitRequired="false"
                    />
                    <userstatus-select class="mr-4" hide-details label="Trạng thái" />
                    <v-btn depressed color="primary" medium @click="search">
                      <span class="d-none d-md-flex">Tìm kiếm</span>
                      <v-icon dark>search</v-icon>
                    </v-btn>
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
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <user-add-dialog :value.sync="showAddUser" @success="viewmodel.comradeAdded" />
  </v-container>
</template>

<script lang="ts">
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { AppProvider } from '@/app-provider'
import { UserManagerViewModel } from '../viewmodels/user-manager-viewmodel'

@Component({
  components: {
    UserAddDialog: () => import('../dialogs/user-add-dialog.vue'),
    UserstatusSelect: () => import('@/components/autocomplete/userstatus-select.vue'),
    DepartmentAutocomplete: () => import('@/components/autocomplete/department-autocomplete.vue')
  }
})
export default class UserMangerPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new UserManagerViewModel(this.providers)

  searchName = ''
  searchCode = ''
  searchDepartment: string = null
  searchStatus = false

  showAddUser = false
  username = ''
  headers = [
    { text: 'Mã cán bộ', value: 'code', sortable: false },
    { text: 'Họ và Tên', value: 'name', sortable: false },
    { text: 'Tên truy cập', value: 'user.username', sortable: true },
    { text: 'Trạng Thái', value: 'user.blocked', sortable: false },
    { text: 'Phòng ban', value: 'department.title', sortable: true },
    { text: 'Chức vị', value: 'position.title', sortable: true },
    { text: 'Email', value: 'user.email', sortable: false },
    {
      text: 'Số Điện Thoại',
      value: 'phone',
      align: 'left',
      sortable: false
    }
    // { value: 'actions', show: true }
  ]

  search() {
    this.viewmodel.search(this.searchCode, this.searchName, this.searchDepartment, this.searchStatus)
  }
}
</script>

<style scoped></style>

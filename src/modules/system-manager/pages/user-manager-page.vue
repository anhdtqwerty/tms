<template>
  <v-container fluid px-5 py-2>
    <v-row justify="space-between" align="center">
      <v-col cols="8" class="pa-2">
        <div class="text-h6">Người dùng</div>
        <breadcrumbs />
      </v-col>
      <v-col cols="4" align="right" class="pa-2">
        <v-btn v-if="$permission('system.user.add')" medium color="success" @click="showAddUser = true">
          <v-icon left>add</v-icon>
          <span>Thêm mới user</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table
            :items="viewmodel.comrades"
            item-key="id"
            :headers="selectedHeaders"
            mobile-breakpoint="0"
            :server-items-length="viewmodel.totalCount"
            @update:page="viewmodel.searchPage($event)"
            :footer-props="{ itemsPerPageOptions: [25] }"
          >
            <template v-slot:top>
              <v-container fluid class="px-5 py-0">
                <v-row>
                  <v-col cols="12" align="end" class="pa-2">
                    <table-header-setting :headers="headers" @change="selectedHeaders = $event" />
                  </v-col>
                  <v-col cols="12" class="d-none d-sm-flex pa-2 align-center">
                    <app-text-field class="mr-4" hide-details v-model="searchCode" label="Mã cán bộ" />
                    <app-text-field class="mr-4" hide-details v-model="searchName" label="Họ và tên" />
                    <department-autocomplete
                      class="mr-4"
                      hide-details
                      :value.sync="searchDepartment"
                      label="Phòng ban"
                      :unitRequired="false"
                    />
                    <userstatus-select class="mr-4" hide-details label="Trạng thái" :value.sync="searchStatus" />
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
            <template v-slot:[`item.data.bod`]="{ item }">
              {{ item.data.bod | ddmmyyyy }}
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
  selectedHeaders: any[] = []
  headers = [
    { text: 'Mã cán bộ', value: 'code', sortable: false },
    { text: 'Họ và Tên', value: 'name', sortable: false },
    { text: 'Trạng Thái', value: 'user.blocked', sortable: false },
    { text: 'Ngày sinh', value: 'data.bod', sortable: true, defaultHide: true },
    { text: 'Tên truy cập', value: 'user.username', sortable: true },
    { text: 'Phòng ban', value: 'department.title', sortable: true },
    { text: 'Chức vụ', value: 'data.title', sortable: true },
    { text: 'Email', value: 'user.email', sortable: false },
    {
      text: 'Số Điện Thoại',
      value: 'phone',
      align: 'left',
      sortable: false,
      defaultHide: true
    }
  ]

  search() {
    this.viewmodel.search(this.searchCode, this.searchName, this.searchDepartment, this.searchStatus)
  }
}
</script>

<style scoped></style>

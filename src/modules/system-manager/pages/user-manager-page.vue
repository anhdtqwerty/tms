<template>
  <v-container>
    <v-row class="mx-2" justify="space-between" align="center">
      <v-col cols="8" class="md-6 px-0 py-2">
        <h2>Người dùng</h2>
        <breadcrumbs />
      </v-col>

      <v-col cols="4" class="text-right md-6 px-0">
        <v-btn medium color="success">
          <v-icon left>add</v-icon>
          <span>Thêm mới user</span>
        </v-btn>
      </v-col>
    </v-row>

    <v-card class="px-md-6 py-md-2 px-2 mx-md-2">
      <v-data-table :items="viewmodel.users" item-key="id" :headers="headers" class="mt-3" mobile-breakpoint="0">
        <template v-slot:top>
          <v-row> </v-row>
        </template>

        <!-- <template v-slot:[`item.name`]="{ item }">
          <user-item :data="item"></user-item>
        </template> -->

        <template v-slot:[`item.role.name`]="{ item }">
          <div class="staff-department">{{ item.department.title }}</div>
        </template>

        <!-- <template v-slot:[`item.status`]="{ item }">
          <v-chip :color="getColor(item.status)" dark>{{ item.status }}</v-chip>
        </template> -->

        <!-- <template v-slot:[`item.actions`]="{ item }">
          <staff-list-actions :item="item"></staff-list-actions>
        </template> -->
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import Breadcrumbs from '@/router/breadcumbs.vue'
import { UserModel } from '@/models/auth-model'
import { AppProvider } from '@/app-provider'
import { UserManagerViewModel } from '../viewmodels/user-manager-viewmodel'

@Component({
  components: {
    Breadcrumbs
  }
})
export default class UserMangerPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new UserManagerViewModel(this.providers)

  headers = [
    { text: 'Mã cán bộ', value: 'id', align: 'left', sortable: false },
    { text: 'Họ và Tên', value: 'name', align: 'left', sortable: false },
    { text: 'Tên truy cập', value: 'username', align: 'left', sortable: true },
    { text: 'Trạng Thái', value: 'status', align: 'left', sortable: false },
    { text: 'Phòng ban', value: 'department', align: 'left', sortable: true },
    { text: 'Chức vị', value: 'position', align: 'left', sortable: true },
    { text: 'Email', value: 'email', align: 'left', sortable: false },
    {
      text: 'Số Điện Thoại',
      value: 'phone',
      align: 'left',
      sortable: false
    }
    // { value: 'actions', show: true }
  ]

  refresh() {
    //
  }
}
</script>

<style scoped></style>

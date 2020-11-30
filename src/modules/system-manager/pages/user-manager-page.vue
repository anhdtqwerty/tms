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
          <v-data-table :items="viewmodel.users" item-key="id" :headers="headers" mobile-breakpoint="0">
            <template v-slot:top>
              <v-container fluid class="px-5 py-0">
                <v-row>
                  <v-col cols="12" align="end" class="pa-2">
                    <v-btn icon x-small>
                      <v-icon>settings</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12" class="d-none d-sm-flex pa-2 align-center">
                    <v-text-field class="mr-4" hide-details dense outlined v-model="username" label="Mã cán bộ" />
                    <v-text-field class="mr-4" hide-details dense outlined v-model="username" label="Mã cán bộ" />
                    <v-text-field class="mr-4" hide-details dense outlined v-model="username" label="Mã cán bộ" />
                    <v-text-field class="mr-4" hide-details dense outlined v-model="username" label="Mã cán bộ" />
                    <v-btn depressed color="primary" medium>
                      <span class="d-none d-md-flex">Tìm kiếm</span>
                      <v-icon dark>search</v-icon>
                    </v-btn>
                  </v-col>
                  <!-- <v-col class="pa-2"><v-text-field dense outlined v-model="username" label="Mã cán bộ"/></v-col>
                  <v-col class="pa-2"><v-text-field dense outlined v-model="username" label="Mã cán bộ"/></v-col>
                  <v-col class="pa-2"><v-text-field dense outlined v-model="username" label="Mã cán bộ"/></v-col>
                  <v-col class="pa-2"><v-text-field dense outlined v-model="username" label="Mã cán bộ"/></v-col>
                  <v-col class="pa-2" align="end">
                    <v-btn class="px-2" depressed color="primary" medium>
                      <span>Tìm kiếm</span>
                      <v-icon dark>search</v-icon>
                    </v-btn>
                  </v-col> -->
                </v-row>
              </v-container>
            </template>
            <template v-slot:[`item.name`]="{ item }">
              <router-link :to="`/user/${item.id}`">
                {{ item.name }}
              </router-link>
            </template>

            <template v-slot:[`item.role.name`]="{ item }">
              <div class="staff-department">{{ item.department.title }}</div>
            </template>
          </v-data-table>
        </v-card>
      </v-col></v-row
    >
    <user-add-dialog :value="showAddUser" @update:value="showAddUser = $event" />
  </v-container>
</template>

<script lang="ts">
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { AppProvider } from '@/app-provider'
import { UserManagerViewModel } from '../viewmodels/user-manager-viewmodel'

@Component({
  components: {
    UserAddDialog: () => import('../dialogs/user-add-dialog.vue')
  }
})
export default class UserMangerPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new UserManagerViewModel(this.providers)

  showAddUser = false

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

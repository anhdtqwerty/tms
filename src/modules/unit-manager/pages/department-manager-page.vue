<template>
  <v-container fluid px-5 py-2>
    <v-row justify="space-between" align="center">
      <v-col cols="8" class="pa-2">
        <div class="text-h6">Phòng ban</div>
        <breadcrumbs />
      </v-col>
      <v-col cols="4" align="right" class="pa-2">
        <v-btn medium color="success" @click="showAddDialog = true">
          <v-icon left>add</v-icon>
          <span>Thêm phòng ban</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table :items="items" item-key="id" :headers="headers" mobile-breakpoint="0">
            <template v-slot:top>
              <v-container fluid class="px-5 py-0">
                <v-row>
                  <v-col cols="12" align="end" class="pa-2">
                    <v-btn icon x-small>
                      <v-icon>settings</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12" class="d-none d-sm-flex pa-2 align-center">
                    <v-text-field class="mr-4" hide-details dense outlined v-model="username" label="Tên đơn vị" />
                    <v-text-field class="mr-4" hide-details dense outlined v-model="username" label="Đơn vị cha" />
                    <v-text-field class="mr-4" hide-details dense outlined v-model="username" label="Mã đơn vị" />
                    <v-btn depressed color="primary" medium>
                      <span class="d-none d-md-flex">Tìm kiếm</span>
                      <v-icon dark>search</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </template>
            <template v-slot:[`item.name`]="{ item }">
              <router-link :to="`/department/${item.code}`">
                {{ item.name }}
              </router-link>
            </template>

            <template v-slot:[`item.role.name`]="{ item }">
              <div class="staff-department">{{ item.department.title }}</div>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="showEditDialog = true">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteUnit(item)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <department-add-dialog :value.sync="showAddDialog" />
    <department-edit-dialog :value.sync="showEditDialog" />
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
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

  name = ''
  username = ''

  showAddDialog = false
  showEditDialog = false

  headers = [
    { text: 'Tên phòng ban', value: 'name', align: 'left', sortable: false },
    { text: 'Đơn vị cha', value: 'parent', align: 'left', sortable: false },
    { text: 'Mã phòng', value: 'code', align: 'left', sortable: false },
    { text: 'Email phòng', value: 'email', align: 'left', sortable: true },
    { text: 'SĐT phỏng', value: 'phone', align: 'left', sortable: false },
    { text: 'Mô tả', value: 'description', align: 'left', sortable: false },
    { value: 'actions', show: true, sortable: false }
  ]

  items = [
    {
      name: 'dep 1',
      parent: 'don vi cha',
      code: 'dep1',
      email: 'dep1@dep.com',
      phone: '091231231',
      description: 'dep1 dep1 dep1'
    }
  ]

  async deleteUnit() {
    // const ok = await this.providers.alert.confirm(
    //   'XÁC NHẬN XÓA',
    //   'Bạn có Chắc Chắn muốn xóa Nhân viên này? Bạn sẽ không thể hoàn tác thao tác.'
    // )
    // console.log(ok)
  }
}
</script>

<style scoped></style>

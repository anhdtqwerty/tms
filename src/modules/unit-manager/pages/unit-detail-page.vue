<template>
  <v-container fluid px-5 py-2>
    <v-row>
      <v-col cols="12" class="pa-2">
        <div class="text-h6">Đơn vị</div>
        <breadcrumbs />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table :items="departments" item-key="id" :headers="departmentHeaders" mobile-breakpoint="0">
            <template v-slot:top>
              <v-container fluid class="px-5 py-2">
                <v-row>
                  <v-col cols="12" class="pa-2 d-flex justify-space-between">
                    <div class="text-subtitle-1 font-weight-medium">Danh sách phòng ban trực thuộc</div>
                    <v-btn color="primary" small> <v-icon left>add</v-icon>Thêm </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small @click="item">
                mdi-pencil
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table :items="users" item-key="id" :headers="userHeaders" mobile-breakpoint="0">
            <template v-slot:top>
              <v-container fluid class="px-5 py-2">
                <v-row>
                  <v-col cols="12" class="pa-2 d-flex justify-space-between">
                    <div class="text-subtitle-1 font-weight-medium">Danh sách cán bộ công nhân viên</div>
                    <v-btn color="primary" small><v-icon left>add</v-icon>Thêm</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small @click="item">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class UnitDetailPage extends Vue {
  departmentHeaders = [
    { text: 'Tên phòng ban', value: 'name', align: 'left', sortable: false },
    { text: 'Mã phòng ban', value: 'code', align: 'left', sortable: false },
    { text: 'Số điện thoại', value: 'phone', align: 'left', sortable: false },
    { text: 'Email', value: 'email', align: 'left', sortable: true },
    { text: 'Mô tả', value: 'description', align: 'left', sortable: false },
    { value: 'actions', sortable: false }
  ]

  userHeaders = [
    { text: 'Họ và Tên', value: 'name', align: 'left', sortable: false },
    { text: 'Mã cán bộ', value: 'id', align: 'left', sortable: false },
    { text: 'Tên truy cập', value: 'username', align: 'left', sortable: true },
    { text: 'Trạng Thái', value: 'status', align: 'left', sortable: false },
    { text: 'Phòng ban', value: 'department', align: 'left', sortable: true },
    { text: 'Chức vụ', value: 'position', align: 'left', sortable: true },
    { text: 'Email', value: 'email', align: 'left', sortable: false },
    { text: 'Xóa', value: 'actions', sortable: false }
  ]

  departments = [
    { name: 'unit 1', code: 'unit1', email: 'unit1@unit.com', phone: '091231231', description: 'unit1 unit1 unit' }
  ]

  users = [{ name: 'unit 1', id: 'unit1', email: 'unit1@unit.com', phone: '091231231' }]
}
</script>

<style scoped></style>

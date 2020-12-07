<template>
  <v-dialog scrollable max-width="1200" v-model="syncedValue">
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>THÊM MỚI VAI TRÒ</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form ref="form" style="overflow-y: auto">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12" class="pa-2">
              <div class="text-subtitle-2 pb-4">Thông tin vai trò</div>
              <app-text-field v-model="name" label="Tên vai trò" />
              <app-textarea v-model="username" label="Mô tả" counter="5000" />
            </v-col>
            <v-col cols="12" class="pa-2">
              <div class="text-subtitle-2 pb-4">Hiển thị phân quyền</div>
              <v-data-table
                :items="configs.task"
                item-key="type"
                :headers="taskHeaders"
                mobile-breakpoint="0"
                hide-default-footer
                fixed-header
              >
                <template v-slot:[`item.config.full`]="{ item }">
                  <v-simple-checkbox v-model="item.config.full"></v-simple-checkbox>
                </template>
                <template v-slot:[`item.config.read`]="{ item }">
                  <v-simple-checkbox v-model="item.config.read"></v-simple-checkbox>
                </template>
                <template v-slot:[`item.config.add`]="{ item }">
                  <v-simple-checkbox v-model="item.config.add"></v-simple-checkbox>
                </template>
                <template v-slot:[`item.config.edit`]="{ item }">
                  <v-simple-checkbox v-model="item.config.edit"></v-simple-checkbox>
                </template>
                <template v-slot:[`item.config.delete`]="{ item }">
                  <v-simple-checkbox v-model="item.config.delete"></v-simple-checkbox>
                </template>
                <template v-slot:[`item.config.revoke`]="{ item }">
                  <v-simple-checkbox v-model="item.config.revoke"></v-simple-checkbox>
                </template>
                <template v-slot:[`item.config.assign`]="{ item }">
                  <v-simple-checkbox v-model="item.config.assign"></v-simple-checkbox>
                </template>
                <template v-slot:[`item.config.extend`]="{ item }">
                  <v-simple-checkbox v-model="item.config.extend"></v-simple-checkbox>
                </template>
                <template v-slot:[`item.config.return`]="{ item }">
                  <v-simple-checkbox v-model="item.config.return"></v-simple-checkbox>
                </template>
                <template v-slot:[`item.config.update`]="{ item }">
                  <v-simple-checkbox v-model="item.config.update"></v-simple-checkbox>
                </template>
                <template v-slot:[`item.config.reopen`]="{ item }">
                  <v-simple-checkbox v-model="item.config.reopen"></v-simple-checkbox>
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="12" md="7" class="pa-2">
              <v-data-table
                :items="configs.system"
                item-key="type"
                :headers="systemHeaders"
                mobile-breakpoint="0"
                hide-default-footer
                fixed-header
              >
                <template v-slot:[`item.config.full`]="{ item }">
                  <v-simple-checkbox v-model="item.config.full"></v-simple-checkbox>
                </template>
                <template v-slot:[`item.config.read`]="{ item }">
                  <v-simple-checkbox v-model="item.config.read"></v-simple-checkbox>
                </template>
                <template v-slot:[`item.config.add`]="{ item }">
                  <v-simple-checkbox
                    v-model="item.config.add"
                    :disabled="item.config.add === undefined"
                  ></v-simple-checkbox>
                </template>
                <template v-slot:[`item.config.edit`]="{ item }">
                  <v-simple-checkbox
                    v-model="item.config.edit"
                    :disabled="item.config.edit === undefined"
                  ></v-simple-checkbox>
                </template>
                <template v-slot:[`item.config.delete`]="{ item }">
                  <v-simple-checkbox
                    v-model="item.config.delete"
                    :disabled="item.config.delete === undefined"
                  ></v-simple-checkbox>
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="12" md="5" class="pa-2">
              <v-data-table
                :items="configs.report"
                item-key="type"
                :headers="reportHeaders"
                mobile-breakpoint="0"
                hide-default-footer
                fixed-header
              >
                <template v-slot:[`item.config.full`]="{ item }">
                  <v-simple-checkbox v-model="item.config.full"></v-simple-checkbox>
                </template>
                <template v-slot:[`item.config.read`]="{ item }">
                  <v-simple-checkbox v-model="item.config.read"></v-simple-checkbox>
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="12" class="pa-2" align="end">
              <v-btn depressed color="primary" medium @click="save">
                <span>Hoàn thành</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { generatePermissionConfigs } from '@/models/position-model'
import { Component, PropSync, Vue } from 'vue-property-decorator'

@Component
export default class RoleAddDialog extends Vue {
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean

  name = ''
  username = ''
  configs = generatePermissionConfigs()

  taskHeaders = [
    { text: 'Quản lý nhiệm vụ', value: 'name', sortable: false, class: 'grey lighten-4', width: '165' },
    { text: 'Toàn quyền', value: 'config.full', sortable: false, class: 'grey lighten-4', width: '90' },
    { text: 'Xem', value: 'config.read', sortable: false, class: 'grey lighten-4', width: '90' },
    { text: 'Thêm', value: 'config.add', sortable: false, class: 'grey lighten-4', width: '90' },
    { text: 'Sửa', value: 'config.edit', sortable: false, class: 'grey lighten-4', width: '90' },
    { text: 'Xóa', value: 'config.delete', sortable: false, class: 'grey lighten-4', width: '90' },
    { text: 'Thu hồi', value: 'config.revoke', sortable: false, class: 'grey lighten-4', width: '90' },
    { text: 'Giao thực hiện', value: 'config.assign', sortable: false, class: 'grey lighten-4', width: '90' },
    { text: 'Gia hạn', value: 'config.extend', sortable: false, class: 'grey lighten-4', width: '90' },
    { text: 'Trả lại', value: 'config.return', sortable: false, class: 'grey lighten-4', width: '90' },
    { text: 'Cập nhật', value: 'config.update', sortable: false, class: 'grey lighten-4', width: '90' },
    { text: 'Mở lại NVu', value: 'config.reopen', sortable: false, class: 'grey lighten-4', width: '90' }
  ]

  systemHeaders = [
    { text: 'Quản trị hệ thống', value: 'name', sortable: false, class: 'grey lighten-4', width: '165' },
    { text: 'Toàn quyền', value: 'config.full', sortable: false, class: 'grey lighten-4', width: '90' },
    { text: 'Xem', value: 'config.read', sortable: false, class: 'grey lighten-4', width: '90' },
    { text: 'Thêm', value: 'config.add', sortable: false, class: 'grey lighten-4', width: '90' },
    { text: 'Sửa', value: 'config.edit', sortable: false, class: 'grey lighten-4', width: '90' },
    { text: 'Xóa', value: 'config.delete', sortable: false, class: 'grey lighten-4', width: '90' }
  ]

  reportHeaders = [
    { text: 'Quản trị hệ thống', value: 'name', sortable: false, class: 'grey lighten-4', width: '165' },
    { text: 'Toàn quyền', value: 'config.full', sortable: false, class: 'grey lighten-4', width: '90' },
    { text: 'Xem', value: 'config.read', sortable: false, class: 'grey lighten-4', width: '90' }
  ]

  save() {
    //
  }
}
</script>

<style scoped>
.tablelayout {
  table-layout: fixed;
}
</style>

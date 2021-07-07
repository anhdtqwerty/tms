<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="1264" scrollable v-model="syncedValue">
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0" fixed>
        <v-toolbar-title>CẬP NHẬT VAI TRÒ</v-toolbar-title>
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
              <app-text-field v-model="name" :rules="$appRules.roleName" label="Tên vai trò" />
              <app-textarea v-model="description" :rules="$appRules.roleDescription" label="Mô tả" counter="5000" />
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
                class="mytable"
              >
                <template v-slot:[`item.name`]="{ item }">
                  <div class="font-weight-medium">{{ item.name }}</div>
                </template>
                <template v-slot:[`item.config.viewAll`]="{ item }">
                  <v-simple-checkbox :ripple="false" v-model="item.config.viewAll" />
                </template>
                <template v-slot:[`item.config.full`]="{ item }">
                  <v-simple-checkbox :ripple="false" v-model="item.config.full" />
                </template>
                <template v-slot:[`item.config.read`]="{ item }">
                  <v-simple-checkbox :ripple="false" v-model="item.config.read" />
                </template>
                <template v-slot:[`item.config.add`]="{ item }">
                  <v-simple-checkbox :ripple="false" v-model="item.config.add" />
                </template>
                <template v-slot:[`item.config.edit`]="{ item }">
                  <v-simple-checkbox :ripple="false" v-model="item.config.edit" />
                </template>
                <template v-slot:[`item.config.delete`]="{ item }">
                  <v-simple-checkbox :ripple="false" v-model="item.config.delete" />
                </template>
                <template v-slot:[`item.config.revoke`]="{ item }">
                  <v-simple-checkbox :ripple="false" v-model="item.config.revoke" />
                </template>
                <template v-slot:[`item.config.assign`]="{ item }">
                  <v-simple-checkbox :ripple="false" v-model="item.config.assign" />
                </template>
                <template v-slot:[`item.config.extend`]="{ item }">
                  <v-simple-checkbox :ripple="false" v-model="item.config.extend" />
                </template>
                <template v-slot:[`item.config.return`]="{ item }">
                  <v-simple-checkbox :ripple="false" v-model="item.config.return" />
                </template>
                <template v-slot:[`item.config.update`]="{ item }">
                  <v-simple-checkbox :ripple="false" v-model="item.config.update" />
                </template>
                <template v-slot:[`item.config.reopen`]="{ item }">
                  <v-simple-checkbox :ripple="false" v-model="item.config.reopen" />
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
                <template v-slot:[`item.name`]="{ item }">
                  <div class="font-weight-medium">{{ item.name }}</div>
                </template>
                <template v-slot:[`item.config.full`]="{ item }">
                  <v-simple-checkbox :ripple="false" v-model="item.config.full" />
                </template>
                <template v-slot:[`item.config.read`]="{ item }">
                  <v-simple-checkbox :ripple="false" v-model="item.config.read" />
                </template>
                <template v-slot:[`item.config.add`]="{ item }">
                  <v-simple-checkbox
                    :ripple="false"
                    v-model="item.config.add"
                    :disabled="item.config.add === undefined"
                  />
                </template>
                <template v-slot:[`item.config.edit`]="{ item }">
                  <v-simple-checkbox
                    :ripple="false"
                    v-model="item.config.edit"
                    :disabled="item.config.edit === undefined"
                  />
                </template>
                <template v-slot:[`item.config.delete`]="{ item }">
                  <v-simple-checkbox
                    :ripple="false"
                    v-model="item.config.delete"
                    :disabled="item.config.delete === undefined"
                  />
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
                <template v-slot:[`item.name`]="{ item }">
                  <div class="font-weight-medium">{{ item.name }}</div>
                </template>
                <template v-slot:[`item.config.full`]="{ item }">
                  <v-simple-checkbox :ripple="false" v-model="item.config.full" />
                </template>
                <template v-slot:[`item.config.read`]="{ item }">
                  <v-simple-checkbox :ripple="false" v-model="item.config.read" />
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="12" class="pa-2 d-flex justify-end">
              <v-btn depressed class="mr-4" medium @click="cancel">
                <span>Hủy</span>
              </v-btn>
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
import { AppProvider } from '@/app-provider'
import { generatePermissionConfigs, PositionModel, PositionType, toPositionConfig } from '@/models/position-model'
import { Component, Inject, Prop, PropSync, Ref, Vue, Watch } from 'vue-property-decorator'

@Component
export default class RoleEditDialog extends Vue {
  @Inject() providers!: AppProvider

  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Prop() role: PositionModel
  @Prop() type!: PositionType

  @Ref('form') form: any

  name = ''
  description = ''
  configs = generatePermissionConfigs()

  taskHeaders = [
    { text: 'Quản lý nhiệm vụ', value: 'name', sortable: false, class: 'grey lighten-4', width: '165' },
    {
      text: 'Xem tất cả nhiệm vụ',
      value: 'config.viewAll',
      sortable: false,
      class: 'grey lighten-4 px-2',
      align: 'center',
      width: '90'
    },
    {
      text: 'Toàn quyền',
      value: 'config.full',
      sortable: false,
      class: 'grey lighten-4 px-2',
      align: 'center',
      width: '90'
    },
    { text: 'Xem', value: 'config.read', sortable: false, class: 'grey lighten-4 px-2', align: 'center', width: '90' },
    { text: 'Thêm', value: 'config.add', sortable: false, class: 'grey lighten-4 px-2', align: 'center', width: '90' },
    { text: 'Sửa', value: 'config.edit', sortable: false, class: 'grey lighten-4 px-2', align: 'center', width: '90' },
    {
      text: 'Xóa',
      value: 'config.delete',
      sortable: false,
      class: 'grey lighten-4 px-2',
      align: 'center',
      width: '90'
    },
    {
      text: 'Thu hồi',
      value: 'config.revoke',
      sortable: false,
      class: 'grey lighten-4 px-2',
      align: 'center',
      width: '90'
    },
    {
      text: 'Giao thực hiện',
      value: 'config.assign',
      sortable: false,
      class: 'grey lighten-4 px-2',
      align: 'center',
      width: '90'
    },
    {
      text: 'Gia hạn',
      value: 'config.extend',
      sortable: false,
      class: 'grey lighten-4 px-2',
      align: 'center',
      width: '90'
    },
    {
      text: 'Trả lại',
      value: 'config.return',
      sortable: false,
      class: 'grey lighten-4 px-2',
      align: 'center',
      width: '90'
    },
    {
      text: 'Cập nhật',
      value: 'config.update',
      sortable: false,
      class: 'grey lighten-4 px-2',
      align: 'center',
      width: '90'
    },
    {
      text: 'Mở lại NVu',
      value: 'config.reopen',
      sortable: false,
      class: 'grey lighten-4 px-2',
      align: 'center',
      width: '90'
    }
  ]

  systemHeaders = [
    {
      text: 'Quản trị hệ thống',
      value: 'name',
      sortable: false,
      class: 'grey lighten-4',
      width: '165'
    },
    {
      text: 'Toàn quyền',
      value: 'config.full',
      sortable: false,
      class: 'grey lighten-4 px-2',
      align: 'center',
      width: '90'
    },
    { text: 'Xem', value: 'config.read', sortable: false, class: 'grey lighten-4 px-2', align: 'center', width: '90' },
    { text: 'Thêm', value: 'config.add', sortable: false, class: 'grey lighten-4 px-2', align: 'center', width: '90' },
    { text: 'Sửa', value: 'config.edit', sortable: false, class: 'grey lighten-4 px-2', align: 'center', width: '90' },
    { text: 'Xóa', value: 'config.delete', sortable: false, class: 'grey lighten-4 px-2', align: 'center', width: '90' }
  ]

  reportHeaders = [
    {
      text: 'Quản trị hệ thống',
      value: 'name',
      sortable: false,
      class: 'grey lighten-4',
      width: '165'
    },
    {
      text: 'Toàn quyền',
      value: 'config.full',
      sortable: false,
      class: 'grey lighten-4',
      width: '90'
    },
    { text: 'Xem', value: 'config.read', sortable: false, class: 'grey lighten-4 px-2', align: 'center', width: '90' }
  ]

  @Watch('value', { immediate: true }) onValueChanged(val: string) {
    if (val && this.role) {
      this.name = this.role.title
      this.description = this.role.description
      this.configs = generatePermissionConfigs(this.role.config)
    }
  }

  cancel() {
    this.syncedValue = false
    this.form.reset()
  }

  async save() {
    if (this.form.validate()) {
      try {
        const position = await this.providers.api.position.update(this.role.id, {
          title: this.name,
          description: this.description,
          type: this.type,
          config: toPositionConfig(this.configs)
        })
        this.$emit('success', position)
        this.syncedValue = false
        this.form.reset()
        this.providers.snackbar.updateSuccess()
      } catch (error) {
        this.providers.snackbar.commonError(error)
      }
    }
  }
}
</script>

<style scoped></style>

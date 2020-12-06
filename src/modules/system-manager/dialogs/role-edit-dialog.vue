<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="1264" scrollable v-model="syncedValue">
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0" fixed>
        <v-toolbar-title>EDIT</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pa-0">
        <v-form ref="form">
          <v-container fluid px-5 py-2>
            <v-row>
              <v-col cols="12" sm="6" class="pa-2">
                <div class="text-subtitle-2 pb-6">Thông tin vài trò</div>
                <app-text-field v-model="name" label="Tên vai trò" />
                <app-textarea v-model="username" label="Mô tả" counter="5000" />
              </v-col>
              <v-col cols="6" class="d-none d-sm-flex" />
              <v-col cols="12" class="pa-2">
                <div class="text-subtitle-2 pb-6">Hiển thị phân quyền</div>
              </v-col>
              <v-col cols="12" sm="6" class="px-2 py-0" v-for="config in mergedRoleConfigs" :key="config.name">
                <v-checkbox v-model="config.allow" :label="config.name" hide-details></v-checkbox>
              </v-col>
              <v-col cols="12" class="pa-2" align="end">
                <v-btn depressed color="primary" medium @click="save">
                  <span>Hoàn thành</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator'

interface RoleConfigModel {
  allow?: boolean
  name: string
}

@Component
export default class RoleEditDialog extends Vue {
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean

  name = ''
  username = ''

  leftRoleConfigs: RoleConfigModel[] = [
    {
      name: 'Nhận nhiệm vụ được giao Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    },
    {
      name: 'Cho phép tạo nhiệm vụ mới Lorem ipsum dolor sit amet, consectetur adipiscing elit,'
    },
    {
      name: 'Cho phép tạo nhiệm vụ mới Lorem ipsum dolor sit amet, consectetur adipiscing elit,'
    },
    {
      name: 'Cho phép kiểm tra quá trình thực hiện nhiệm vụ Lorem ipsum dolor sit amet, consectetur'
    },
    {
      name: 'Cho phép cập nhật/chỉnh sửa thông tin nhiệm vụ Lorem ipsum dolor sit amet, consectetur'
    },
    {
      name: 'Cho phép phân chia nhiệm vụ cho đơn vị cấp dưới Lorem ipsum dolor sit amet, consectetur'
    },
    {
      name: 'Cho phép phân chia nhiệm vụ cho đơn vị cấp dưới Lorem ipsum dolor sit amet, consectetur'
    }
  ]

  rightRoleConfigs: RoleConfigModel[] = [
    {
      name: 'Cho phép theo dõi quá trình thực hiện nhiệm vụ Lorem ipsum dolor sit amet, consectetur'
    },
    {
      name: 'Cho phép thêm/sửa/xóa cá nhân trong dự án Lorem ipsum dolor sit amet'
    },
    {
      name: 'Cho phép thêm/sửa/xóa cá nhân trong dự án Lorem ipsum dolor sit amet'
    },
    {
      name: 'Cho phép thêm/sửa/xóa cá nhân trong dự án Lorem ipsum dolor sit amet'
    },
    {
      name: 'Cho phép thêm/sửa/xóa cá nhân trong dự án Lorem ipsum dolor sit amet'
    },
    {
      name: 'Cho phép kiểm tra kết quả thực hiện nhiệm vụ Lorem ipsum dolor sit amet'
    },
    {
      name: 'Báo cáo kết quả xử lý  Lorem ipsum dolor sit amet, consectetur'
    }
  ]

  mergedRoleConfigs: RoleConfigModel[] = []

  constructor() {
    super()
    const left = [...this.leftRoleConfigs]
    const right = [...this.rightRoleConfigs]
    const index = 0
    while (left.length > 0 || right.length > 0) {
      if (index % 2 === 0) {
        this.mergedRoleConfigs.push(left.length > 0 ? left.shift() : right.shift())
      } else {
        this.mergedRoleConfigs.push(right.length > 0 ? right.shift() : left.shift())
      }
    }
  }

  save() {
    //
  }
}
</script>

<style scoped></style>

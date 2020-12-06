<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="884" v-model="syncedValue">
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>THÊM MỚI USER</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form ref="form">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12" sm="6">
              <div class="text-subtitle-2 pb-6">Thông tin người dùng</div>
              <app-text-field v-model="name" label="Họ và Tên" />
              <app-text-field v-model="username" label="Mã cán bộ" />
              <app-text-field v-model="phone" label="Ngày sinh" />
              <app-text-field v-model="email" label="Email" validate-on-blur />
              <app-text-field v-model="email" label="Số điện thoại" validate-on-blur />
              <div class="d-flex justify-space-between">
                <div class="text-body-2">Người dùng hoạt động</div>
                <v-switch class="ma-0" />
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="text-subtitle-2 pb-6">Thông tin đăng nhập</div>
              <app-text-field v-model="name" label="Tên truy cập" />
              <app-text-field
                label="Mật Khẩu"
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :type="showPassword ? 'text' : 'password'"
                outlinedd
              />
              <div class="text-subtitle-2 py-6">Phòng ban Đơn vị</div>
              <app-text-field v-model="username" label="Đơn vị" />
              <app-text-field v-model="phone" label="Phòng ban" />
              <app-text-field v-model="email" label="Chức vụ" />
            </v-col>
            <v-col cols="12" align="end">
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
import { Component, Inject, PropSync, Vue } from 'vue-property-decorator'

@Component
export default class UserAddDialog extends Vue {
  @Inject() providers: AppProvider

  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean

  showPassword = false
  name = ''
  username = ''
  password = ''
  email = ''
  phone = ''

  async save() {
    const ok = await this.providers.alert.confirm('Hêllo', 'message')
    console.log(ok)
  }
}
</script>

<style scoped></style>

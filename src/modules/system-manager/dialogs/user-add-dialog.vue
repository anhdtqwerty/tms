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
              <v-text-field dense outlined v-model="name" label="Họ và Tên"></v-text-field>
              <v-text-field dense outlined v-model="username" label="Mã cán bộ"></v-text-field>
              <v-text-field dense outlined v-model="phone" label="Ngày sinh"></v-text-field>
              <v-text-field dense outlined v-model="email" label="Email" validate-on-blur></v-text-field>
              <v-text-field dense outlined v-model="email" label="Số điện thoại" validate-on-blur></v-text-field>
              <div class="d-flex justify-space-between">
                <div class="text-body-2">Người dùng hoạt động</div>
                <v-switch class="ma-0" />
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="text-subtitle-2 pb-6">Thông tin đăng nhập</div>
              <v-text-field dense outlined v-model="name" label="Tên truy cập"></v-text-field>
              <v-text-field
                dense
                outlined
                label="Mật Khẩu"
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :type="showPassword ? 'text' : 'password'"
                outlinedd
              />
              <div class="text-subtitle-2 py-6">Phòng ban Đơn vị</div>
              <v-text-field dense outlined v-model="username" label="Đơn vị"></v-text-field>
              <v-text-field dense outlined v-model="phone" label="Phòng ban"></v-text-field>
              <v-text-field dense outlined v-model="email" label="Chức vụ"></v-text-field>
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
import { Component, PropSync, Vue } from 'vue-property-decorator'

@Component
export default class UserAddDialog extends Vue {
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean

  showPassword = false
  name = ''
  username = ''
  password = ''
  email = ''
  phone = ''

  save() {
    //
  }
}
</script>

<style scoped></style>

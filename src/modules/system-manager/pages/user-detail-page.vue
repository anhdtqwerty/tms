<template>
  <v-container fluid px-5 py-0>
    <v-row justify="space-between" align="center">
      <v-col class="pa-2">
        <div class="text-h6">Người dùng</div>
        <breadcrumbs />
        <v-card class="mt-4">
          <v-form>
            <v-row>
              <v-col class="px-8">
                <div class="d-flex align-center">
                  <v-avatar height="100" width="100">
                    <v-img src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460" />
                  </v-avatar>
                  <div class="ml-4">
                    <div class="text-h6">Bùi Đắc Huy</div>
                    <div class="text-body-2">Admin</div>
                  </div>
                </div>
                <div class="text-subtitle-2 py-4">Thông tin người dùng</div>
                <v-text-field dense outlined v-model="name" label="Họ và Tên"></v-text-field>
                <v-text-field dense outlined v-model="username" label="Mã cán bộ"></v-text-field>
                <v-text-field dense outlined v-model="phone" label="Ngày sinh"></v-text-field>
                <v-text-field dense outlined v-model="email" label="Email" validate-on-blur></v-text-field>
                <v-text-field dense outlined v-model="email" label="Số điện thoại" validate-on-blur></v-text-field>
                <div class="d-flex">
                  <div class="text-body-2 mt-2">Người dùng hoạt động</div>
                  <v-switch class="mt-0 ml-4" />
                </div>
              </v-col>
              <v-col class="px-8">
                <div class="text-subtitle-2 pb-4">Thông tin đăng nhập</div>
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
                <v-text-field dense outlined v-model="name" label="Vai trò khi truy cập"></v-text-field>
                <div class="text-subtitle-2 pb-4">Phòng ban Đơn vị</div>
                <v-text-field dense outlined v-model="username" label="Mã cán bộ"></v-text-field>
                <v-text-field dense outlined v-model="username" label="Đơn vị"></v-text-field>
                <v-text-field dense outlined v-model="phone" label="Phòng ban"></v-text-field>
                <v-text-field dense outlined v-model="email" label="Chức vụ"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <div class="d-flex justify-end pb-5 pr-5">
            <v-btn depressed @click="save" class="px-5">
              <span>Hủy</span>
            </v-btn>
            <v-btn depressed color="primary" @click="save" class="ml-4 px-5">
              <span>Lưu</span>
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class UserDetailPage extends Vue {
  showPassword = false
  name = ''
  username = ''
  password = ''
  email = ''
  phone = ''
}
</script>

<style scoped></style>

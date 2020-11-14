<template>
  <div align="start" class="mx-sm-4 px-sm-4 mx-md-10 px-md-10 xs-screen">
    <v-form ref="form">
      <div
        class="text-h3 text--darken-1 amber--text font-weight-bold pb-4 text-center"
      >
        Đăng nhập
      </div>
      <v-text-field
        label="Tài Khoản"
        name="login"
        prepend-icon="person"
        v-model="credentials.identifier"
        :rules="[$rules.required, $rules.minLength(4)]"
        validate-on-blur
        @keyup.enter="submit"
        type="text"
      />

      <v-text-field
        label="Mật Khẩu"
        v-model="credentials.password"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        :type="showPassword ? 'text' : 'password'"
        :rules="[$rules.required, $rules.minLength(4)]"
        validate-on-blur
        @keyup.enter="submit"
        prepend-inner-icon="lock"
      />
    </v-form>
    <div class="py-4 text-center">
      <router-link
        :to="'/forgot-password'"
        class="font-italic text-decoration-none black--text"
        >Quên mật khẩu</router-link
      >
    </div>
    <v-divider />
    <v-card-actions class="d-flex flex-column justify-content-center py-8">
      <v-btn color="#FFB300" class="px-12 white--text" @click="submit"
        >Đăng Nhập</v-btn
      >
      <p class="pt-2">
        Không có tài khoản?
        <router-link
          :to="'/signup'"
          class="font-weight-regular text-decoration-none pt-2 text--darken-1 amber--text"
          >Đăng ký</router-link
        >
      </p>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class SignInPage extends Vue {
  credentials = {
    identifier: '',
    password: ''
  }
  loading = false
  showPassword = false
  password = 'Password'
  rules = {
    min: (v: string) => v.length >= 6 || 'Min 6 characters',
    emailMatch: () => "The email and password you entered don't match"
  }
}
</script>

<style scoped></style>

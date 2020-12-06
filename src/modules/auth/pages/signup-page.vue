<template>
  <div align="start">
    <v-form ref="form">
      <div class="text-h3 text--darken-1 primary--text font-weight-bold text-center pb-4">
        Đăng ký
      </div>
      <app-text-field
        label="Tên đăng nhập"
        prepend-inner-icon="person"
        v-model="credentials.identifier"
        :rules="[$rules.required, $rules.minLength(4)]"
        validate-on-blur
        @keyup.enter="submit"
        type="text"
      />

      <app-text-field
        label="Nhập email của bạn"
        prepend-inner-icon="email"
        v-model="email"
        :rules="[$rules.required, $rules.email]"
        validate-on-blur
        @keyup.enter="submit"
        type="text"
      />

      <app-text-field
        label="Mật Khẩu"
        v-model="password"
        :append-icon="newPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="newPassword ? 'text' : 'password'"
        :rules="[$rules.required, $rules.minLength(4)]"
        @keyup.enter="submit"
        @click:append="newPassword = !newPassword"
        prepend-inner-icon="lock"
        validate-on-blur
      />

      <app-text-field
        label="Nhập lại mật khẩu"
        v-model="passwordConfirmation"
        :append-icon="checkPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="checkPassword ? 'text' : 'password'"
        :rules="[$rules.required, $rules.minLength(4)]"
        validate-on-blur
        prepend-inner-icon="lock"
        @keyup.enter="submit"
        @click:append="checkPassword = !checkPassword"
      />
    </v-form>

    <v-card-actions class="d-flex flex-column justify-content-center pt-6">
      <v-btn
        href="/confirm-email"
        color="primary"
        class="px-12 white--text"
        @click="
          {
          }
        "
        >Đăng Ký</v-btn
      >
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class SignupPage extends Vue {
  credentials = {
    identifier: '',
    password: ''
  }
  email = ''
  passwordConfirmation = ''
  newPassword = false
  loading = false
  checkPassword = false
  password = 'Password'
  rules = {
    min: (v: string) => v.length >= 6 || 'Min 6 characters'
  }
}
</script>

<style scoped></style>

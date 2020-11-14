<template>
  <div align="start" class="mx-sm-4 px-sm-4 mx-md-10 px-md-10 xs-screen">
    <v-form ref="form">
      <div
        class="text-h3 text--darken-1 amber--text font-weight-bold text-center pb-4"
      >
        Đăng ký
      </div>
      <v-text-field
        label="Tên đăng nhập"
        prepend-inner-icon="person"
        v-model="credentials.identifier"
        :rules="[$rules.required, $rules.minLength(4)]"
        validate-on-blur
        @keyup.enter="submit"
        type="text"
      />

      <v-text-field
        label="Nhập email của bạn"
        prepend-inner-icon="email"
        v-model="email"
        :rules="[$rules.required, $rules.email]"
        validate-on-blur
        @keyup.enter="submit"
        type="text"
      />

      <v-text-field
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

      <v-text-field
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
        color="#FFB300"
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
export default class ConfirmEmailPage extends Vue {
  credentials = {
    identifier: '',
    password: ''
  }
  loading = false
  email = ''
  newPassword = false
  checkPassword = false
  password = 'Password'
  passwordConfirmation = ''
  rules = {
    min: (v: string) => v.length >= 6 || 'Min 6 characters'
  }

  submit() {
    //
  }
}
</script>

<style scoped></style>

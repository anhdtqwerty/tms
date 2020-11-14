<template>
  <div align="start" class="pa-12">
    <v-form ref="form" class="mx-6">
      <h1 class="pb-12">Đặt lại mật khẩu</h1>
      <v-text-field
        v-model="password"
        label="Mật khẩu mới"
        :type="newPassword ? 'text' : 'password'"
        :append-icon="newPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[$rules.required, $rules.minLength(4), rules.min]"
        @click:append="newPassword = !newPassword"
        validate-on-blur
      />
      <v-text-field
        label="Nhập lại mật khẩu"
        v-model="passwordConfirmation"
        :append-icon="checkPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="checkPassword = !checkPassword"
        :type="checkPassword ? 'text' : 'password'"
        :rules="[
          $rules.required,
          $rules.minLength(4),
          passwordConfirmationRule
        ]"
        validate-on-blur
        @keyup.enter="submit"
      />
    </v-form>
    <div align="center" justify="center" class="pt-4">
      <v-btn color="#FFB300" class="px-12 white--text" @click="submit"
        >Thay đổi</v-btn
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ResetPasswordPage extends Vue {
  code = ''
  password = ''
  passwordConfirmation = ''
  newPassword = false
  checkPassword = false
  rules = {
    min: (v: string) => v.length >= 6 || 'Min 6 characters',
    emailMatch: () => "The email and password you entered don't match"
  }

  get passwordConfirmationRule() {
    return (password: string) =>
      password === this.passwordConfirmation || 'Không chính xác'
  }

  submit() {
    //
  }
}
</script>

<style scoped></style>

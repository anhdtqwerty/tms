<template>
  <div align="start">
    <v-form ref="form" class="mx-6">
      <div class="text-h4 mb-16 primary--text font-weight-bold text-center text-uppercase">Đặt lại mật khẩu</div>
      <v-text-field
        v-model="password"
        label="Mật khẩu mới"
        :type="newPassword ? 'text' : 'password'"
        :append-icon="newPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[$rules.required, $rules.minLength(6)]"
        @click:append="newPassword = !newPassword"
        validate-on-blur
      />
      <v-text-field
        label="Nhập lại mật khẩu"
        v-model="passwordConfirmation"
        :append-icon="checkPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="checkPassword = !checkPassword"
        :type="checkPassword ? 'text' : 'password'"
        :rules="[$rules.required, $rules.minLength(6), passwordConfirmationRule]"
        validate-on-blur
        @keyup.enter="submit"
      />
    </v-form>
    <div align="center" justify="center" class="pt-4">
      <v-btn color="primary" class="px-12 white--text" @click="submit">Thay đổi</v-btn>
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

  get passwordConfirmationRule() {
    return (password: string) => password === this.passwordConfirmation || 'Không chính xác'
  }

  submit() {
    this.$router.replace('signin')
  }
}
</script>

<style scoped></style>

<template>
  <div align="start">
    <v-form ref="form" class="mx-6">
      <div class="text-h4 mb-16 primary--text font-weight-bold text-center text-uppercase">Đặt lại mật khẩu</div>
      <app-text-field
        v-model="password"
        label="Mật khẩu mới"
        :type="newPassword ? 'text' : 'password'"
        :append-icon="newPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[$rules.required, $rules.minLength(6)]"
        @click:append="newPassword = !newPassword"
        validate-on-blur
      />
      <app-text-field
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
import { AppProvider } from '@/app-provider'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { get } from 'lodash'
import { ComradeModel } from '@/models/comrade-model'
@Component
export default class ResetPasswordPage extends Vue {
  @Inject() providers!: AppProvider

  code = ''
  password = ''
  passwordConfirmation = ''
  newPassword = false
  checkPassword = false

  get passwordConfirmationRule() {
    return (password: string) => password === this.passwordConfirmation || 'Không chính xác'
  }

  created() {
    this.code = this.$route.query.code as string
  }

  async submit() {
    if ((this.$refs.form as any).validate()) {
      const { api, authStore, snackbar } = this.providers
      try {
        const { jwt, user } = await api.resetPassword(this.code, this.password, this.passwordConfirmation)
        authStore.onLogin(false, jwt, user)
        try {
          const comrade = await api.comarde.findOne<ComradeModel>(get(user, 'comrade.id'))
          authStore.changeComrade(comrade)
        } catch (error) {
          console.error('handleLogin get comrade', error)
        }
        this.providers.router.replace('dashboard')
      } catch (error) {
        snackbar.commonError(error)
      }
    }
  }
}
</script>

<style scoped></style>

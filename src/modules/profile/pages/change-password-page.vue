<template>
  <div width="100%" class="d-flex justify-center pt-16">
    <v-card max-width="400" class="pa-4">
      <v-form ref="form">
        <div class="d-flex flex-column">
          <p class="text-h6 primary--text align-self-center">ĐỔI MẬT KHẨU</p>
          <p class="subtitle-2">Để bảo mật tài khoản vui lòng không chia sẻ mật khẩu cho người khác</p>
          <app-text-field
            label="Nhập mật khẩu mới"
            v-model="password"
            :rules="$appRules.comradePassword"
            autocomplete="new-password"
            :append-icon="showInputPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showInputPassword = !showInputPassword"
            :type="showInputPassword ? 'text' : 'password'"
          />
          <app-text-field
            label="Xác nhận mật khẩu mới"
            v-model="confirmPassword"
            :rules="[...$appRules.comradePassword, passwordConfirmMatch]"
            autocomplete="new-password"
            :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showConfirmPassword = !showConfirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
          />
          <v-btn depressed color="primary" medium @click="change">
            <span>Xác nhận</span>
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { UserModel } from '@/models/auth-model'
import { Component, Inject, Ref, Vue } from 'vue-property-decorator'

@Component
export default class ChangePasswordPage extends Vue {
  @Inject() providers: AppProvider

  @Ref('form') form: any

  showInputPassword = false
  showConfirmPassword = false

  password = ''
  confirmPassword = ''

  passwordConfirmMatch() {
    return this.password === this.confirmPassword || 'Mật khẩu không khớp'
  }

  async change() {
    if (!this.form.validate()) return
    const { api, authStore, snackbar, router } = this.providers
    try {
      const user: UserModel = await api.user.findOne(authStore.user.id)
      await api.user.update(user.id, { ...user, password: this.password })
      snackbar.updateSuccess()
      router.replace('/dashboard')
    } catch (error) {
      snackbar.commonError(error)
    }
  }
}
</script>

<style scoped></style>

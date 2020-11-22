<template>
  <div align="start">
    <v-form ref="form">
      <div class="text-h4 primary--text font-weight-bold text-center text-uppercase">
        quên mật khẩu
      </div>
      <p class="pt-5 mx-2 body-2">
        Nhập địa chỉ email của bạn, chúng tôi sẽ gửi tới bạn liên kết để đặt lại mật khẩu
      </p>
      <v-text-field
        label="Email"
        :value="viewmodel.email"
        @input="viewmodel.changeEmail"
        :rules="[$rules.required, $rules.email]"
        validate-on-blur
        @keyup.enter="submit"
        type="text"
      />
    </v-form>
    <div class="mt-4" align="center" justify="center">
      <v-btn color="primary" @click="submit">Tiếp theo</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { ForgotPasswordViewModel } from '../viewmodels/forgot-password-viewmodel'
@Component
export default class ForgotPasswordPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new ForgotPasswordViewModel(this.providers)
  submit() {
    if ((this.$refs.form as any).validate()) {
      this.viewmodel.submit()
    }
  }
}
</script>

<style scoped></style>

<template>
  <div align="start">
    <v-form ref="form">
      <div class="text-h4 primary--text font-weight-bold pb-16 text-center text-uppercase">
        Đăng nhập
      </div>
      <app-text-field
        label="Tài Khoản"
        name="login"
        :value="viewmodel.username"
        @input="viewmodel.changeUsername"
        :rules="[$rules.required, $rules.minLength(4)]"
        validate-on-blur
        @keyup.enter="submit"
        type="text"
      />

      <app-text-field
        label="Mật Khẩu"
        :value="viewmodel.password"
        @input="viewmodel.changePassword"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        :type="showPassword ? 'text' : 'password'"
        :rules="[$rules.required, $rules.minLength(4)]"
        validate-on-blur
        @keyup.enter="submit"
      />
    </v-form>
    <div class="d-flex justify-space-between align-center">
      <v-checkbox label="Nhớ tài khoản" v-model="saveAccount" />
      <router-link to="forgot-password" class="text-decoration-none primary--text">Quên mật khẩu</router-link>
    </div>
    <v-card-actions class="d-flex flex-column justify-content-center">
      <v-btn color="primary" class="white--text" @click="submit">Đăng Nhập</v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { SigninViewModel } from '../viewmodels/signin-viewmodel'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'

@Component
export default class SignInPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new SigninViewModel(this.providers)

  showPassword = false
  saveAccount = false

  submit() {
    if ((this.$refs.form as any).validate()) {
      this.viewmodel.handleLogin(this.saveAccount)
    }
  }
}
</script>

<style scoped></style>

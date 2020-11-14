<template>
  <div align="start" class="pa-12">
    <v-form ref="form" class="mx-5">
      <h1 class="mx-2">Quên mật khẩu ?</h1>
      <p class="py-4 mx-2">
        Nhập địa chỉ email của bạn, chúng tôi sẽ gửi tới bạn liên kết để đặt lại
        mật khẩu
      </p>
      <v-text-field
        class="py-4 mx-2"
        label="Nhập email của bạn"
        prepend-inner-icon="email"
        v-model="email"
        :rules="[$rules.required, $rules.email]"
        validate-on-blur
        @keyup.enter="submit"
        type="text"
        filled
      />
    </v-form>
    <div align="center" justify="center">
      <v-btn
        href="/reset-password"
        color="#FFB300"
        class="px-12 white--text"
        @click="submit"
        >Tiếp theo</v-btn
      >
      <router-link
        :to="'/signin'"
        class="d-block mt-2 mb-3 text-decoration-none"
        style="color:#FFB300"
        >Quay lại đăng nhập</router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ForgotPasswordPage extends Vue {
  email = ''
  done = false
  submit() {
    //
  }
}
</script>

<style scoped></style>

<template>
  <div width="100%" class="d-flex justify-center pt-16">
    <v-card min-width="350" class="pa-4">
      <div class="d-flex flex-column">
        <p class="text-h6 primary--text align-self-center">Cấu hình hệ thống</p>
        <app-text-field
          label="Thời gian cảnh báo cập nhật tiến độ"
          :messages="['Đơn vị: ngày']"
          v-model="numberDays"
          class="mb-4"
        />
        <v-btn depressed color="primary" medium @click="change">
          <span>Xác nhận</span>
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { UserModel } from '@/models/auth-model'
import { Component, Inject, Provide, Ref, Vue } from 'vue-property-decorator'
import { SystemConfigViewModel } from '../viewmodels/system-config.viewmodel'

@Component
export default class ChangePasswordPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new SystemConfigViewModel(this.providers)

  numberDays = ''

  async change() {
    console.log(this.numberDays)
    const { api, authStore, snackbar, router } = this.providers
    try {
      const user: UserModel = await api.user.findOne(authStore.user.id)
      // await api.user.update(user.id, { ...user, password: this.password })
      // snackbar.updateSuccess()
      // router.replace('/dashboard')
    } catch (error) {
      snackbar.commonError(error)
    }
  }
}
</script>

<style scoped></style>

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
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { SystemConfigViewModel } from '../viewmodels/system-config.viewmodel'
import _ from 'lodash'
@Component
export default class ChangePasswordPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new SystemConfigViewModel(this.providers)

  numberDays = ''

  async mounted() {
    const { api, snackbar } = this.providers
    try {
      const config: any = await api.getConfig()

      this.numberDays = _.get(config.data, 'earlyExpiredDays') ?? 10
    } catch (error) {
      snackbar.commonError(error)
    }
  }

  async change() {
    const { api, snackbar } = this.providers
    try {
      await api.updateConfig({ data: { earlyExpiredDays: +this.numberDays } })
    } catch (error) {
      snackbar.commonError(error)
    }
  }
}
</script>

<style scoped></style>

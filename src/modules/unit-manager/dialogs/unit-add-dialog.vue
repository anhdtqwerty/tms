<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" scrollable width="600" v-model="syncedValue">
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>THÊM MỚI ĐƠN VỊ</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form ref="form" style="overflow-y: auto">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12" class="pa-2">
              <app-text-field v-model="title" :rules="$appRules.unitName" label="Tên đơn vị" />
              <app-text-field v-model="code" :rules="$appRules.unitCode" @keydown.space.prevent label="Mã đơn vị" />
              <app-text-field v-model="ministry" label="Đơn vị cha" disabled />
              <app-text-field v-model="email" :rules="$appRules.unitEmail" label="Email đơn vị" />
              <app-text-field v-model="phone" :rules="$appRules.unitPhone" label="Số điện thoại đơn vị" />
              <app-text-field v-model="address" :rules="$appRules.unitAddress" label="Địa chỉ" />
              <app-textarea v-model="description" :rules="$appRules.unitDescription" label="Mô tả" counter="5000" />
            </v-col>
            <v-col cols="12" class="pa-2" align="end">
              <v-btn depressed color="primary" medium @click="save">
                <span>Hoàn thành</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { UnitModel } from '@/models/unit-model'
import { Component, Inject, PropSync, Ref, Vue, Watch } from 'vue-property-decorator'

@Component
export default class UnitAddDialog extends Vue {
  @Inject() providers!: AppProvider

  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean

  @Ref('form') form: any

  title = ''
  code = ''
  email = ''
  phone = ''
  description = ''
  address = ''
  ministry = ''

  @Watch('value', { immediate: true }) onValueChanged(val: string) {
    if (val) this.ministry = 'BỘ GIAO THÔNG VẬN TẢI'
  }

  async save() {
    if (this.form.validate()) {
      try {
        const units = await this.providers.api.unit.find<UnitModel>({ code: this.code, _limit: 1 })
        if (!units.length) {
          const unit = await this.providers.api.unit.create({
            title: this.title,
            description: this.description,
            code: this.code,
            email: this.email,
            phone: this.phone,
            type: 'unit',
            data: { address: this.address }
          })
          this.$emit('success', unit)
          this.syncedValue = false
          this.form.reset()
          this.providers.snackbar.addSuccess()
        } else {
          this.providers.snackbar.error('Mã đơn vị này đã được sử dụng')
        }
      } catch (error) {
        this.providers.snackbar.commonError(error)
      }
    }
  }
}
</script>

<style scoped></style>

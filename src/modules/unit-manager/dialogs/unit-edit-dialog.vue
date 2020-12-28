<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" scrollable width="600" v-model="syncedValue">
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>SỬA THÔNG TIN ĐƠN VỊ</v-toolbar-title>
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
              <app-text-field v-model="code" :rules="$appRules.unitCode" label="Mã đơn vị" />
              <app-text-field
                v-if="unit && unit.type === 'unit'"
                value="BỘ GIAO THÔNG VẬN TẢI"
                label="Đơn vị cha"
                disabled
              />
              <app-text-field v-model="email" :rules="$appRules.unitEmail" label="Email đơn vị" />
              <app-text-field v-model="phone" :rules="$appRules.unitPhone" label="Số điện thoại đơn vị" />
              <app-textarea v-model="description" label="Mô tả" counter="5000" />
            </v-col>
            <v-col cols="12" class="pa-2 d-flex justify-end">
              <v-btn depressed class="mr-4" medium @click="cancel">
                <span>Hủy</span>
              </v-btn>
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
import { Component, Inject, Prop, PropSync, Ref, Vue, Watch } from 'vue-property-decorator'

@Component
export default class UnitEditDialog extends Vue {
  @Inject() providers!: AppProvider

  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Prop() unit: UnitModel

  @Ref('form') form: any

  title = ''
  code = ''
  email = ''
  phone = ''
  description = ''

  @Watch('unit') onUnitChanged(val: UnitModel) {
    if (val) {
      this.title = val.title
      this.code = val.code
      this.email = val.email
      this.phone = val.phone
      this.description = val.description
    }
  }

  cancel() {
    this.syncedValue = false
    this.form.reset()
  }

  async save() {
    if (this.form.validate()) {
      let unit: UnitModel = {
        ...this.unit,
        title: this.title,
        code: this.code,
        email: this.email,
        phone: this.phone,
        description: this.description
      }
      unit = await this.providers.api.unit.update(unit.id, unit)
      this.$emit('success', unit)
      this.syncedValue = false
    }
  }
}
</script>

<style scoped></style>
<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" scrollable width="600" v-model="syncedValue">
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>SỬA THÔNG TIN PHÒNG BAN</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form ref="form" style="overflow-y: auto">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12" class="pa-2">
              <app-text-field v-model="title" :rules="$appRules.unitName" label="Tên phòng ban" />
              <app-text-field v-if="unit" :value="unit.title" disabled label="Đơn vị cha" />
              <unit-autocomplete v-else :value.sync="selectedUnitId" :rules="$appRules.parentUnit" label="Đơn vị cha" />
              <app-text-field v-model="code" :rules="$appRules.unitCode" @keydown.space.prevent label="Mã phòng ban" />
              <app-text-field v-model="email" :rules="$appRules.unitEmail" label="Email phòng ban" />
              <app-text-field v-model="phone" :rules="$appRules.unitPhone" label="Số điện thoại phòng ban" />
              <app-text-field v-model="address" :rules="$appRules.unitAddress" label="Địa chỉ" />
              <app-textarea v-model="description" :rules="$appRules.unitDescription" label="Mô tả" counter="5000" />
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
import { DepartmentModel } from '@/models/department-model'
import { UnitModel } from '@/models/unit-model'
import { Component, Inject, Prop, PropSync, Ref, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {
    UnitAutocomplete: () => import('@/components/autocomplete/unit-autocomplete.vue')
  }
})
export default class UnitEditDialog extends Vue {
  @Inject() providers!: AppProvider

  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Prop() department: DepartmentModel
  @Prop() unit: UnitModel

  @Ref('form') form: any

  title = ''
  selectedUnitId: string = null
  code = ''
  email = ''
  phone = ''
  description = ''
  address = ''

  @Watch('value', { immediate: true }) onValueChanged(val: string) {
    if (val && this.department) {
      this.title = this.department.title
      this.selectedUnitId = (this.department.unit as UnitModel).id
      this.code = this.department.code
      this.email = this.department.email
      this.phone = this.department.phone
      this.description = this.department.description
      this.address = this.department.data?.address ?? ''
    }
  }

  cancel() {
    this.syncedValue = false
    this.form.reset()
  }

  async save() {
    if (this.form.validate()) {
      try {
        let validCode = this.code === this.department.code
        if (!validCode) {
          const departments = await this.providers.api.department.find<DepartmentModel>({ code: this.code, _limit: 1 })
          validCode = departments.length === 0
        }
        if (validCode) {
          let department: DepartmentModel = {
            unit: this.unit?.id ?? this.selectedUnitId,
            title: this.title,
            code: this.code,
            email: this.email,
            phone: this.phone,
            description: this.description,
            data: { address: this.address }
          }
          department = await this.providers.api.department.update(this.department.id, department)
          this.$emit('success', department)
          this.syncedValue = false
          this.providers.snackbar.updateSuccess()
        } else {
          this.providers.snackbar.error('Mã phòng ban này đã được sử dụng')
        }
      } catch (error) {
        this.providers.snackbar.commonError(error)
      }
    }
  }
}
</script>

<style scoped></style>

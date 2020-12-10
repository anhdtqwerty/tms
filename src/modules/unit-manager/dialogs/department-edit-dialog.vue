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
              <app-text-field v-model="title" :rules="$appRules.unitName" label="Tên đơn vị" />
              <app-text-field v-if="unit" :value="unit.title" disabled label="Đơn vị cha" />
              <unit-autocomplete v-else :value.sync="selectedUnitId" label="Đơn vị cha" />
              <app-text-field v-model="code" :rules="$appRules.unitCode" label="Mã đơn vị" />
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

  @Watch('department') onUnitChanged(val: DepartmentModel) {
    if (val) {
      console.log(val.unit)
      this.title = val.title
      this.selectedUnitId = (val.unit as UnitModel).id
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
      let department: DepartmentModel = {
        ...this.department,
        unit: this.unit?.id ?? this.selectedUnitId,
        title: this.title,
        code: this.code,
        email: this.email,
        phone: this.phone,
        description: this.description
      }
      department = await this.providers.api.department.update(department.id, department)
      this.$emit('success', department)
      this.syncedValue = false
    }
  }
}
</script>

<style scoped></style>

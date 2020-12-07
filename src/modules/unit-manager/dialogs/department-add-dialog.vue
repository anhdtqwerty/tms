<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" scrollable width="600" v-model="syncedValue">
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>THÊM MỚI PHÒNG BAN</v-toolbar-title>
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
              <unit-autocomplete v-else :value.sync="selectedUnitId" label="Đơn vị cha" />
              <app-text-field v-model="code" :rules="$appRules.unitCode" label="Mã phòng ban" />
              <app-text-field v-model="email" :rules="$appRules.unitEmail" label="Email phòng ban" />
              <app-text-field v-model="phone" :rules="$appRules.unitPhone" label="Số điện thoại phòng ban" />
              <app-textarea v-model="description" label="Mô tả" counter="5000" />
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
import { Component, Inject, Prop, PropSync, Ref, Vue } from 'vue-property-decorator'

@Component({
  components: {
    UnitAutocomplete: () => import('../components/unit-autocomplete.vue')
  }
})
export default class DepartmentAddDialog extends Vue {
  @Inject() providers!: AppProvider

  @Prop() unit: UnitModel
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean

  @Ref('form') form: any

  title = ''
  selectedUnitId: string = null
  code = ''
  email = ''
  phone = ''
  description = ''

  async save() {
    if (this.form.validate()) {
      const department = await this.providers.services.api.department.create({
        title: this.title,
        unit: this.unit?.id ?? this.selectedUnitId,
        description: this.description,
        code: this.code,
        email: this.email,
        phone: this.phone
      })
      this.$emit('success', department)
      this.syncedValue = false
      this.form.reset()
    }
  }
}
</script>

<style scoped></style>

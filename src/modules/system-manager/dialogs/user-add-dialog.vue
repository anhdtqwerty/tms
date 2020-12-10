<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="884" v-model="syncedValue">
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>THÊM MỚI USER</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form ref="form" style="overflow-y: auto">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12" sm="6">
              <div class="text-subtitle-2 pb-6">Thông tin người dùng</div>
              <app-text-field v-model="name" label="Họ và Tên" :rules="$appRules.comradeName" />
              <app-text-field v-model="code" label="Mã cán bộ" :rules="$appRules.comradeCode" />
              <v-radio-group label="Giới tính" row class="ma-0 pa-0" v-model="sex" :rules="$appRules.comradeSex">
                <v-radio label="Nam" value="male" />
                <v-radio label="Nữ" value="female" />
              </v-radio-group>
              <date-picker-input :value.sync="bod" label="Ngày sinh" :rules="$appRules.comradeBod" />
              <app-text-field
                v-model="email"
                label="Email"
                autocomplete="new-password"
                :rules="$appRules.comradeEmail"
              />
              <app-text-field v-model="phone" label="Số điện thoại" :rules="$appRules.comradePhone" />
              <div class="d-flex justify-space-between">
                <div class="text-body-2">Người dùng hoạt động</div>
                <v-switch class="ma-0" v-model="active" />
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="text-subtitle-2 pb-6">Đơn vị công tác</div>
              <unit-autocomplete :value.sync="unit" label="Đơn vị" />
              <department-autocomplete :value.sync="department" :unit="unit" label="Phòng ban" />
              <app-text-field v-model="title" label="Chức vụ" />
              <div class="text-subtitle-2 pb-6">Thông tin đăng nhập</div>
              <app-text-field v-model="username" label="Tên truy cập" :rules="$appRules.comradeUsername" />
              <app-text-field
                label="Mật khẩu"
                v-model="password"
                :rules="$appRules.comradePassword"
                autocomplete="new-password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :type="showPassword ? 'text' : 'password'"
              />
              <position-autocomplete
                :value.sync="group"
                :types="['group']"
                label="Chọn Nhóm"
                :rules="$appRules.comradeGroup"
              />
              <position-autocomplete :value.sync="position" :types="['unit', 'department']" label="Chọn Vai trò" />
            </v-col>
            <!-- <v-col cols="12" align="end"> </v-col> -->
            <v-col cols="12" class="pa-2 d-flex justify-space-between">
              <div>
                <span class="red--text" v-for="error in submitErrors" :key="error">{{ error }}</span>
              </div>

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
import { Component, Inject, PropSync, Ref, Vue } from 'vue-property-decorator'
import { ComradeSex } from '@/models/comrade-model'

@Component({
  components: {
    UnitAutocomplete: () => import('@/components/autocomplete/unit-autocomplete.vue'),
    DepartmentAutocomplete: () => import('@/components/autocomplete/department-autocomplete.vue'),
    PositionAutocomplete: () => import('@/components/autocomplete/position-autocomplete.vue'),
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue')
  }
})
export default class UserAddDialog extends Vue {
  @Inject() providers: AppProvider

  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean

  @Ref('form') form: any

  name = ''
  code = ''
  sex: ComradeSex = 'male'
  bod: string = null
  email = ''
  phone = ''
  active = true

  department: string = null
  unit: string = null
  title = '' // chức vụ
  username = ''
  password = ''
  group: string = null
  position: string = null
  showPassword = false

  submitErrors: string[] = []

  async save() {
    // if (this.form.validate()) {
    const submitErrors: string[] = []
    const [hasComrade, hasUser] = await Promise.all([
      this.providers.api.comarde.count({ code: this.code }).then(count => count > 0),
      this.providers.api.user.count({ username: this.username }).then(count => count > 0)
    ])
    if (hasComrade) {
      submitErrors.push(`[${this.code}]: Mã cán bộ đã được sử dụng`)
    }
    if (hasUser) {
      submitErrors.push(`[${this.username}] Tên truy cập này đã được sử dụng`)
    }
    this.submitErrors = submitErrors
    // }
    // const ok = await this.providers.alert.confirm('Hêllo', 'message')
    // console.log(ok)
  }
}
</script>

<style scoped></style>

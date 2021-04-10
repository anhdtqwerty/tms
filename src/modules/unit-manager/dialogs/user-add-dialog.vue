<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" scrollable width="600" v-model="syncedValue">
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>THÊM MỚI NHÂN VIÊN</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form ref="form" style="overflow-y: auto">
        <v-container fluid px-5 py-2>
          <v-row>
            <v-col cols="12" class="pa-2">
              <div class="text-subtitle-2 pb-6">Thông tin người dùng</div>
              <app-text-field v-model="name" label="Họ và Tên" :rules="$appRules.comradeName" />
              <app-text-field v-model="code" label="Mã cán bộ" :rules="$appRules.comradeCode" @keydown.space.prevent />
              <v-radio-group label="Giới tính" row class="ma-0 pa-0" v-model="sex" :rules="$appRules.comradeSex">
                <v-radio label="Nam" value="male" />
                <v-radio label="Nữ" value="female" />
              </v-radio-group>
              <app-text-field
                :value.sync="dobDisplay"
                @click="showDob = true"
                append-icon="expand_more"
                :rules="$appRules.comradeBod"
                @click:append="showDob = true"
                readonly
                clearable
                @click:clear="clearDob"
                label="Ngày sinh"
              />
              <date-input-dialog :value.sync="showDob" @ok="handleDob" />

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
              <div class="text-subtitle-2 pb-6">Thông tin đăng nhập</div>
              <app-text-field
                v-model="username"
                label="Tên truy cập"
                :rules="$appRules.comradeUsername"
                @keydown.space.prevent
              />
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
            <v-col cols="12" class="pa-2 d-flex justify-space-between">
              <div class="d-flex flex-column">
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
import { ComradeSex } from '@/models/comrade-model'
import { DepartmentModel } from '@/models/department-model'
import { UnitModel } from '@/models/unit-model'
import _ from 'lodash'
import moment from 'moment'
import { Component, Inject, Prop, PropSync, Ref, Vue } from 'vue-property-decorator'

@Component({
  components: {
    UnitAutocomplete: () => import('@/components/autocomplete/unit-autocomplete.vue'),
    DepartmentAutocomplete: () => import('@/components/autocomplete/department-autocomplete.vue'),
    PositionAutocomplete: () => import('@/components/autocomplete/position-autocomplete.vue'),
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue'),
    DateInputDialog: () => import('@/components/picker/date-input-dialog.vue')
  }
})
export default class UserAddDialog extends Vue {
  @Inject() providers!: AppProvider

  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Prop() department: DepartmentModel
  @Prop() unit: UnitModel

  @Ref('form') form: any

  name = ''
  code = ''
  sex: ComradeSex = 'male'
  bod: string = null
  email = ''
  phone = ''
  active = true

  title = '' // chức vụ
  username = ''
  password = ''
  group: string = null
  position: string = null
  showPassword = false

  submitErrors: string[] = []

  dobDisplay: string = null
  showDob = false

  handleDob(date: string) {
    this.bod = date
    this.dobDisplay = moment(date).format('DD/MM/YYYY')
  }
  clearDob() {
    this.bod = null
    this.dobDisplay = null
  }

  async save() {
    if (!this.form.validate()) return
    const submitErrors: string[] = []
    try {
      const api = this.providers.api
      const [hasComrade, hasUser, hasEmail] = await Promise.all([
        api.comarde.count({ code: this.code }).then(count => count > 0),
        api.user.count({ username: this.username }).then(count => count > 0),
        api.user.count({ email: this.email }).then(count => count > 0)
      ])
      if (!hasComrade && !hasUser && !hasEmail) {
        const user = await api.user.create({
          username: this.username,
          email: this.email,
          password: this.password,
          blocked: !this.active
        })
        try {
          const comrade = await api.comarde.create({
            name: this.name,
            code: this.code,
            phone: this.phone,
            email: this.email,
            data: {
              bod: this.bod,
              sex: this.sex,
              title: this.title
            },
            department: _.get(this.department, 'id'),
            unit: _.get(this.department, 'unit.id') || _.get(this.unit, 'id'),
            position: this.position,
            group: this.group,
            user: user.id
          })
          this.$emit('success', comrade)
          this.syncedValue = false
          this.form.reset()
          this.providers.snackbar.addSuccess()
        } catch (error) {
          await api.user.delete(user.id)
          throw error
        }
      } else {
        if (hasComrade) {
          submitErrors.push(`[${this.code}]: Mã cán bộ đã được sử dụng`)
        }
        if (hasUser) {
          submitErrors.push(`[${this.username}]: Tên truy cập này đã được sử dụng`)
        }
        if (hasEmail) {
          submitErrors.push(`[${this.email}]: Email đã tồn tại`)
        }
      }
    } catch (error) {
      this.providers.snackbar.commonError(error)
    }

    this.submitErrors = submitErrors
  }
}
</script>

<style scoped></style>

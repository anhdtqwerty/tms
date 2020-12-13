<template>
  <v-container fluid px-5 py-0>
    <v-row justify="space-between" align="center">
      <v-col cols="12" class="pa-2">
        <div class="text-h6">Người dùng</div>
        <breadcrumbs />
      </v-col>
      <v-col cols="12" class="pa-2">
        <v-card class="mt-4">
          <v-form>
            <v-row>
              <v-col class="px-8">
                <div class="d-flex align-center">
                  <v-avatar height="120" width="120">
                    <v-img src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460" />
                  </v-avatar>
                  <div class="ml-4 mt-4">
                    <div class="text-h6">{{ name }}</div>
                    <div class="text-body-2 mb-4">{{ viewmodel.comrade ? viewmodel.comrade.position.title : '' }}</div>
                    <app-text-field outlined v-model="code" label="Mã cán bộ" :rules="$appRules.comradeCode" />
                  </div>
                </div>
                <div class="text-subtitle-2 py-4">Thông tin người dùng</div>
                <app-text-field outlined v-model="name" label="Họ và Tên" :rules="$appRules.comradeName" />
                <v-radio-group label="Giới tính" row class="ma-0 pa-0" v-model="sex" :rules="$appRules.comradeSex">
                  <v-radio label="Nam" value="male" />
                  <v-radio label="Nữ" value="female" />
                </v-radio-group>
                <date-picker-input
                  :value.sync="bod"
                  label="Ngày sinh"
                  :rules="$appRules.comradeBod"
                  :outlined="false"
                  class="mb-4"
                />
                <app-text-field
                  outlined
                  v-model="email"
                  label="Email"
                  autocomplete="new-password"
                  :rules="$appRules.comradeEmail"
                />
                <app-text-field outlined v-model="phone" label="Số điện thoại" :rules="$appRules.comradePhone" />
                <div class="d-flex">
                  <div class="text-body-2">Người dùng hoạt động</div>
                  <v-switch class="ma-0 pa-0 ml-4" v-model="active" />
                </div>
              </v-col>
              <v-col class="px-8">
                <div class="text-subtitle-2 pb-4">Thông tin đăng nhập</div>
                <app-text-field outlined v-model="username" label="Tên truy cập" :rules="$appRules.comradeUsername" />
                <app-text-field
                  outlined
                  label="Mật khẩu"
                  v-model="password"
                  disabled
                  :rules="$appRules.comradePassword"
                  autocomplete="new-password"
                  :type="'password'"
                />
                <position-autocomplete
                  :value.sync="position"
                  :types="['unit', 'department']"
                  label="Vai trò khi truy cập"
                  :outlined="false"
                />
                <position-autocomplete
                  :value.sync="group"
                  :types="['group']"
                  label="Chọn Nhóm"
                  :rules="$appRules.comradeGroup"
                  :outlined="false"
                />
                <div class="text-subtitle-2 pb-4">Phòng ban Đơn vị</div>
                <department-autocomplete :value.sync="department" :unit="unit" label="Phòng ban" :outlined="false" />
                <unit-autocomplete :value.sync="unit" label="Đơn vị" :outlined="false" />
                <app-text-field outlined v-model="title" label="Chức vụ" />
              </v-col>
            </v-row>
          </v-form>
          <div class="d-flex justify-end pb-5 pr-5">
            <v-btn depressed @click="viewmodel.deleteComrade()" color="error" class="px-5">
              <span>Xóa</span>
            </v-btn>
            <v-btn depressed color="primary" @click="save" class="ml-4 px-5">
              <span>Lưu</span>
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { UserModel } from '@/models/auth-model'
import { ComradeModel, ComradeSex } from '@/models/comrade-model'
import { DepartmentModel } from '@/models/department-model'
import { PositionModel } from '@/models/position-model'
import { UnitModel } from '@/models/unit-model'
import { reaction } from 'mobx'
import { Observer } from 'mobx-vue'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { UserDetailViewModel } from '../viewmodels/user-detail-viewmodel'

@Observer
@Component({
  components: {
    UnitAutocomplete: () => import('@/components/autocomplete/unit-autocomplete.vue'),
    DepartmentAutocomplete: () => import('@/components/autocomplete/department-autocomplete.vue'),
    PositionAutocomplete: () => import('@/components/autocomplete/position-autocomplete.vue'),
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue')
  }
})
export default class UserDetailPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new UserDetailViewModel(this.providers)

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
  password = 'password'
  group: string = null
  position: string = null

  submitErrors: string[] = []

  constructor() {
    super()
    reaction(
      () => this.viewmodel.comrade,
      comrade => {
        this.change(comrade)
      }
    )
  }

  change(comrade: ComradeModel) {
    const user = comrade.user as UserModel
    this.name = comrade.name
    this.code = comrade.code
    this.sex = comrade.data.sex
    this.bod = comrade.data.bod ?? ''
    this.email = user.email
    this.phone = comrade.phone
    this.active = !user.blocked
    this.department = (comrade.department as DepartmentModel)?.id
    this.unit = (comrade.unit as UnitModel)?.id
    this.title = comrade.data.title
    this.username = user.username
    // this.password = user.password
    this.group = (comrade.group as PositionModel)?.id
    this.position = (comrade.position as PositionModel)?.id
  }

  save() {
    const comrade = {
      ...this.viewmodel.comrade,
      name: this.name,
      code: this.code,
      phone: this.phone,
      data: {
        bod: this.bod,
        sex: this.sex,
        title: this.title
      },
      department: this.department,
      unit: this.unit,
      position: this.position,
      group: this.group,
      user: (this.viewmodel.comrade.user as UserModel).id
    }
    this.viewmodel.updateComrade(comrade)
  }
}
</script>

<style scoped></style>

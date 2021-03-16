<template>
  <v-container fluid px-5 py-0>
    <v-row justify="space-between" align="center">
      <v-col cols="12" class="pa-2">
        <div class="text-h6">Người dùng</div>
        <breadcrumbs />
      </v-col>
      <v-col cols="12" class="pa-2">
        <v-card class="mt-4">
          <v-form ref="form">
            <v-row>
              <v-col cols="12" lg="6" class="px-8">
                <div class="d-flex align-center flex-column flex-sm-row">
                  <div class="d-flex">
                    <app-avatar
                      ref="image"
                      :avatar="selectedAvatarFile || (viewmodel.comrade && viewmodel.comrade.avatar)"
                      height="200"
                      width="200"
                      @click.stop="selectAvatar"
                    >
                    </app-avatar>
                    <v-file-input
                      ref="fileInput"
                      accept="image/png, image/jpeg, image/bmp"
                      prepend-icon="mdi-camera"
                      class="align-self-end"
                      style="max-width: 24px;"
                      hide-input
                      v-model="selectedAvatarFile"
                    />
                  </div>
                  <div class="ml-4 mt-4">
                    <div class="text-h6">{{ name }}</div>
                    <div class="text-body-2 mb-4">{{ viewmodel | _get('comrade.position.title') }}</div>
                    <app-text-field outlined v-model="code" label="Mã cán bộ" disabled />
                  </div>
                </div>
                <div class="text-subtitle-2 py-4">Thông tin người dùng</div>
                <app-text-field outlined v-model="name" label="Họ và Tên" :rules="$appRules.comradeName" />
                <v-radio-group label="Giới tính" row class="ma-0 pa-0" v-model="sex" :rules="$appRules.comradeSex">
                  <v-radio label="Nam" value="male" />
                  <v-radio label="Nữ" value="female" />
                </v-radio-group>
                <!-- <date-picker-input
                  :value.sync="bod"
                  label="Ngày sinh"
                  :rules="$appRules.comradeBod"
                  :outlined="false"
                  class="mb-4"
                /> -->
                <app-text-field
                  :value.sync="dobDisplay"
                  @click="showDob = true"
                  append-icon="expand_more"
                  :rules="$appRules.comradeBod"
                  @click:append="showDob = true"
                  readonly
                  clearable
                  :outlined="false"
                  @click:clear="clearDob"
                  label="Ngày sinh"
                />
                <app-text-field
                  outlined
                  :readonly="!allowEditEmail"
                  @click:append="toggleEditEmail()"
                  :rules="allowEditEmail ? $appRules.comradeEmail : []"
                  v-model="email"
                  label="Email"
                  autocomplete="new-password"
                  :append-icon="allowEditEmail ? 'close' : 'edit'"
                />
                <app-text-field outlined v-model="phone" label="Số điện thoại" :rules="$appRules.comradePhone" />
                <div class="d-flex">
                  <div class="text-body-2">Người dùng hoạt động</div>
                  <v-switch class="ma-0 pa-0 ml-4" v-model="active" />
                </div>
              </v-col>
              <v-col cols="12" lg="6" class="px-8">
                <div class="text-subtitle-2 pb-4">Thông tin đăng nhập</div>
                <app-text-field outlined v-model="username" label="Tên truy cập" disabled />
                <app-text-field
                  outlined
                  label="Mật khẩu"
                  v-model="password"
                  :readonly="!allowEditPassword"
                  :append-icon="allowEditPassword ? 'close' : 'edit'"
                  :rules="allowEditPassword ? $appRules.comradePassword : []"
                  @click:append="toggleEditPassword()"
                  autocomplete="new-password"
                  :type="'password'"
                />
                <position-autocomplete
                  :value.sync="position"
                  :types="['unit']"
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
                <unit-autocomplete
                  :value.sync="unit"
                  label="Đơn vị"
                  :outlined="false"
                  :rules="$appRules.comradeUnit"
                  :includeMinistry="true"
                />
                <app-text-field outlined v-model="title" label="Chức vụ" />
              </v-col>
            </v-row>
          </v-form>
          <div class="d-flex justify-end pb-5 pr-5">
            <v-btn
              v-if="$permission('system.user.delete')"
              depressed
              @click="viewmodel.deleteComrade()"
              color="error"
              class="px-5"
            >
              <span>Xóa</span>
            </v-btn>
            <v-btn v-if="$permission('system.user.edit')" depressed color="primary" @click="save" class="ml-4 px-5">
              <span>Lưu</span>
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <date-input-dialog :value.sync="showDob" @ok="handleDob" />
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
import { Component, Inject, Provide, Ref, Vue, Watch } from 'vue-property-decorator'
import { UserDetailViewModel } from '../viewmodels/user-detail-viewmodel'
import _ from 'lodash'
import moment from 'moment'

@Observer
@Component({
  components: {
    UnitAutocomplete: () => import('@/components/autocomplete/unit-autocomplete.vue'),
    DepartmentAutocomplete: () => import('@/components/autocomplete/department-autocomplete.vue'),
    PositionAutocomplete: () => import('@/components/autocomplete/position-autocomplete.vue'),
    DatePickerInput: () => import('@/components/picker/date-picker-input.vue'),
    AppAvatar: () => import('@/components/images/app-avatar.vue'),
    DateInputDialog: () => import('@/components/picker/date-input-dialog.vue')
  }
})
export default class UserDetailPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new UserDetailViewModel(this.providers)

  @Ref('form') form: any
  @Ref('fileInput') fileInput: any

  allowEditEmail = false
  allowEditPassword = false

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

  selectedAvatarFile: File = null

  submitErrors: string[] = []

  dobDisplay: string = null
  showDob = false

  constructor() {
    super()
    reaction(
      () => this.viewmodel.comrade,
      comrade => {
        this.change(comrade)
      }
    )
  }

  handleDob(date: string) {
    if (date) {
      this.bod = date
      this.dobDisplay = moment(date).format('DD/MM/YYYY')
    }
  }

  clearDob() {
    this.bod = null
    this.dobDisplay = null
  }

  toggleEditEmail() {
    this.allowEditEmail = !this.allowEditEmail
    if (!this.allowEditEmail) this.email = this.viewmodel.comrade?.email
  }
  toggleEditPassword() {
    this.allowEditPassword = !this.allowEditPassword
    if (!this.allowEditPassword) this.password = 'password'
    else this.password = ''
  }

  change(comrade: ComradeModel) {
    const user = comrade.user as UserModel
    this.name = comrade.name
    this.code = comrade.code
    this.sex = comrade.data.sex
    this.bod = comrade.data.bod ?? ''
    this.dobDisplay = moment(comrade.data.bod).format('DD/MM/YYYY') ?? ''
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

  async save() {
    if (!this.form.validate()) return
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
      user: _.get(this.viewmodel.comrade.user, 'id')
    }
    const options = {
      blocked: !this.active,
      email: this.allowEditEmail ? this.email : undefined,
      password: this.allowEditPassword ? this.password : undefined
    }

    if (await this.viewmodel.updateComrade(this.selectedAvatarFile, comrade, options)) {
      this.selectedAvatarFile = null
    }
  }

  @Watch('unit') onUnitChanged(_: string, old: string) {
    if (old) {
      this.department = null
    }
  }

  selectAvatar() {
    console.log('selectAvatar')
    this.fileInput.$refs.input.click()
  }
}
</script>

<style scoped></style>

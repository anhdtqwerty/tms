import { UserModel } from '@/models/auth-model'
import { ComradeModel } from '@/models/comrade-model'
import { DepartmentModel } from '@/models/department-model'
import { UnitModel } from '@/models/unit-model'
import Axios from 'axios'
import _ from 'lodash'
import { action, computed, observable, reaction } from 'mobx'

class AuthStore {
  @observable jwt = localStorage.getItem('jwt')
  @observable user: UserModel = null
  @observable comrade: ComradeModel = null

  constructor() {
    const userRaw = localStorage.getItem('user')
    if (userRaw) {
      this.user = JSON.parse(userRaw)
    }
    const comradeRaw = localStorage.getItem('comrade')
    if (comradeRaw) {
      this.comrade = JSON.parse(comradeRaw)
    }
    reaction(
      () => this.jwt,
      jwt => {
        if (jwt) localStorage.setItem('jwt', jwt)
        else localStorage.removeItem('jwt')
      }
    )
    reaction(
      () => this.user,
      user => {
        if (user) localStorage.setItem('user', JSON.stringify(user))
        else localStorage.removeItem('user')
      }
    )
    reaction(
      () => this.comrade,
      comrade => {
        if (comrade) localStorage.setItem('comrade', JSON.stringify(comrade))
        else localStorage.removeItem('comrade')
      }
    )
  }

  @action onLogout() {
    this.jwt = null
    this.user = null
    this.comrade = null
  }

  @action onLogin(jwt: string, user: UserModel) {
    this.jwt = jwt
    this.user = user
    this.comrade = user?.comrade as ComradeModel
  }

  @action changeComrade(val: ComradeModel) {
    this.comrade = val
  }

  @computed get authenticated() {
    return !!this.jwt
  }

  @computed get unitParams() {
    // const userDep = authStore.comrade.department as DepartmentModel
    // if (userDep) {
    //   params['id'] = userDep.id
    // } else {
    //   const userUnit = authStore.comrade.unit as UnitModel
    //   if (userUnit && userUnit.type !== 'ministry') {
    //     params['unit'] = userUnit.id
    //   }
    // }
    const unit = this.comrade?.unit as UnitModel
    const department = this.comrade?.department as DepartmentModel
    return {
      ministry: unit?.type === 'ministry' ? unit?.id : undefined,
      unit: unit?.type === 'ministry' ? undefined : unit?.id,
      department: department?.id
    }
  }

  @computed get isLeader() {
    return _.get(this.comrade?.group, 'data.group_type') === 'leader'
  }
}

export const authStore = new AuthStore()

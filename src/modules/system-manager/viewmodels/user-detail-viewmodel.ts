import { AppProvider } from '@/app-provider'
import { UserModel } from '@/models/auth-model'
import { ComradeModel } from '@/models/comrade-model'
import { RequestModel } from '@/models/request-model'
import { TaskModel } from '@/models/task-model'
import _ from 'lodash'
import { observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class UserDetailViewModel {
  @observable comrade: ComradeModel = null

  constructor(private provider: AppProvider) {
    this.loadData()
  }

  @asyncAction *loadData() {
    const comradeId = this.provider.router.currentRoute.params['userid']
    this.comrade = yield this.provider.api.comarde.findOne(comradeId)
  }

  @asyncAction *updateComrade(avatarFile: File, comrade: ComradeModel, blocked: boolean) {
    const api = this.provider.api
    try {
      this.comrade.user = yield api.user.update((this.comrade.user as UserModel).id, { blocked: blocked })

      const oldAvatarId = _.get(this.comrade.avatar, 'id')
      let newAvatarId
      if (avatarFile) {
        const res = yield api.uploadFiles(avatarFile)
        newAvatarId = _.get(res[0], 'id')
      }
      this.comrade = yield api.comarde.update(this.comrade.id, {
        ...this.comrade,
        ...comrade,
        avatar: newAvatarId
      })

      if (newAvatarId && oldAvatarId) {
        // no need wait
        api.deleteFile(oldAvatarId)
      }

      this.provider.snackbar.updateSuccess()
      return true
    } catch (error) {
      this.provider.snackbar.commonError(error)
      return false
    }
  }

  @asyncAction *deleteComrade() {
    if (yield this.provider.api.deleteComrade(this.comrade)) {
      this.provider.router.go(-1)
    }
  }

  // @action.bound roleAdded(item: PositionModel) {
  //   this.roles = [item, ...this.roles]
  // }

  // @action.bound roleUpdated(item: PositionModel) {
  //   this.roles = this.roles.map(r => (r.id === item.id ? item : r))
  // }
}

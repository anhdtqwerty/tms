import { AppProvider } from '@/app-provider'
import { UserModel } from '@/models/auth-model'
import { ComradeModel } from '@/models/comrade-model'
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

  @asyncAction *updateComrade(avatarFile: File, comrade: ComradeModel) {
    const api = this.provider.api
    try {
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
    if (
      yield this.provider.alert.confirm(
        'Xác nhận xóa',
        'Bạn có CHẮC CHẮN muốn xóa Nhân viên này? Bạn sẽ không thể hoàn tác thao tác.'
      )
    ) {
      yield Promise.all([
        this.provider.api.comarde.delete(this.comrade.id),
        this.provider.api.user.delete((this.comrade.user as UserModel).id)
      ])
      this.provider.router.go(-1)
      this.provider.snackbar.deleteSuccess()
    }
  }

  // @action.bound roleAdded(item: PositionModel) {
  //   this.roles = [item, ...this.roles]
  // }

  // @action.bound roleUpdated(item: PositionModel) {
  //   this.roles = this.roles.map(r => (r.id === item.id ? item : r))
  // }
}

import { AppProvider } from '@/app-provider'
import { UserModel } from '@/models/auth-model'
import { ComradeModel } from '@/models/comrade-model'
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
    const { api, snackbar, alert, router } = this.provider

    if (yield alert.confirmDelete('Nhân viên')) {
      try {
        const tasks = yield api.task.find<TaskModel>(
          {
            _where: {
              _or: [
                { createdBy: this.comrade.id },
                { executedComrade: this.comrade.id },
                { supportedComrades_contains: this.comrade.id },
                { supervisors_contains: this.comrade.id }
              ]
            }
          },
          { _limit: 1 }
        )

        if (tasks.length) {
          snackbar.commonDeleteError('Nhân viên')
        } else {
          yield Promise.all([api.comarde.delete(this.comrade.id), api.user.delete((this.comrade.user as UserModel).id)])
          router.go(-1)
          snackbar.deleteSuccess()
        }
      } catch (error) {
        snackbar.commonError(error)
      }
    }
  }

  // @action.bound roleAdded(item: PositionModel) {
  //   this.roles = [item, ...this.roles]
  // }

  // @action.bound roleUpdated(item: PositionModel) {
  //   this.roles = this.roles.map(r => (r.id === item.id ? item : r))
  // }
}

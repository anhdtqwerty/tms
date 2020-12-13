import { AppProvider } from '@/app-provider'
import { UserModel } from '@/models/auth-model'
import { ComradeModel } from '@/models/comrade-model'
import { PositionModel, PositionType } from '@/models/position-model'
import { action, observable } from 'mobx'
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

  @asyncAction *updateComrade(comrade: ComradeModel) {
    this.comrade = yield this.provider.api.comarde.update(this.comrade.id, {
      ...this.comrade,
      ...comrade
    })
    this.provider.snackbar.updateSuccess()
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

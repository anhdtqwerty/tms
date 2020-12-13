import { AppProvider } from '@/app-provider'
import { UserModel } from '@/models/auth-model'
import { ComradeModel } from '@/models/comrade-model'
import { DepartmentModel } from '@/models/department-model'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class DepartmentDetailViewModel {
  @observable department: DepartmentModel = null

  @observable comrades: ComradeModel[] = []
  @observable totalComrades = 0

  constructor(private provider: AppProvider) {
    this.loadData()
  }

  @asyncAction *loadData() {
    const id = this.provider.router.currentRoute.params['departmentid']
    const api = this.provider.api
    const results = yield Promise.all([api.department.findOne(id), api.comarde.find({ department: id })])
    this.department = results[0]
    this.comrades = results[1]
  }

  @action.bound departmentUpdated(model: DepartmentModel) {
    this.department = model
  }

  @asyncAction *deleteComrade(comrade: ComradeModel) {
    if (
      yield this.provider.alert.confirm(
        'Xác nhận xóa',
        'Bạn có CHẮC CHẮN muốn xóa Nhân viên này? Bạn sẽ không thể hoàn tác thao tác.'
      )
    ) {
      try {
        yield Promise.all([
          this.provider.api.comarde.delete(comrade.id),
          this.provider.api.user.delete((comrade.user as UserModel).id)
        ])
        this.provider.snackbar.deleteSuccess()
        this.comrades = this.comrades.filter(c => c.id !== comrade.id)
      } catch (error) {
        this.provider.snackbar.commonError(error)
      }
    }
  }

  @action.bound comradeAdded(comrade: ComradeModel) {
    this.comrades = [comrade, ...this.comrades]
  }

  @action.bound comradeUpdated(comrade: ComradeModel) {
    this.comrades = this.comrades.map(d => (d.id === comrade.id ? comrade : d))
  }
}

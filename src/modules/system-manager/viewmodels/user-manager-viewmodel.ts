import { AppProvider } from '@/app-provider'
import { ComradeModel } from '@/models/comrade-model'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class UserManagerViewModel {
  @observable totalCount = 0
  @observable comrades: ComradeModel[] = []

  constructor(private provider: AppProvider) {
    this.loadData()
  }

  @asyncAction *loadData() {
    const results = yield Promise.all([
      this.provider.api.comarde.count(),
      this.provider.api.comarde.find<ComradeModel>()
    ])
    this.totalCount = results[0]
    this.comrades = results[1]
  }

  @action.bound comradeAdded(item: ComradeModel) {
    this.comrades = [item, ...this.comrades]
    this.totalCount += 1
  }
}

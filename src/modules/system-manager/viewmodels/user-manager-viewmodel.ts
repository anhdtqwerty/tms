import { AppProvider } from '@/app-provider'
import { ComradeModel } from '@/models/comrade-model'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class UserManagerViewModel {
  @observable totalCount = 0
  @observable comrades: ComradeModel[] = []
  private _searchParams = {}

  constructor(private provider: AppProvider) {
    this.search()
  }

  @asyncAction *loadData() {
    const results = yield Promise.all([
      this.provider.api.comarde.count(),
      this.provider.api.comarde.find<ComradeModel>()
    ])
    this.totalCount = results[0]
    this.comrades = results[1]
  }

  @asyncAction *search(code: string = null, name: string = null, department: string = null, blocked = false) {
    const api = this.provider.api
    let input: any = {}
    if (name) input = { ...input, name_contains: name }
    if (code) input = { ...input, code_contains: code }
    if (department) input = { ...input, department }
    input = { ...input, 'user.blocked': blocked }
    this._searchParams = input
    const results = yield Promise.all([api.comarde.count(this._searchParams), api.comarde.find(this._searchParams)])
    this.totalCount = results[0]
    this.comrades = results[1]
  }

  @action.bound comradeAdded(item: ComradeModel) {
    this.comrades = [item, ...this.comrades]
    this.totalCount += 1
  }
}

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

  search(code: string = null, name: string = null, unit: string = null, department: string = null, blocked = false) {
    let input: any = {}
    if (name) input = { ...input, name_contains: name.trim() }
    if (code) input = { ...input, code_contains: code.trim() }
    if (unit) input = { ...input, unit }
    if (department) input = { ...input, department }
    if (typeof blocked === 'boolean') input = { ...input, 'user.blocked': blocked }
    this._searchParams = input
    this.searchPage()
  }

  @asyncAction *searchPage(page = 1) {
    const api = this.provider.api
    const params = { ...this._searchParams, _start: 25 * (page - 1) }
    const results = yield Promise.all([api.comarde.count(params), api.comarde.find(params)])
    this.totalCount = results[0]
    this.comrades = results[1]
  }

  @action.bound comradeAdded(item: ComradeModel) {
    this.comrades = [item, ...this.comrades]
    this.totalCount += 1
  }
}

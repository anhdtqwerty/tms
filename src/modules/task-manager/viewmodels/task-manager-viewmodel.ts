import { AppProvider } from '@/app-provider'
import { TaskModel } from '@/models/task-model'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class TaskManagerViewModel {
  @observable totalCount = 0
  @observable task: TaskModel[] = []
  private _searchParams = {}

  constructor(private provider: AppProvider) {
    this.search()
  }

  @asyncAction *loadData() {
    const results = yield Promise.all([
      this.provider.api.task.count(),
      this.provider.api.task.find<TaskModel>()
    ])
    this.totalCount = results[0]
    this.task = results[1]
  }

  @asyncAction *search(code: string = null, name: string = null) {
    const api = this.provider.api
    let input: any = {}
    if (name) input = { ...input, name_contains: name }
    if (code) input = { ...input, code_contains: code }
    this._searchParams = input
    const results = yield Promise.all([api.task.count(this._searchParams), api.task.find(this._searchParams)])
    this.totalCount = results[0]
    this.task = results[1]
  }

  @action.bound taskAdded(item: TaskModel) {
    this.task = [item, ...this.task]
    this.totalCount += 1
  }
}

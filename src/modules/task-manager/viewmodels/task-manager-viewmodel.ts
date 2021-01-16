import { AppProvider } from '@/app-provider'
import { TaskModel, TaskRouteType } from '@/models/task-model'
import { authStore } from '@/stores/auth-store'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class TaskManagerViewModel {
  @observable totalCount = 0
  @observable tasks: TaskModel[] = []
  private _searchParams = {}
  private currentRoute: TaskRouteType = null

  constructor(private provider: AppProvider) {
    this.search()
  }

  @asyncAction *loadData(val: TaskRouteType) {
    const params: any = {}
    this.currentRoute = val

    switch (val) {
      case 'task-created':
        params['createdBy'] = authStore.comrade.id
        break
      case 'task-assigned':
        params['executedComrade'] = authStore.comrade.id
        break

      default:
        break
    }

    const results = yield Promise.all([this.provider.api.task.count(), this.provider.api.task.find<TaskModel>(params)])
    this.totalCount = results[0]
    this.tasks = results[1]
  }

  @asyncAction *search(code: string = null, name: string = null) {
    const api = this.provider.api
    let input: any = {}
    if (name) input = { ...input, name_contains: name }
    if (code) input = { ...input, code_contains: code }
    this._searchParams = input
    const results = yield Promise.all([api.task.count(this._searchParams), api.task.find(this._searchParams)])
    this.totalCount = results[0]
    this.tasks = results[1]
  }

  @action.bound taskAdded(item: TaskModel) {
    this.tasks = [item, ...this.tasks]
    this.totalCount += 1
  }

  @action.bound taskUpdated(task: TaskModel) {
    this.tasks = this.tasks.map(t => (t.id === task.id ? task : t))
  }

  @action.bound taskDeleted(id: string) {
    this.tasks = this.tasks.filter(t => t.id !== id)
  }

  @action.bound taskRecovered(item: TaskModel) {
    this.loadData(this.currentRoute)
  }
}

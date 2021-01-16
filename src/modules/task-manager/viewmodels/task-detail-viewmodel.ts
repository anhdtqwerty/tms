import { AppProvider } from '@/app-provider'
import { TaskModel } from '@/models/task-model'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class TaskDetailViewModel {
  @observable subtaskTotalCount = 0
  @observable subtasks: TaskModel[] = []
  private _searchParams = {}
  @observable task: TaskModel = null

  constructor(private provider: AppProvider) {
    // this.loadData(this.provider.router.currentRoute.params['taskid'])
  }

  @asyncAction *loadData(id: string) {
    console.log('detail load data', id)
    const api = this.provider.api
    const results = yield Promise.all([api.task.findOne(id)])
    this.task = results[0]

    //subtask
    const subtasksApi = yield Promise.all([
      this.provider.api.task.count({ parent: id }),
      this.provider.api.task.find<TaskModel>({ parent: id })
    ])
    this.subtaskTotalCount = subtasksApi[0]
    this.subtasks = subtasksApi[1]
  }

  @asyncAction *search(code: string = null, name: string = null) {
    const api = this.provider.api
    let input: any = {}
    if (name) input = { ...input, name_contains: name }
    if (code) input = { ...input, code_contains: code }
    this._searchParams = input
    const results = yield Promise.all([api.task.count(this._searchParams), api.task.find(this._searchParams)])
    this.subtaskTotalCount = results[0]
    this.subtasks = results[1]
  }

  @action.bound taskUpdated(item: TaskModel) {
    if (item.id === this.task.id) {
      // task parent
      this.task = item
    } else {
      this.subtasks = this.subtasks.map(t => (t.id === item.id ? item : t))
    }
  }

  @action.bound taskAdded(item: TaskModel) {
    this.subtasks = [item, ...this.subtasks]
    this.subtaskTotalCount += 1
  }

  @action.bound taskDeleted(id: string) {
    if (id === this.task.id) {
      // task parent
      this.provider.router.back()
    } else {
      this.subtasks = this.subtasks.filter(t => t.id !== id)
    }
  }
}

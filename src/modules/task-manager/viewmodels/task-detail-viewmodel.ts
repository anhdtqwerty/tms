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
    this.loadData()
  }

  @asyncAction *loadData() {
    const id = this.provider.router.currentRoute.params['taskid']
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

  @action.bound taskUpdated(task: TaskModel) {
    this.task = task
  }

  @action.bound taskAdded(item: TaskModel) {
    console.log('taskAdded ' + item)
    this.subtasks = [item, ...this.subtasks]
    this.subtaskTotalCount += 1
  }
}

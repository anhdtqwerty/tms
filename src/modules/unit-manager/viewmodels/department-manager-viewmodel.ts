import { AppProvider } from '@/app-provider'
import { DepartmentModel } from '@/models/department-model'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class DepartmentManagerViewModel {
  @observable departments: DepartmentModel[] = []
  @observable totalDepartment = 0
  private _searchParams = {}

  constructor(private provider: AppProvider) {
    this.search()
  }

  @asyncAction *search(title: string = null, unitCode: string = null, code: string = null) {
    const api = this.provider.api
    let input: any = {}
    if (title) input = { ...input, title_contains: title }
    if (unitCode) input = { ...input, 'unit.code_contains': unitCode }
    if (code) input = { ...input, code_contains: code }
    this._searchParams = input
    const results = yield Promise.all([
      api.department.count(this._searchParams),
      this.provider.api.department.find({ ...this._searchParams, _limit: 25, _sort: 'created_at:DESC' })
    ])
    this.totalDepartment = results[0]
    this.departments = results[1]
  }

  @action.bound departmentAdded(department: DepartmentModel) {
    this.departments = [department, ...this.departments]
  }

  @action.bound departmentUpdated(department: DepartmentModel) {
    this.departments = this.departments.map(d => (d.id === department.id ? department : d))
  }
}

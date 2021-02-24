import { AppProvider } from '@/app-provider'
import { ComradeModel } from '@/models/comrade-model'
import { DepartmentModel } from '@/models/department-model'
import { UnitModel } from '@/models/unit-model'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class UnitDetailViewModel {
  @observable unit: UnitModel = null

  @observable departments: DepartmentModel[] = []
  @observable comrades: ComradeModel[] = []
  @observable departmentCount = 0
  @observable comradeCount = 0

  constructor(private provider: AppProvider) {
    this.loadData()
  }

  @asyncAction *loadData() {
    const unitid = this.provider.router.currentRoute.params['unitid']
    const api = this.provider.api
    this.unit = yield api.unit.findOne(unitid)
    this.getDepartmentPage()
    this.getComradePage()
  }

  @asyncAction *getDepartmentPage(page = 1) {
    const api = this.provider.api
    const params = { unit: this.unit.id, _start: 25 * (page - 1) }
    const results = yield Promise.all([api.department.count(params), api.department.find(params)])
    this.departmentCount = results[0]
    this.departments = results[1]
  }

  @asyncAction *getComradePage(page = 1) {
    const api = this.provider.api
    const params = { unit: this.unit.id, _start: 25 * (page - 1) }
    const results = yield Promise.all([api.comarde.count(params), api.comarde.find(params)])
    this.comradeCount = results[0]
    this.comrades = results[1]
  }

  @action.bound unitUpdated(unit: UnitModel) {
    this.unit = unit
  }

  @action.bound departmentAdded(department: DepartmentModel) {
    this.departments = [department, ...this.departments]
  }

  @action.bound departmentUpdated(department: DepartmentModel) {
    this.departments = this.departments.map(d => (d.id === department.id ? department : d))
  }

  @asyncAction *deleteDepartment(department: DepartmentModel) {
    if (yield this.provider.api.deleteDepartment(department)) {
      this.departments = this.departments.filter(d => d.id !== department.id)
    }
  }

  @action.bound comradeAdded(comrade: ComradeModel) {
    this.comrades = [comrade, ...this.comrades]
  }

  @asyncAction *deleteComrade(comrade: ComradeModel) {
    if (yield this.provider.api.deleteComrade(comrade)) {
      this.comrades = this.comrades.filter(c => c.id !== comrade.id)
    }
  }
}

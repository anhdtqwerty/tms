import { AppProvider } from '@/app-provider'
import { DepartmentModel } from '@/models/department-model'
import { UnitModel } from '@/models/unit-model'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class UnitDetailViewModel {
  @observable unit: UnitModel = null

  @observable departments: DepartmentModel[] = []

  constructor(private provider: AppProvider) {
    this.loadData()
  }

  @asyncAction *loadData() {
    const unitid = this.provider.router.currentRoute.params['unitid']
    const api = this.provider.services.api
    this.unit = yield api.unit.findOne(unitid)
    this.departments = this.unit.departments as DepartmentModel[]
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
}

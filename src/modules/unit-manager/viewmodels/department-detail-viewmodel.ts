import { AppProvider } from '@/app-provider'
import { UserModel } from '@/models/auth-model'
import { ComradeModel } from '@/models/comrade-model'
import { DepartmentModel } from '@/models/department-model'
import { RequestModel } from '@/models/request-model'
import { TaskModel } from '@/models/task-model'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class DepartmentDetailViewModel {
  @observable department: DepartmentModel = null

  @observable comrades: ComradeModel[] = []
  @observable totalComrades = 0

  constructor(private provider: AppProvider) {
    this.loadData()
  }

  @asyncAction *loadData() {
    const id = this.provider.router.currentRoute.params['departmentid']
    const api = this.provider.api
    const results = yield Promise.all([api.department.findOne(id), api.comarde.find({ department: id })])
    this.department = results[0]
    this.comrades = results[1]
  }

  @action.bound departmentUpdated(model: DepartmentModel) {
    this.department = model
  }

  @asyncAction *deleteComrade(comrade: ComradeModel) {
    const { api, snackbar, alert, router } = this.provider

    if (yield alert.confirmDelete('Nhân viên')) {
      try {
        if (!comrade.department && !comrade.unit && !comrade.position) {
          const tasks = yield api.task.find<TaskModel>(
            {
              _where: {
                _or: [
                  { createdBy: comrade.id },
                  { executedComrade: comrade.id },
                  { supportedComrades_contains: comrade.id },
                  { supervisors_contains: comrade.id }
                ]
              }
            },
            { _limit: 1 }
          )

          if (!tasks.length) {
            const request = yield api.request.find<RequestModel>(
              {
                _where: {
                  _or: [{ requestor: comrade.id }, { approver: comrade.id }]
                }
              },
              { _limit: 1 }
            )

            if (!request.length) {
              yield Promise.all([api.comarde.delete(comrade.id), api.user.delete((comrade.user as UserModel).id)])
              router.go(-1)
              snackbar.deleteSuccess()
            } else {
              snackbar.commonDeleteError('Nhân viên')
            }
          } else {
            snackbar.commonDeleteError('Nhân viên')
          }
        } else {
          snackbar.commonDeleteError('Nhân viên')
        }
      } catch (error) {
        snackbar.commonError(error)
      }
    }
  }

  @action.bound comradeAdded(comrade: ComradeModel) {
    this.comrades = [comrade, ...this.comrades]
  }

  @action.bound comradeUpdated(comrade: ComradeModel) {
    this.comrades = this.comrades.map(d => (d.id === comrade.id ? comrade : d))
  }
}

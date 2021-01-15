import { AppProvider } from '@/app-provider'
import { flatStats, TaskStatModel } from '@/models/report-model'
import { RequestModel } from '@/models/request-model'
import { TaskModel, taskStateNameMap, taskStateNames, TaskStateType } from '@/models/task-model'
import { action, computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class DashboardViewModel {
  @observable unupdatedTasks: TaskModel[] = []
  @observable updateTaskHistory: RequestModel[] = []

  @observable topStats: TaskStatModel[] = []

  @observable unitStats: TaskStatModel[] = []
  @observable personalStat: TaskStatModel = null

  @observable taskStateFilter: TaskStateType = 'doing'

  constructor(private provider: AppProvider) {
    this.loadTop()
    this.loadUnupdatedTasks()
    this.loadUpdateTaskHistory()
  }

  @asyncAction *loadTop() {
    const { api, authStore } = this.provider
    let results: TaskStatModel[] = []
    if (authStore.isLeader) {
      const params = authStore.unitParams
      if (params.department) {
        // nothing
      } else if (params.unit) {
        results = yield api.getDepartmentsTaskReport({ unit: params.unit })
      } else {
        results = yield api.getUnitsTaskReport()
      }
    } else {
      results = yield api.getComradeTaskReport({ id: authStore.comrade.id })
      results = results.filter(x => x.id === authStore.comrade.id)
    }
    this.topStats = results
  }

  @asyncAction *loadUnitStats(from: string, to: string) {
    const { api, authStore } = this.provider
    let results: TaskStatModel[] = []
    const params = authStore.unitParams
    if (params.department) {
      // nothing
    } else if (params.unit) {
      results = yield api.getDepartmentsTaskReport({ from, to, unit: params.unit })
    } else {
      results = yield api.getUnitsTaskReport({ from, to })
    }
    this.unitStats = results
  }

  @asyncAction *loadPersonalStats(from: string, to: string) {
    const { api, authStore } = this.provider
    if (!authStore.isLeader) {
      const results: TaskStatModel[] = yield api.getComradeTaskReport({ from, to, id: authStore.comrade.id })
      this.personalStat = results.find(r => r.id === authStore.comrade.id)
    }
  }

  @asyncAction *loadUnupdatedTasks() {
    const { api, authStore } = this.provider
    if (!authStore.isLeader) {
      const state: TaskStateType = 'waiting'
      this.unupdatedTasks = yield api.task.find({ executedComrade: authStore.comrade.id, state })
    }
  }

  @asyncAction *loadUpdateTaskHistory() {
    const { api, authStore } = this.provider
    if (authStore.isLeader) {
      const unitParams = authStore.unitParams
      const params: any = {}
      if (unitParams.department) {
        params['requestor.department'] = unitParams.department
      } else if (unitParams.unit) {
        params['requestor.unit'] = unitParams.unit
      }
      this.updateTaskHistory = yield api.request.find(params)
    } else {
      this.updateTaskHistory = yield api.request.find({ executedComrade: authStore.comrade.id })
    }
  }

  @action.bound changeTaskStateFilter(val: TaskStateType) {
    this.taskStateFilter = val
  }

  @computed get topStatCriterias() {
    return flatStats(this.topStats)
  }

  @computed get unitTaskChart(): { options: ApexCharts.ApexOptions; series: ApexAxisChartSeries } {
    if (this.unitStats.length === 0) return null
    return {
      options: {
        xaxis: {
          categories: this.unitStats.map(s => s.title)
        }
      },
      series: [
        {
          data: this.unitStats.map(s => {
            if (this.taskStateFilter === 'doing') {
              return s.doing
            } else if (this.taskStateFilter === 'done') {
              return s.done
            }
            return s.total
          }),
          name: ''
        }
      ]
    }
  }

  @computed get personalTaskChart(): { options: ApexCharts.ApexOptions; series: ApexNonAxisChartSeries } {
    const stat = this.personalStat
    if (!stat) return null
    const result = {
      options: {
        labels: ['Chờ xác nhận', 'Trong hạn', 'Đã hoàn thành', 'Quá hạn'],
        legend: {
          itemMargin: {
            vertical: 8
          }
        }
      },
      series: [stat.aprroving ?? 0, stat.doing - stat.doingOutDate ?? 0, stat.done ?? 0, stat.doneOutDate ?? 0]
    }
    return result
  }
}

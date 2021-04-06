import { AppProvider } from '@/app-provider'
import { flatStats, TaskStatModel } from '@/models/report-model'
import { RequestModel } from '@/models/request-model'
import { TaskDeadlineType, TaskModel, taskStateNameMap, taskStateNames, TaskStateType } from '@/models/task-model'
import _ from 'lodash'
import { action, computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import moment from 'moment'

export class DashboardLeaderViewModel {
  @observable topStats: TaskStatModel[] = []

  @observable unupdatedTasks: TaskModel[] = []
  @observable updateTaskHistory: RequestModel[] = []
  @observable personalHistoryFilter: 'new' | 'expired' = 'new'

  @observable taskStateFilter: TaskStateType = 'doing'
  @observable unitStats: TaskStatModel[] = []

  @observable personalStat: TaskStatModel = null

  constructor(private provider: AppProvider) {
    this.loadTop()
    this.loadUpdateTaskHistory()
  }

  @asyncAction *loadTop() {
    const { api, authStore } = this.provider
    let results: TaskStatModel[] = []
    const { department, unit } = authStore.unitParams
    if (department) {
      results = yield api.getDepartmentsTaskReport({ department })
    } else if (unit) {
      results = yield api.getDepartmentsTaskReport({ unit })
    } else {
      results = yield api.getUnitsTaskReport()
    }
    this.topStats = results
  }

  @asyncAction *loadUnitStats(from: string, to: string) {
    console.log('loadUnitStats')
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

  @asyncAction *loadUpdateTaskHistory() {
    const { api, authStore } = this.provider
    const unitParams = authStore.unitParams
    const params: any = { _limit: 10 }
    if (unitParams.department) {
      params['requestor.department'] = unitParams.department
    } else if (unitParams.unit) {
      params['requestor.unit'] = unitParams.unit
    }
    this.updateTaskHistory = yield api.request.find(params)
  }

  @action.bound changeTaskStateFilter(val: TaskStateType) {
    this.taskStateFilter = val
  }

  @action.bound changePersonalHistoryFilter(val: any) {
    if (this.personalHistoryFilter !== val) {
      this.personalHistoryFilter = val
      this.loadUpdateTaskHistory()
    }
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
              return s.doing + s.doingOutDate
            } else if (this.taskStateFilter === 'done') {
              return s.done + s.doneOutDate
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

  @computed get topStatCriterias() {
    const stats = flatStats(this.topStats)
    return stats
  }
}

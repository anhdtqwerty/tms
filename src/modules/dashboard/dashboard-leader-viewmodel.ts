import { AppProvider } from '@/app-provider'
import { flatStats, mergeStatList, TaskStatCriteria, TaskStatModel } from '@/models/report-model'
import { RequestModel } from '@/models/request-model'
import { TaskDeadlineType, TaskModel, taskStateNameMap, taskStateNames, TaskStateType } from '@/models/task-model'
import _, { isNumber, uniqBy } from 'lodash'
import { action, computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import moment from 'moment'

export class DashboardLeaderViewModel {
  @observable topStats: TaskStatCriteria = {}
  @observable totalExecuted = 0
  @observable totalCreated = 0

  @observable updateTaskHistory: RequestModel[] = []
  @observable personalHistoryFilter: 'new' | 'expired' = 'new'

  @observable taskStateFilter: TaskStateType = 'doing'
  @observable unitStats: TaskStatModel[] = []

  constructor(private provider: AppProvider) {
    this.loadTop()
    this.loadUpdateTaskHistory()
  }

  @asyncAction *loadTop() {
    const { api, authStore } = this.provider
    let createds: TaskStatModel[] = []
    let executeds: TaskStatModel[] = []
    const { department, unit } = authStore.unitParams
    if (department) {
      createds = yield api.getDepartmentsTaskReport({ department, joinBy: 'createdComrade' })
      executeds = yield api.getDepartmentsTaskReport({ department, joinBy: 'executedComrade' })
    } else if (unit) {
      createds = yield api.getDepartmentsTaskReport({
        unit,
        joinDepartmentBy: 'createdDepartment',
        joinBy: 'createdComrade'
      })
      executeds = yield api.getDepartmentsTaskReport({
        unit,
        joinDepartmentBy: 'executedDepartment',
        joinBy: 'executedComrade'
      })
    } else {
      // results = yield api.getUnitsTaskReport()
      createds = yield api.getUnitsTaskReport({ joinBy: 'createdUnit' })
      executeds = yield api.getUnitsTaskReport({ joinBy: 'executedUnit' })
    }
    console.log(createds, executeds)
    this.totalCreated = flatStats(createds).total
    this.totalExecuted = flatStats(executeds).total
    const results = mergeStatList(createds, executeds)
    this.topStats = flatStats(results)
  }

  @asyncAction *loadUnitStats(from: string, to: string) {
    const { api, authStore } = this.provider
    let results: TaskStatModel[] = []
    const params = authStore.unitParams
    if (params.department) {
      console.log('loadUnitStats department')

      // nothing
    } else if (params.unit) {
      console.log('loadUnitStats unit')

      results = yield api.getDepartmentsTaskReport({ from, to, unit: params.unit })
    } else {
      console.log('loadUnitStats ministry')

      const createds = yield api.getUnitsTaskReport({ from, to, joinBy: 'createdUnit' })
      results = yield api.getUnitsTaskReport({ from, to, joinBy: 'executedUnit' })
      // console.log(createds, results)
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

  @computed get topDoing() {
    return this.topStats.doing + this.topStats.aprroving ?? 0
  }

  @computed get topDoingOutDate() {
    return this.topStats.doingOutDate + this.topStats.aprrovingOutDate ?? 0
  }

  @computed get topDone() {
    return this.topStats.doing + this.topStats.aprroving ?? 0
  }

  @computed get topDoneOutDate() {
    return this.topStats.aprrovingOutDate ?? 0
  }

  @computed get topOutOfDate() {
    const { todoOutDate, doingOutDate, waitingOutDate, aprrovingOutDate, recoveredOutDate } = this.topStats
    return todoOutDate + doingOutDate + waitingOutDate + aprrovingOutDate + recoveredOutDate
  }
}

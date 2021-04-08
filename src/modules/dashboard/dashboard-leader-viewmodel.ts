import { AppProvider } from '@/app-provider'
import { flatStats, mergeStatList, TaskStatCriteria, TaskStatModel } from '@/models/report-model'
import { RequestModel } from '@/models/request-model'
import { TaskModel, TaskStateType, taskTypeToFilterParams } from '@/models/task-model'
import { isNaN, isNumber } from 'lodash'
import { action, computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class DashboardLeaderViewModel {
  @observable topStats: TaskStatCriteria = {}
  @observable totalExecuted = 0
  @observable totalCreated = 0

  @observable updateTaskHistory: RequestModel[] = []
  @observable latestTasks: TaskModel[] = []
  @observable personalHistoryFilter: 'new' | 'expired' = 'new'

  @observable taskStateFilter: TaskStateType = 'doing'
  @observable unitStats: TaskStatModel[] = []

  constructor(private provider: AppProvider) {
    this.loadTop()
    this.loadUpdateTaskHistory()
  }

  @asyncAction *loadTop() {
    const { createds, executeds } = yield this.getTaskStats()
    this.totalCreated = flatStats(createds)?.total ?? 0
    this.totalExecuted = flatStats(executeds)?.total ?? 0
    const results = mergeStatList(createds, executeds)
    this.topStats = flatStats(results)
  }

  async getTaskStats(options: { hasExecuteds: boolean; from?: string; to?: string } = { hasExecuteds: true }) {
    const { hasExecuteds, from, to } = options
    const { api, authStore } = this.provider
    let createds: TaskStatModel[] = []
    let executeds: TaskStatModel[] = []
    const { department, unit, ministry } = authStore.unitParams
    if (department) {
      createds = await api.getComradeTaskReport({
        department,
        joinDepartmentBy: 'createdDepartment',
        joinBy: 'createdBy',
        from,
        to
      })
      executeds = !hasExecuteds
        ? []
        : await api.getDepartmentsTaskReport({
            unit,
            joinUnitBy: 'executedUnit',
            joinBy: 'executedComrade',
            from,
            to
          })
      executeds = executeds.filter(t => t.id === department)
    } else if (unit) {
      createds = await api.getDepartmentsTaskReport({
        unit,
        joinUnitBy: 'createdUnit',
        joinBy: 'createdBy',
        from,
        to
      })
      executeds = !hasExecuteds ? [] : await api.getUnitsTaskReport({ joinUnitBy: 'createdUnit', ministry })
      executeds = executeds.filter(t => t.id === unit)
    } else if (ministry) {
      createds = await api.getUnitsTaskReport({ joinUnitBy: 'createdUnit', ministry, from, to })
    }
    return { createds, executeds }
  }

  @asyncAction *loadUnitStats(from: string, to: string) {
    const { createds } = yield this.getTaskStats({ from, to, hasExecuteds: false })
    this.unitStats = createds
  }

  @asyncAction *loadUpdateTaskHistory() {
    const { api } = this.provider
    this.latestTasks = yield api.task.find(
      {
        _where: [taskTypeToFilterParams('task-created'), { requests_null: false }]
      },
      { _limit: 10, _sort: 'updated_at:DESC' }
    )
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
            switch (this.taskStateFilter) {
              case 'waiting':
                return s.waiting + s.waitingOutDate
              case 'todo':
                return s.todo + s.todoOutDate
              case 'doing':
                return s.doing + s.doingOutDate
              case 'done':
                return s.done + s.doneOutDate
              case 'recovered':
                return s.recovered + s.recoveredOutDate
            }
          }),
          name: ''
        }
      ]
    }
  }

  @computed get topTotalDoing() {
    return this.topDoing + this.topDoingOutDate
  }
  @computed get topDoing() {
    const { doing, approving } = this.topStats
    const value = doing + approving
    return !isNaN(value) ? value : 0
  }
  @computed get topDoingOutDate() {
    const { doingOutDate, approvingOutDate } = this.topStats
    const value = doingOutDate + approvingOutDate
    return !isNaN(value) ? value : 0
  }
  @computed get topTotalDone() {
    const value = this.topDone + this.topDoneOutDate
    return !isNaN(value) ? value : 0
  }
  @computed get topDone() {
    const value = this.topStats.done
    return !isNaN(value) ? value : 0
  }
  @computed get topDoneOutDate() {
    const value = this.topStats.doneOutDate
    return !isNaN(value) ? value : 0
  }
  @computed get topOutOfDate() {
    const { todoOutDate, doingOutDate, waitingOutDate, approvingOutDate } = this.topStats
    const value = todoOutDate + doingOutDate + waitingOutDate + approvingOutDate
    return !isNaN(value) ? value : 0
  }
}

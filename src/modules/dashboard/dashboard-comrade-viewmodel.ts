import { AppProvider } from '@/app-provider'
import { ConfigModel } from '@/models/config-model'
import { flatStats, mergeStatList, TaskStatCriteria, TaskStatModel } from '@/models/report-model'
import { RequestModel } from '@/models/request-model'
import { getComradeTaskStats, TaskStatsResult } from '@/models/task-business'
import {
  TaskDeadlineType,
  TaskModel,
  taskStateNameMap,
  taskStateNames,
  TaskStateType,
  taskTypeToFilterParams
} from '@/models/task-model'
import _, { first, sum } from 'lodash'
import { action, computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import moment from 'moment'

export class DashboardComradeViewModel {
  @observable topStats: TaskStatCriteria = {}
  @observable totalExecuted = 0
  @observable totalCreated = 0

  @observable unupdatedTasks: TaskModel[] = []
  @observable latestTasks: TaskModel[] = []
  @observable lastTaskFilter: 'new' | 'expired' | 'expired_soon' = 'new'

  @observable taskStateFilter: TaskStateType = 'doing'
  @observable unitStats: TaskStatModel[] = []

  @observable personalStat: TaskStatModel = null

  constructor(private provider: AppProvider) {
    this.loadTop()
    this.loadUnupdatedTasks()
    this.loadUpdateTaskHistory()
  }

  @asyncAction *loadTop() {
    const { createds, assigneds }: TaskStatsResult = yield getComradeTaskStats()
    this.totalCreated = first(createds)?.total ?? 0
    this.totalExecuted = first(assigneds)?.total ?? 0
    const results = mergeStatList(createds, assigneds)
    this.topStats = flatStats(results)
  }

  @asyncAction *loadUnupdatedTasks() {
    const { api } = this.provider
    const config: ConfigModel = yield api.getConfig()
    const max = moment().add(config.data?.earlyExpiredDays ?? 10, 'd')
    const moreParam = {
      type: 'hasDeadline',
      expiredDate_gte: moment().format('YYYY-MM-DD'),
      expiredDate_lt: max.format('YYYY-MM-DD')
    }
    const executedParams: any[] = [...taskTypeToFilterParams('task-assigned'), moreParam]
    this.unupdatedTasks = yield api.task.find({ _where: executedParams }, { _limit: 10 })
  }

  @asyncAction *loadUpdateTaskHistory() {
    try {
      const { api } = this.provider
      const executedParams: any[] = [...taskTypeToFilterParams('task-assigned')]
      let moreParam = {}
      switch (this.lastTaskFilter) {
        case 'new':
          break
        case 'expired':
          moreParam = {
            type: 'hasDeadline',
            expiredDate_lt: moment().format('YYYY-MM-DD')
          }
          executedParams.push(moreParam)
          break
        case 'expired_soon':
          const config: ConfigModel = yield api.getConfig()
          const max = moment().add(config.data?.earlyExpiredDays ?? 10, 'd')
          moreParam = {
            type: 'hasDeadline',
            expiredDate_gte: moment().format('YYYY-MM-DD'),
            expiredDate_lt: max.format('YYYY-MM-DD')
          }
          executedParams.push(moreParam)
          break
      }
      this.latestTasks = yield api.task.find(
        executedParams.length === 1 ? executedParams[0] : { _where: executedParams },
        {
          _limit: 5,
          _sort: 'updated_at:DESC'
        }
      )
    } catch (error) {
      console.error(error)
    }
  }

  @action.bound changeTaskStateFilter(val: TaskStateType) {
    this.taskStateFilter = val
  }

  @action.bound changeLatestTaskType(val: any) {
    if (this.lastTaskFilter !== val) {
      this.lastTaskFilter = val
      this.loadUpdateTaskHistory()
    }
  }

  @asyncAction *loadPersonalStats(from: string, to: string) {
    const { assigneds }: TaskStatsResult = yield getComradeTaskStats({ hasAssigneds: true, from, to })
    this.personalStat = first(assigneds)
  }

  @computed get personalTaskChart(): { options: ApexCharts.ApexOptions; series: ApexNonAxisChartSeries } {
    const stat = this.personalStat
    if (!stat) return null
    const doing = stat.doing + stat.waiting + stat.todo
    const outofdate = stat.todoOutDate + stat.doingOutDate + stat.waitingOutDate
    const approving = stat.approving + stat.approvingOutDate
    const done = stat.done + stat.doneOutDate
    const result = {
      options: {
        labels: ['Trong hạn', 'Quá hạn', 'Chờ phê duyệt', 'Đã hoàn thành'],
        legend: {
          itemMargin: {
            vertical: 8
          }
        }
      },
      series: [doing, outofdate, approving, done]
    }
    return result
  }

  @computed get personalHasData() {
    return sum(this.personalTaskChart?.series ?? [])
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

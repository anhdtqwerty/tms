import { AppProvider } from '@/app-provider'
import { ConfigModel } from '@/models/config-model'
import { flatStats, mergeStatList, TaskStatCriteria, TaskStatModel } from '@/models/report-model'
import { RequestModel } from '@/models/request-model'
import { getLeaderTaskStats, TaskStatsResult } from '@/models/task-business'
import { TaskModel, TaskStateType, taskTypeToFilterParams } from '@/models/task-model'
import _, { uniqBy } from 'lodash'
import { isNaN } from 'lodash'
import { action, computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import moment from 'moment'

export class DashboardLeaderViewModel {
  @observable topStats: TaskStatCriteria = {}
  @observable totalExecuted = 0
  @observable totalCreated = 0

  @observable updateTaskHistory: RequestModel[] = []
  @observable latestTasks: TaskModel[] = []
  @observable lastTaskFilter: 'new' | 'expired' | 'expired_soon' = 'new'

  @observable taskStateFilter: TaskStateType = 'doing'
  @observable unitStats: TaskStatModel[] = []

  constructor(private provider: AppProvider) {
    this.loadTop()
    this.loadUpdateTaskHistory()
  }

  @asyncAction *loadTop() {
    const { createds, assigneds }: TaskStatsResult = yield getLeaderTaskStats()
    this.totalCreated = flatStats(createds)?.total ?? 0
    this.totalExecuted = flatStats(assigneds)?.total ?? 0
    const results = mergeStatList(createds, assigneds)
    this.topStats = flatStats(results)
  }

  @asyncAction *loadUnitStats(from: string, to: string) {
    const { createds }: TaskStatsResult = yield getLeaderTaskStats({ from, to, hasCreateds: true })
    this.unitStats = createds
  }

  @asyncAction *loadUpdateTaskHistory(): Generator<any> {
    try {
      const { api } = this.provider
      const createdsParams: any[] = [...taskTypeToFilterParams('task-created')]
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
          createdsParams.push(moreParam)
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
          createdsParams.push(moreParam)
          executedParams.push(moreParam)
          break
      }
      const results: any = yield Promise.all([
        api.task.find<TaskStatModel[]>(
          { _where: [...createdsParams] },
          {
            _limit: 5,
            _sort: 'updated_at:DESC'
          }
        ),
        api.task.find<TaskStatModel[]>(
          { _where: [...executedParams] },
          {
            _limit: 5,
            _sort: 'updated_at:DESC'
          }
        )
      ])
      this.latestTasks = uniqBy([...results[0], ...results[1]], t => t.id)
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

  @computed get unitTaskChart(): { options: ApexCharts.ApexOptions; series: ApexAxisChartSeries } {
    if (!this.unitStats || this.unitStats.length === 0) return null
    const data = {
      options: {
        xaxis: {
          categories: this.unitStats.map(s => s.title || s.name || '')
        }
      },
      series: [
        {
          data: this.unitStats.map(s => {
            switch (this.taskStateFilter) {
              case 'waiting':
                return s.waiting + s.waitingOutDate
              case 'doing':
                return s.doing + s.doingOutDate + s.approving + s.approvingOutDate
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
    return data
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

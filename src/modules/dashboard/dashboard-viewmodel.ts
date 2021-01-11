import { AppProvider } from '@/app-provider'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { timer } from 'rxjs'
import { take } from 'rxjs/operators'

export class DashboardViewModel {
  @observable unitTaskChart: { options: ApexCharts.ApexOptions; series: ApexAxisChartSeries } = null
  @observable personalTaskChart: { options: ApexCharts.ApexOptions; series: ApexNonAxisChartSeries } = null

  @observable totalTask = 320
  @observable doingTask = 160
  @observable intimeDoingTask = 150
  @observable outtimeDoingTask = 10
  @observable doneTask = 100
  @observable intimeDoneTask = 99
  @observable outtimeDoneTask = 1
  @observable outtimeTask = 60

  @observable unupdatedTasks: string[] = []
  @observable updatedTasks: { title: string; updatedDate: string; updatedComrade: string }[] = []
  @observable updatedTaskFilter: 'new' | 'soon_expired' | 'exipred' = 'new'

  constructor(private provider: AppProvider) {
    this.loadData()
  }

  @asyncAction *loadData() {
    yield timer(1000)
      .pipe(take(1))
      .toPromise()
    this.unitTaskChart = {
      options: {
        xaxis: {
          categories: ['Vụ tài chính', 'Vụ Kế hoạch Đầu tư', 'Thanh tra Bộ', 'Vụ An Toàn Giao Thông']
        }
      },
      series: [
        {
          data: [30, 40, 45, 50]
        }
      ]
    }
    this.personalTaskChart = {
      options: {
        labels: ['Vụ tài chính', 'Vụ Kế hoạch Đầu tư', 'Thanh tra Bộ', 'Vụ An Toàn Giao Thông'],
        legend: {
          itemMargin: {
            vertical: 8
          }
        }
      },
      series: [30, 40, 45, 50]
    }
    this.updatedTasks = [
      { title: 'Nhiệm vụ 1', updatedDate: '21/10/2020', updatedComrade: 'Huyền' },
      { title: 'Nhiệm vụ 2', updatedDate: '21/10/2020', updatedComrade: 'Huyền' },
      { title: 'Nhiệm vụ 3', updatedDate: '21/10/2020', updatedComrade: 'Huyền' },
      { title: 'Nhiệm vụ 4', updatedDate: '21/10/2020', updatedComrade: 'Huyền' },
      { title: 'Nhiệm vụ 5', updatedDate: '21/10/2020', updatedComrade: 'Huyền' }
    ]
    this.unupdatedTasks = ['Nhiệm vụ a', 'Nhiệm vụ b', 'Nhiệm vụ c']
  }

  @action changeUpdatedTaskFilter(val: any) {
    this.updatedTaskFilter = val
  }
}

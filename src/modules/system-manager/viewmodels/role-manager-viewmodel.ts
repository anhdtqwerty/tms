import { AppProvider } from '@/app-provider'
import { PositionModel } from '@/models/position-model'
import { observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { timer } from 'rxjs'
import { first } from 'rxjs/operators'

export class RoleManagerViewModel {
  @observable roles: PositionModel[] = []

  constructor(private provider: AppProvider) {
    this.loadData()
  }

  @asyncAction *loadData() {
    yield timer(300)
      .pipe(first())
      .toPromise()
    this.roles = [
      {
        title: 'Lãnh đạo',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore... '
      },
      {
        title: 'Trưởng phòng ban',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore... '
      },
      {
        title: 'Quản lý phòng ban',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore... '
      },
      {
        title: 'Quản lý dự án',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore... '
      },
      {
        title: 'Chuyên viên theo dõi',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore... '
      },
      {
        title: 'Chuyên viên thực hiện',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore... '
      },
      {
        title: 'Nhân viên',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore... '
      }
    ]
    // const users = yield this.provider.services.api.user.fetch()
    // const users = yield this.provider.services.api.comarde.fetch()
    // console.log(users)
  }
}

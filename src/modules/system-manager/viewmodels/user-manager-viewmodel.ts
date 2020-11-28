import { AppProvider } from '@/app-provider'
import { UserModel } from '@/models/auth-model'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { timer } from 'rxjs'
import { first } from 'rxjs/operators'

export class UserManagerViewModel {
  @observable users: UserModel[] = []

  constructor(private provider: AppProvider) {
    this.loadData()
  }

  @asyncAction *loadData() {
    yield timer(300)
      .pipe(first())
      .toPromise()
    this.users = [
      {
        id: 'user1',
        comrade: 'HEHE',
        position: 'HEHHE',
        status: 'ccc',
        department: 'HEHE',
        name: 'HEHE'
      },
      {
        id: 'user2',
        comrade: 'HEHE',
        position: 'HEHHE',
        status: 'ccc',
        department: 'HEHE',
        name: 'HEHE'
      },
      {
        id: 'user3',
        comrade: 'HEHE',
        position: 'HEHHE',
        status: 'ccc',
        department: 'HEHE',
        name: 'HEHE'
      }
    ]
    // const users = yield this.provider.services.api.user.fetch()
    // const users = yield this.provider.services.api.comarde.fetch()
    // console.log(users)
  }
}

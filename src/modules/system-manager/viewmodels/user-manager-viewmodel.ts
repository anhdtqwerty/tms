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
    this.users = yield this.provider.api.user.find()
  }
}

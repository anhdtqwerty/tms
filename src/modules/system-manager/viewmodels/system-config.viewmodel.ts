import { AppProvider } from '@/app-provider'
import { observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

interface SystemConfigModel {
  data: any
}

export class SystemConfigViewModel {
  @observable config: SystemConfigModel = null

  constructor(private provider: AppProvider) {
    this.loadData()
  }

  @asyncAction *loadData() {
    const { api } = this.provider
    this.config = yield api.configs.findOne(undefined)
  }
}

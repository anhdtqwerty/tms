import { action, observable, reaction, when } from 'mobx'

export interface AlertConfig {
  title?: string
  message?: string
  callback?: (ok: boolean) => void
}

export class AlertController {
  @observable show = false
  @observable config: AlertConfig = {}

  constructor() {
    //
  }

  @action.bound changeShow(value: boolean) {
    this.show = value
  }

  @action confirm(title: string, message: string): Promise<boolean> {
    this.config = { title, message }
    this.show = true
    return new Promise(resolve => {
      this.config.callback = ok => {
        resolve(ok)
      }
    })
  }

  @action.bound ok() {
    this.show = false
    this.config.callback(true)
  }

  @action.bound cancel() {
    this.show = false
    this.config.callback(false)
  }
}

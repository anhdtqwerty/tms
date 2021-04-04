import { AppProvider } from '@/app-provider'
import { ComradeModel } from '@/models/comrade-model'
import { action, observable, reaction } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { taskRouteNameMap } from '@/models/task-model'

export class MenuViewModel {
  @observable selected = false
  icon: string
  children: MenuViewModel[]
  link: string
  permission: string | string[]

  constructor(
    public title: string,
    options?: { icon?: string; children?: MenuViewModel[]; link?: string; permission?: string | string[] }
  ) {
    this.icon = options?.icon
    this.children = options?.children
    this.link = options?.link
    this.permission = options?.permission
  }

  @action.bound changeSelected(value: boolean) {
    this.selected = value
  }
}

export class MainContainerViewModel {
  @observable loading = false
  @observable drawer = true
  @observable menuConfigs: MenuViewModel[] = [
    new MenuViewModel('Trang chủ', { icon: 'dashboard', link: '/dashboard' }),
    new MenuViewModel('Quản lý nhiệm vụ', {
      icon: 'list',
      children: [
        new MenuViewModel(taskRouteNameMap['task-created'], {
          link: '/tasks/task-created',
          permission: ['task.main.add', 'task.sub.add']
        }),
        new MenuViewModel(taskRouteNameMap['task-assigned'], { link: '/tasks/task-assigned' }),
        new MenuViewModel(taskRouteNameMap['task-expired'], { link: '/tasks/task-expired' }),
        new MenuViewModel(taskRouteNameMap['task-unfinished'], { link: '/tasks/task-unfinished' }),
        new MenuViewModel(taskRouteNameMap['task-approving'], { link: '/tasks/task-approving' }),
        new MenuViewModel(taskRouteNameMap['task-following'], { link: '/tasks/task-following' }),
        new MenuViewModel(taskRouteNameMap['task-support'], { link: '/tasks/task-support' }),
        new MenuViewModel(taskRouteNameMap['task-done'], { link: '/tasks/task-done' })
      ]
    }),
    new MenuViewModel('Tổng hợp báo cáo', {
      icon: 'description',
      children: [
        new MenuViewModel('Báo cáo tổng hợp', { link: '/report-general', permission: 'report.general.read' }),
        new MenuViewModel('Báo cáo chi tiết', { link: '/report-detail', permission: 'report.detail.read' })
      ]
    }),
    new MenuViewModel('Quản lý đơn vị', {
      permission: 'system.unit.read',
      icon: 'view_comfy',
      children: [
        new MenuViewModel('Bộ', { link: '/ministries' }),
        new MenuViewModel('Đơn vị', { link: '/units' }),
        new MenuViewModel('Phòng ban', { link: '/departments' })
      ]
    }),
    new MenuViewModel('Quản trị hệ thống', {
      icon: 'usb',
      children: [
        new MenuViewModel('Người dùng', { link: '/users', permission: 'system.user.read' }),
        new MenuViewModel('Vai trò', { link: '/roles', permission: 'system.role.read' }),
        new MenuViewModel('Tra cứu log', { link: '/logs', permission: 'system.log.read' }),
        new MenuViewModel('Cấu hình hệ thống', { link: '/configs', permission: 'system.log.read' })
      ]
    })
  ]

  @observable selectedMenu: MenuViewModel = null

  private _cachedViewModel: { [name: string]: any } = {}

  constructor(private providers: AppProvider) {
    let lastSelectedMenu: MenuViewModel
    reaction(
      () => this.selectedMenu,
      selectedMenu => {
        if (lastSelectedMenu) {
          lastSelectedMenu.changeSelected(false)
        }
        selectedMenu.changeSelected(true)
        lastSelectedMenu = selectedMenu
      }
    )
    this.onSelectedMenu(this.menuConfigs[0])
    this.loadData()
  }

  @asyncAction *loadData() {
    this.loading = true
    try {
      const { api, authStore } = this.providers
      const comrade = yield api.comarde.findOne((authStore.user.comrade as ComradeModel)?.id)
      authStore.changeComrade(comrade)
    } catch (error) {
      console.error(error)
    }
    this.loading = false
  }

  @action.bound onSelectedMenu(menu: MenuViewModel) {
    console.log('onSelectedMenu')
    this.selectedMenu = menu
  }

  @action.bound changeDrawer(value: boolean) {
    this.drawer = value
  }

  @action toggleDrawer() {
    this.drawer = !this.drawer
  }

  getCachedViewModel<T>(ctor: new () => T): T {
    if (!this._cachedViewModel[ctor.name]) {
      this._cachedViewModel[ctor.name] = new ctor()
    }
    return this._cachedViewModel[ctor.name]
  }
}

import { AppProvider } from '@/app-provider'
import { ComradeModel } from '@/models/comrade-model'
import { action, observable, reaction } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { taskRouteNameMap } from '@/models/task-model'
import { authStore } from '@/stores/auth-store'

export class MenuViewModel {
  @observable selected = false
  icon: string
  children: MenuViewModel[]
  link: string
  permission: string | string[]
  requiredLeader: boolean

  constructor(
    public title: string,
    options?: {
      icon?: string
      children?: MenuViewModel[]
      link?: string
      permission?: string | string[]
      requiredLeader?: boolean
    }
  ) {
    this.icon = options?.icon
    this.children = options?.children
    this.link = options?.link
    this.permission = options?.permission
    this.requiredLeader = options?.requiredLeader
  }

  @action.bound changeSelected(value: boolean) {
    this.selected = value
  }
}

export class MainContainerViewModel {
  @observable loading = false
  @observable drawer = true
  @observable menuConfigs: MenuViewModel[] = []

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
    reaction(
      () => authStore.comrade,
      comrade => {
        if (!comrade) return
        this.buildMenu()
      },
      { fireImmediately: true }
    )
    this.onSelectedMenu(this.menuConfigs[0])
    this.loadData()
  }

  @asyncAction *loadData() {
    this.loading = true
    try {
      const { api, authStore } = this.providers
      const comrade: ComradeModel = yield api.comarde.findOne((authStore.user.comrade as ComradeModel)?.id)
      authStore.changeComrade(comrade)
    } catch (error) {
      console.error(error)
    }
    this.loading = false
  }

  @action.bound onSelectedMenu(menu: MenuViewModel) {
    this.selectedMenu = menu
  }

  @action.bound changeDrawer(value: boolean) {
    this.drawer = value
  }

  @action toggleDrawer() {
    this.drawer = !this.drawer
  }

  @action buildMenu() {
    const ministrySubMenu = new MenuViewModel('Bộ', { icon: 'horizontal_split', link: '/ministries' })
    const unitSubMenu = new MenuViewModel('Đơn vị', { icon: 'view_module', link: '/units' })
    const devSubMenu = new MenuViewModel('Phòng ban', { icon: 'vertical_split', link: '/departments' })
    const { ministry, unit, department } = authStore.unitParams
    let submenus: MenuViewModel[] = []
    if (ministry) submenus = [ministrySubMenu, unitSubMenu, devSubMenu]
    if (unit) submenus = [unitSubMenu, devSubMenu]
    if (department) submenus = [devSubMenu]
    const unitMenu = new MenuViewModel('Quản lý đơn vị', {
      permission: 'system.unit.read',
      icon: 'view_comfy',
      children: submenus
    })
    this.menuConfigs = [
      new MenuViewModel('Trang chủ', {
        icon: 'dashboard',
        children: [
          new MenuViewModel('Cá nhân', {
            icon: 'account_box',
            link: '/dashboard-comrade'
          }),
          new MenuViewModel('Đơn vị', {
            icon: 'view_list',
            link: '/dashboard-leader',
            requiredLeader: true
          })
        ]
      }),
      new MenuViewModel('Quản lý nhiệm vụ', {
        icon: 'list',
        children: [
          new MenuViewModel(taskRouteNameMap['task-created'], {
            icon: 'assignment',
            link: '/tasks/task-created',
            permission: ['task.main.add'],
            requiredLeader: true
          }),
          new MenuViewModel(taskRouteNameMap['task-assigned'], {
            icon: 'assignment_returned',
            link: '/tasks/task-assigned'
          }),
          new MenuViewModel(taskRouteNameMap['task-done'], {
            icon: 'assignment_turned_in',
            link: '/tasks/task-done'
          }),
          new MenuViewModel(taskRouteNameMap['task-unfinished'], {
            icon: 'event_busy',
            link: '/tasks/task-unfinished'
          }),
          new MenuViewModel(taskRouteNameMap['task-expired'], {
            icon: 'timer',
            link: '/tasks/task-expired'
          }),
          new MenuViewModel(taskRouteNameMap['task-approving'], {
            icon: 'more',
            link: '/tasks/task-approving'
          })
          // new MenuViewModel(taskRouteNameMap['task-support'], {
          //   icon: 'category',
          //   link: '/tasks/task-support'
          // })
        ]
      }),
      new MenuViewModel('Tổng hợp báo cáo', {
        icon: 'description',
        children: [
          new MenuViewModel('Báo cáo tổng hợp', {
            icon: 'collections_bookmark',
            link: '/report-general',
            permission: 'report.general.read'
          }),
          new MenuViewModel('Báo cáo chi tiết', {
            icon: 'library_books',
            link: '/report-detail',
            permission: 'report.detail.read'
          })
        ]
      }),
      unitMenu,
      new MenuViewModel('Quản trị hệ thống', {
        icon: 'usb',
        children: [
          new MenuViewModel('Người dùng', {
            icon: 'supervisor_account',
            link: '/users',
            permission: 'system.user.read'
          }),
          new MenuViewModel('Vai trò', { icon: 'present_to_all', link: '/roles', permission: 'system.role.read' }),
          new MenuViewModel('Tra cứu log', { icon: 'pageview', link: '/logs', permission: 'system.log.read' }),
          new MenuViewModel('Cấu hình hệ thống', { icon: 'settings', link: '/configs', permission: 'system.log.read' })
        ]
      })
    ]
  }

  getCachedViewModel<T>(ctor: new () => T): T {
    if (!this._cachedViewModel[ctor.name]) {
      this._cachedViewModel[ctor.name] = new ctor()
    }
    return this._cachedViewModel[ctor.name]
  }
}

import { action, computed, observable, reaction } from 'mobx'
import ToastedPlugin from 'vue-toasted'

export class MenuViewModel {
  @observable selected = false
  icon: string
  children: MenuViewModel[]
  link: string

  constructor(public title: string, options?: { icon?: string; children?: MenuViewModel[]; link?: string }) {
    this.icon = options?.icon
    this.children = options?.children
    this.link = options?.link
  }

  @action.bound changeSelected(value: boolean) {
    this.selected = value
  }
}

export class MainContainerViewModel {
  @observable drawer = true
  @observable menuConfigs: MenuViewModel[] = [
    new MenuViewModel('Dashboard', { icon: 'dashboard', link: '/dashboard' }),
    new MenuViewModel('Quản lý nhiệm vụ', {
      icon: 'list',
      children: [
        new MenuViewModel('Nhiệm vụ giao', {link: '/tasks/task-asign'}),
        new MenuViewModel('Đang theo dõi', {link: '/tasks/task-following'}),
        new MenuViewModel('Đã quá hạn', {link: '/tasks/task-expired'}),
        new MenuViewModel('Chờ xác nhận', {link: '/tasks/task-pending'}),
        new MenuViewModel('Đã hoàn thành', {link: '/tasks/task-done'})
      ]
    }),
    new MenuViewModel('Tổng hợp báo cáo', { icon: 'description' }),
    new MenuViewModel('Quản lý đơn vị', {
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
        new MenuViewModel('Người dùng', { link: '/users' }),
        new MenuViewModel('Vai trò', { link: '/roles' }),
        new MenuViewModel('Tra cứu log')
      ]
    })
  ]

  @observable selectedMenu: MenuViewModel = null

  private _cachedViewModel: { [name: string]: any } = {}

  constructor() {
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

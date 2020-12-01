import { action, computed, observable, reaction } from 'mobx'

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
        new MenuViewModel('Nhiệm vụ giao'),
        new MenuViewModel('Đang theo dõi'),
        new MenuViewModel('Đã quá hạn'),
        new MenuViewModel('Chờ xác nhận'),
        new MenuViewModel('Đã hoàn thành')
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
        new MenuViewModel('Vai trò', { link: '/role-sections' }),
        new MenuViewModel('Tra cứu log')
      ]
    })
  ]

  @observable selectedMenu: MenuViewModel = null

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
}

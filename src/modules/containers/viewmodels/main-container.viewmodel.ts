import { action, computed, observable, reaction } from 'mobx'

export class MenuViewModel {
  @observable selected = false

  constructor(public title: string, public icon?: string, public children?: MenuViewModel[]) {}

  @action.bound changeSelected(value: boolean) {
    this.selected = value
  }
}

export class MainContainerViewModel {
  @observable drawer = true
  @observable menuConfigs: MenuViewModel[] = [
    new MenuViewModel('Dashboard', 'dashboard'),
    new MenuViewModel('Quản lý nhiệm vụ', 'list', [
      new MenuViewModel('Nhiệm vụ giao'),
      new MenuViewModel('Đang theo dõi'),
      new MenuViewModel('Đã quá hạn'),
      new MenuViewModel('Chờ xác nhận'),
      new MenuViewModel('Đã hoàn thành')
    ]),
    new MenuViewModel('Tổng hợp báo cáo', 'description'),
    new MenuViewModel('Quản lý đơn vị', 'view_comfy'),
    new MenuViewModel('Quản trị hệ thống', 'usb', [new MenuViewModel('Nhiệm vụ giao')])
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

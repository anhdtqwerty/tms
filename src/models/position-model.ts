export interface PositionModel {
  title: string
  description: string
  config?: PositionConfigModel
}

export interface PositionConfigModel {
  task?: { [name: string]: TaskPermissionConfig }
  system?: { [name: string]: SystemPermissionConfig }
  report?: { [name: string]: ReportPermissionConfig }
}

export type PositionSection = 'ministry' | 'unit' | 'department' | 'individual'

export type TaskPermissionType = 'main' | 'sub'
export interface TaskPermissionConfig {
  full?: boolean
  read?: boolean
  add?: boolean
  edit?: boolean
  delete?: boolean
  revoke?: boolean
  assign?: boolean
  extend?: boolean
  return?: boolean
  update?: boolean
  approve?: boolean
  reopen?: boolean
}

export type SystemPermissionType = 'unit' | 'role' | 'user' | 'log'
export interface SystemPermissionConfig {
  full?: boolean
  read?: boolean
  add?: boolean
  edit?: boolean
  delete?: boolean
}

export type ReportPermissionType = 'detail' | 'general'
export interface ReportPermissionConfig {
  full?: boolean
  read?: boolean
}

export interface PermissionConfig {
  task?: { type: TaskPermissionType; name: string; config: TaskPermissionConfig }[]
  system?: { type: SystemPermissionType; name: string; config: SystemPermissionConfig }[]
  report?: { type: ReportPermissionType; name: string; config: ReportPermissionConfig }[]
}

export const generatePermissionConfigs = (config: PositionConfigModel = {}): PermissionConfig => {
  const defaultTaskConfig = {
    full: false,
    read: false,
    add: false,
    edit: false,
    delete: false,
    revoke: false,
    assign: false,
    extend: false,
    return: false,
    update: false,
    approve: false,
    reopen: false
  }
  const defaultSystemConfig = {
    full: false,
    read: false,
    add: false,
    edit: false,
    delete: false
  }
  return {
    task: [
      {
        type: 'main',
        name: 'Quản lý nhiệm vụ chính',
        config: { ...defaultTaskConfig, ...(config?.task?.main ?? {}) }
      },
      { type: 'sub', name: 'Quản lý nhiệm vụ chính', config: { ...defaultTaskConfig, ...(config?.task?.sub ?? {}) } }
    ],
    system: [
      { type: 'unit', name: 'Quản lý đơn vị', config: { ...defaultSystemConfig, ...(config?.system?.unit ?? {}) } },
      { type: 'role', name: 'Quản lý vai trò', config: { ...defaultSystemConfig, ...(config?.system?.role ?? {}) } },
      { type: 'user', name: 'Quản lý người dùng', config: { ...defaultSystemConfig, ...(config?.system?.user ?? {}) } },
      { type: 'log', name: 'Tra cứu log', config: { full: false, read: false, ...(config?.system?.log ?? {}) } }
    ],
    report: [
      {
        type: 'detail',
        name: 'Báo cáo chi tiết',
        config: { full: false, read: false, ...(config?.report?.detail ?? {}) }
      },
      {
        type: 'general',
        name: 'Báo cáo tổng hợp',
        config: { full: false, read: false, ...(config?.report?.general ?? {}) }
      }
    ]
  }
}

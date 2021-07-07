export interface PositionModel {
  id?: string
  title: string
  description: string
  type: PositionType
  config: PositionConfigModel
  updated_at?: string
  created_at?: string
  data?: {
    group_type?: 'leader' | 'member'
  }
}

export interface PositionConfigModel {
  task?: { [name in TaskPermissionType]?: TaskPermissionConfig }
  system?: { [name in SystemPermissionType]?: SystemPermissionConfig }
  report?: { [name in ReportPermissionType]?: ReportPermissionConfig }
}

export type PositionType = 'unit' | 'group' // | 'ministry' | 'department' | 'individual'
export type GroupType = 'leader' | 'member'

export type TaskPermissionType = 'main' | 'sub'
export interface TaskPermissionConfig {
  viewAll?: boolean
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
      }
      // { type: 'sub', name: 'Quản lý nhiệm vụ phụ', config: { ...defaultTaskConfig, ...(config?.task?.sub ?? {}) } }
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

export const toPositionConfig = (permissions: PermissionConfig): PositionConfigModel => {
  const result: PositionConfigModel = { task: {}, system: {}, report: {} }
  permissions.task.forEach(({ type, config }) => {
    const settings: any = {}
    Object.entries(config).forEach(([cName, cValue]) => (settings[cName] = cValue))
    result.task[type] = settings
  })
  permissions.system.forEach(({ type, config }) => {
    const settings: any = {}
    Object.entries(config).forEach(([cName, cValue]) => (settings[cName] = cValue))
    result.system[type] = settings
  })
  permissions.report.forEach(({ type, config }) => {
    const settings: any = {}
    Object.entries(config).forEach(([cName, cValue]) => (settings[cName] = cValue))
    result.report[type] = settings
  })
  return result
}

import { apiService } from '@/services/api-service'
import { authStore } from '@/stores/auth-store'
import { TaskStatModel } from './report-model'

export interface TaskStatsOptions {
  from?: string
  to?: string
  hasAssigneds?: boolean
  hasCreateds?: boolean
}

export interface TaskStatsResult {
  createds: TaskStatModel[]
  assigneds: TaskStatModel[]
}

export const getComradeTaskStats = async (
  options: TaskStatsOptions = { hasAssigneds: true, hasCreateds: true }
): Promise<TaskStatsResult> => {
  const { from, to, hasCreateds, hasAssigneds } = options
  let createds: TaskStatModel[] = []
  let assigneds: TaskStatModel[] = []
  if (hasAssigneds) {
    assigneds = await apiService.getComradeTaskReport({
      comrade: authStore.comrade.id,
      joinBy: 'executedComrade',
      from,
      to
    })
  }
  if (hasCreateds) {
    createds = await apiService.getComradeTaskReport({
      comrade: authStore.comrade.id,
      joinBy: 'createdBy',
      from,
      to
    })
  }
  assigneds = assigneds.filter(st => st.id === authStore.comrade.id)
  createds = createds.filter(st => st.id === authStore.comrade.id)
  return { createds, assigneds }
}

export const getLeaderTaskStats = async (
  options: TaskStatsOptions = { hasAssigneds: true, hasCreateds: true }
): Promise<TaskStatsResult> => {
  const { from, to, hasCreateds, hasAssigneds } = options
  let createds: TaskStatModel[] = []
  let assigneds: TaskStatModel[] = []
  const { department, unit, ministry } = authStore.unitParams
  if (department) {
    if (hasCreateds) {
      createds = await apiService.getComradeTaskReport({
        department,
        joinDepartmentBy: 'createdDepartment',
        joinBy: 'executedComrade',
        from,
        to
      })
    }
    if (hasAssigneds) {
      assigneds = await apiService.getDepartmentsTaskReport({
        unit,
        joinUnitBy: 'executedUnit',
        joinBy: 'executedDepartment',
        from,
        to
      })
      assigneds = assigneds.filter(t => t.id === department)
    }
  } else if (unit) {
    if (hasCreateds) {
      createds = await apiService.getDepartmentsTaskReport({
        unit,
        joinUnitBy: 'createdUnit',
        joinBy: 'executedDepartment',
        from,
        to
      })
    }
    if (hasAssigneds) {
      assigneds = await apiService.getUnitsTaskReport({
        joinUnitBy: 'createdUnit',
        joinBy: 'executedUnit',
        ministry: authStore.ministry?.id
      })
      assigneds = assigneds.filter(t => t.id === unit)
    }
  } else if (ministry) {
    if (hasCreateds) {
      createds = await apiService.getUnitsTaskReport({
        joinUnitBy: 'createdUnit',
        joinBy: 'executedUnit',
        ministry,
        from,
        to
      })
    }
  }
  return { createds, assigneds }
}

export const getTaskStats = async (
  options: TaskStatsOptions = { hasAssigneds: true, hasCreateds: true }
): Promise<TaskStatsResult> => {
  if (authStore.isLeader) return getLeaderTaskStats(options)
  return getComradeTaskStats(options)
}

import _, { flatten, isNumber } from 'lodash'

export interface TaskStatCriteria {
  total?: number
  waiting?: number
  todo?: number
  doing?: number
  aprroving?: number
  recovered?: number
  done?: number
  waitingOutDate?: number
  todoOutDate?: number
  doingOutDate?: number
  aprrovingOutDate?: number
  recoveredOutDate?: number
  doneOutDate?: number
}

export interface TaskStatModel extends TaskStatCriteria {
  id?: any
  title?: string
}

export const flatStats = (reports: TaskStatModel[]): TaskStatCriteria => {
  if (!reports) return {}
  const flats = _.flatten(reports.map(r => Object.entries(r).map(([key, value]) => ({ key, value }))))
  const results: any = {}
  _(flats)
    .groupBy('key')
    .forEach((values, key) => (results[key] = _.sumBy(values, 'value')))
  return results
}

export const mergeStatList = (...statss: TaskStatModel[][]) => {
  return Object.values(
    flatten(statss).reduce((prev, cur) => {
      const last = prev[cur.id] as any
      if (!last) {
        prev[cur.id] = { ...cur }
      } else {
        Object.entries(cur).forEach(([key, value]) => {
          if (isNumber(value) && key !== 'id') last[key] = last[key] + value
        })
      }
      return prev
    }, {} as any)
  )
}

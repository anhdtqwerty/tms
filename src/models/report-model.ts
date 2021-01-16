import _ from 'lodash'

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

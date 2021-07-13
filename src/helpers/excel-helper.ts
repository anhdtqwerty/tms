import { taskApprovementStatusNameMap, TaskModel, taskStateNameMap } from '@/models/task-model'
import _ from 'lodash'
import XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const exportFile = (data: any[], header: string[]) => {
  const ws = XLSX.utils.json_to_sheet(data, { skipHeader: true, origin: 'A2' } as any)
  XLSX.utils.sheet_add_aoa(ws, [header])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws)
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, `export-excel.xlsx`)
}

// { text: 'Số/ký hiệu', value: 'code', sortable: false },
// { text: 'Ngày ban hành', value: 'publishedDate', sortable: false },
// { text: 'Trích yếu', value: 'title', sortable: false },
// { text: 'Nội dung nhiệm vụ', value: 'description', sortable: false },
// { text: 'ĐV theo dõi', value: 'supervisorUnit.title', sortable: false },
// { text: 'CV theo dõi', value: 'supervisors', sortable: false },
// { text: 'ĐV thực hiện', value: 'executedUnit.title', sortable: false },
// { text: 'CV thực hiện', value: 'executedComrade.name', sortable: false, defaultHide: true },
// { text: 'Hạn xử lý', value: 'expiredDate', sortable: false, defaultHide: true },
// { text: 'Trạng thái', value: 'state', sortable: false, defaultHide: true },
export const excelHelper = {
  task: (tasks: TaskModel[]) => {
    const data = tasks.map(t => ({
      code: t.code,
      publishedDate: t.publishedDate,
      title: t.title,
      description: t.description,
      supervisorUnit: _.get(t.supervisorUnit, 'title'),
      supervisorComrade: _.get(t.supportedComrades, '[0].name'),
      executedUnit: _.get(t.executedUnit, 'title'),
      executeComrade: _.get(t.executedComrade, 'name'),
      expiredDate: t.expiredDate,
      status: t.status ? taskApprovementStatusNameMap[t.status] : undefined,
      state: taskStateNameMap[t.state],
      explainState: t.explainState
    }))
    const header = [
      'Số/ký hiệu',
      'Ngày ban hành',
      'Trích yếu',
      'Nội dung nhiệm vụ',
      'ĐV theo dõi',
      'CV theo dõi',
      'ĐV thực hiện',
      'Người thực hiện',
      'Hạn xử lý',
      'Phê duyệt',
      'Tình trạng thực hiện',
      'Trạng thái'
    ]
    exportFile(data, header)
  }
}

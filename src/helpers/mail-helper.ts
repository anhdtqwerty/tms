import { TaskModel } from '@/models/task-model'
import { authStore } from '@/stores/auth-store'
import _ from 'lodash'
import moment from 'moment'

export interface MailModel {
  from?: string
  to?: string
  subject?: string
  html?: string
}

const getAllMails = (task: TaskModel) => {
  console.log(task.executedComrade)
  return {
    executeUnit: _.get(task.executedUnit, 'email'),
    executeComrade: _.get(task.executedComrade, 'email'),
    supportComrades: _.map(task.supportedComrades, 'email'),
    supportUnits: _.map(task.supportedUnits, 'email'),
    createdBy: _.get(task.createdBy, 'email'),
    createdUnit: _.get(task.createdUnit, 'email'),
    createdDepartment: _.get(task.createdDepartment, 'email'),
    supervisors: _.get(task.supervisors, 'email')
  }
}

export const mailBuilder = {
  createTask: (task: TaskModel) => {
    const { executeUnit, executeComrade, supportComrades, supportUnits } = getAllMails(task)
    const tos = _.flatten([executeUnit, executeComrade, supportComrades, supportUnits]).filter(x => !!x)
    const mail: MailModel = {
      to: tos.join(', '),
      subject: `Tạo nhiệm vụ thành công`,
      html: `Cán bộ ${authStore.comrade?.name} đã tạo nhiệm vụ thành công<br>
      <br>
Code: ${task.code}<br>
Trích yếu: ${task.title}<br>
Nội dung: ${task.description}<br>
<bt>
<bt>
Thời gian: ${moment().format('DD/MM/YYYY hh:mm:ss')}<br>
Trân Trọng`
    }
    return mail
  },
  revokeTask: (task: TaskModel) => {
    const { executeUnit, executeComrade, supportComrades, supportUnits } = getAllMails(task)
    const tos = _.flatten([executeUnit, executeComrade, supportComrades, supportUnits]).filter(x => !!x)
    const mail: MailModel = {
      to: tos.join(', '),
      subject: `Nhiệm vụ bị thu hồi`,
      html: `Cán bộ ${authStore.comrade?.name} đã thu hồi nhiệm vụ<br>
      <br>
Code: ${task.code}<br>
Trích yếu: ${task.title}<br>
Nội dung: ${task.description}<br>
<bt>
<bt>
Thời gian: ${moment().format('DD/MM/YYYY hh:mm:ss')}<br>
Trân Trọng`
    }
    return mail
  },
  assignTask: (task: TaskModel) => {
    const { executeUnit, executeComrade } = getAllMails(task)
    const tos = _.flatten([executeUnit, executeComrade]).filter(x => !!x)
    const mail: MailModel = {
      to: tos.join(', '),
      subject: `Giao nhiệm vụ`,
      html: `Cán bộ ${authStore.comrade?.name} đã giao nhiệm vụ<br>
      <br>
Code: ${task.code}<br>
Trích yếu: ${task.title}<br>
Nội dung: ${task.description}<br>
<bt>
<bt>
Thời gian: ${moment().format('DD/MM/YYYY hh:mm:ss')}<br>
Trân Trọng`
    }
    return mail
  },
  extendTask: (task: TaskModel) => {
    const { executeUnit, executeComrade, supportComrades, supportUnits } = getAllMails(task)
    const tos = _.flatten([executeUnit, executeComrade, supportComrades, supportUnits]).filter(x => !!x)
    const mail: MailModel = {
      to: tos.join(', '),
      subject: `Nhiệm vụ được gia hạn`,
      html: `Cán bộ ${authStore.comrade?.name} đã gia hạn nhiệm vụ<br>
      <br>
Code: ${task.code}<br>
Trích yếu: ${task.title}<br>
Nội dung: ${task.description}<br>
<bt>
<bt>
Thời gian: ${moment().format('DD/MM/YYYY hh:mm:ss')}<br>
Trân Trọng`
    }
    return mail
  },
  returnTask: (task: TaskModel) => {
    const { createdUnit, createdDepartment, supervisors } = getAllMails(task)
    const tos = _.flatten([createdDepartment || createdUnit, supervisors]).filter(x => !!x)
    const mail: MailModel = {
      to: tos.join(', '),
      subject: `Nhiệm vụ được trả lại`,
      html: `Cán bộ ${authStore.comrade?.name} đã trả lại nhiệm vụ<br>
      <br>
Code: ${task.code}<br>
Trích yếu: ${task.title}<br>
Nội dung: ${task.description}<br>
<bt>
<bt>
Thời gian: ${moment().format('DD/MM/YYYY hh:mm:ss')}<br>
Trân Trọng`
    }
    return mail
  },
  updateProgressTask: (task: TaskModel) => {
    const { createdBy, supervisors } = getAllMails(task)
    const tos = _.flatten([createdBy, supervisors]).filter(x => !!x)
    const mail: MailModel = {
      to: tos.join(', '),
      subject: `Nhiệm vụ được cập nhật`,
      html: `Cán bộ ${authStore.comrade?.name} đã cập nhật nhiệm vụ<br>
      <br>
Code: ${task.code}<br>
Trích yếu: ${task.title}<br>
Nội dung: ${task.description}<br>
<bt>
<bt>
Thời gian: ${moment().format('DD/MM/YYYY hh:mm:ss')}<br>
Trân Trọng`
    }
    return mail
  },
  approveTask: (task: TaskModel, approve: boolean) => {
    const { executeComrade, executeUnit } = getAllMails(task)
    const tos = _.flatten([executeComrade, executeUnit]).filter(x => !!x)
    const mail: MailModel = {
      to: tos.join(', '),
      subject: `Nhiệm vụ đã ${approve ? 'được phê duyệt' : 'bị trả lại'}`,
      html: `Cán bộ ${authStore.comrade?.name} đã ${approve ? 'phê duyệt' : 'trả lại'} nhiệm vụ<br>
      <br>
Code: ${task.code}<br>
Trích yếu: ${task.title}<br>
Nội dung: ${task.description}<br>
<bt>
<bt>
Thời gian: ${moment().format('DD/MM/YYYY hh:mm:ss')}<br>
Trân Trọng`
    }
    return mail
  },
  reopenTask: (task: TaskModel) => {
    const { executeComrade, executeUnit, supportComrades, supportUnits } = getAllMails(task)
    const tos = _.flatten([executeComrade, executeUnit, supportComrades, supportUnits]).filter(x => !!x)
    const mail: MailModel = {
      to: tos.join(', '),
      subject: `Nhiệm vụ đã được mở lại`,
      html: `Cán bộ ${authStore.comrade?.name} mở lại nhiệm vụ<br>
      <br>
Code: ${task.code}<br>
Trích yếu: ${task.title}<br>
Nội dung: ${task.description}<br>
<bt>
<bt>
Thời gian: ${moment().format('DD/MM/YYYY hh:mm:ss')}<br>
Trân Trọng`
    }
    return mail
  }
}

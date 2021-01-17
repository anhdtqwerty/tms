import { PositionModel } from '@/models/position-model'
import { authStore } from '@/stores/auth-store'
import _ from 'lodash'

const checkRole = (r: string, position: PositionModel) => {
  const splitRoles = r.split('.')
  const role = position.config
  const targetRole = _.get(role, r)
  if (splitRoles.length !== 3 || targetRole === undefined) {
    console.error(`role-directive doesn't support`, r)
  } else {
    const hasFull = _.get(role, `${splitRoles[0]}.${splitRoles[1]}.full`)
    if (!hasFull && !targetRole) {
      console.log(`${r} full=${hasFull} target=${targetRole}`)
      return false
    }
  }
  return true
}

export const permissionHelper = {
  check: (required: string | string[]) => {
    if (!required) return true

    const position = authStore.comrade?.position as PositionModel
    if (!position) {
      console.warn('permissionHelper.check can not read role')
      return false
    }

    if (_.isArray(required)) {
      return !!required.find(r => checkRole(r, position))
    } else if (_.isString(required)) {
      return checkRole(required, position)
    } else {
      console.error('permissionHelper.check doesnt support', required)
    }

    return true
  }
}

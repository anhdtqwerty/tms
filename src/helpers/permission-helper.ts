import { PositionModel } from '@/models/position-model'
import { authStore } from '@/stores/auth-store'
import _ from 'lodash'

export const permissionHelper = {
  check: (required: string) => {
    if (!required) return true

    const position = authStore.comrade?.position as PositionModel
    if (!position) {
      console.warn('permissionHelper.check can not read role')
      return false
    }

    const splitRoles = required.split('.')
    const role = position.config
    const targetRole = _.get(role, required)
    if (splitRoles.length !== 3 || targetRole === undefined) {
      console.error(`role-directive doesn't support`, required)
    } else {
      const hasFull = _.get(role, `${splitRoles[0]}.${splitRoles[1]}.full`)
      if (!hasFull && !targetRole) {
        console.log(`${required} full=${hasFull} target=${targetRole}`)
        return false
      }
    }

    return true
  }
}

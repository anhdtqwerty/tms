import { permissionHelper } from '@/helpers/permission-helper'
import { authStore } from '@/stores/auth-store'
import Vue from 'vue'

const commentNode = (el: any, vnode: any) => {
  const comment = document.createComment(' ')

  Object.defineProperty(comment, 'setAttribute', {
    value: () => ({})
  })

  vnode.text = ' '
  vnode.elm = comment
  vnode.isComment = true
  vnode.context = undefined
  vnode.tag = undefined
  vnode.data.directives = undefined

  if (vnode.componentInstance) {
    vnode.componentInstance.$el = comment
  }

  if (el.parentNode) {
    el.parentNode.replaceChild(comment, el)
  }
}

export const directiveRegister = () => {
  Vue.directive('permission', (el, binding, vnode) => {
    if (!binding.value) return

    const val = binding.value
    if (!authStore.comrade?.position) {
      commentNode(el, vnode)
      return
    }

    if (typeof val === 'string') {
      if (!permissionHelper.check(val)) {
        commentNode(el, vnode)
      }
    } else if (Array.isArray(val)) {
      console.error(`role-directive doesn't support`, val)
    } else {
      console.error(`role-directive doesn't support`, val)
    }
  })
}

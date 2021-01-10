import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import vuetify from './plugins/vuetify'
import { inputRulesPlugin } from './plugins/rules'
import moment from 'moment'
import VueApexCharts from 'vue-apexcharts'
import { authStore } from './stores/auth-store'
import _ from 'lodash'
import { PositionModel } from './models/position-model'

moment.locale('vi')

Vue.config.productionTip = false

// Register common components
Vue.component('breadcrumbs', () => import('./router/breadcumbs.vue'))
Vue.component('text-link', () => import('./components/text-link/text-link.vue'))
Vue.component('app-text-field', () => import('./components/vuetify/app-text-field.vue'))
Vue.component('app-textarea', () => import('./components/vuetify/app-text-area.vue'))
Vue.component('app-file-input', () => import('./components/vuetify/app-file-input.vue'))

// pluginse
Vue.component('apexchart', VueApexCharts)
Vue.use(inputRulesPlugin)
Vue.use(VueApexCharts)

// directive
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

Vue.directive('permission', (el, binding, vnode) => {
  if (!binding.value) return

  const val = binding.value
  const position = authStore.comrade?.position
  if (!position || typeof position === 'string') {
    commentNode(el, vnode)
    return
  }

  if (typeof val === 'string') {
    const splitRoles = (val as string).split('.')
    const role = (position as PositionModel).config
    const targetRole = _.get(role, val)
    if (splitRoles.length !== 3 || targetRole === undefined) {
      console.error(`role-directive doesn't support`, val)
    } else {
      const comradeFull = _.get(role, `${splitRoles[0]}.${splitRoles[1]}.full`)
      if (!comradeFull && !targetRole) {
        console.log(`${val} comradeFull=${comradeFull} targetRole=${targetRole}`)
        commentNode(el, vnode)
      }
    }
  } else if (Array.isArray(val)) {
    console.error(`role-directive doesn't support`, val)
  } else {
    console.error(`role-directive doesn't support`, val)
  }
})

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

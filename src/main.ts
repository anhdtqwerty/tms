import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import vuetify from './plugins/vuetify'
import { inputRulesPlugin } from './plugins/rules'
import moment from 'moment'
import VueApexCharts from 'vue-apexcharts'

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

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import vuetify from './plugins/vuetify'
import { inputRulesPlugin } from './plugins/rules'
import moment from 'moment'
import VueApexCharts from 'vue-apexcharts'
import { componentRegister } from './plugins/component-register'
import { directiveRegister } from './plugins/directive-register'
import { vueFilterRegister } from './plugins/vue-filter-register'

Vue.config.productionTip = false

// 3rd configs
moment.locale('vi')
Vue.component('apexchart', VueApexCharts)
Vue.use(VueApexCharts)

// app configs
Vue.use(inputRulesPlugin)
componentRegister()
directiveRegister()
vueFilterRegister()

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

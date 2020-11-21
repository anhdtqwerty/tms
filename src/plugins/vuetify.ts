import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#1E88E5',
        secondary: '#E3F2FD',
        accent: '#65489F',
        error: '#D50000',
        success: '#4CAF50'
      }
    }
  }
})

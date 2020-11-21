import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $rules: any
  }
}

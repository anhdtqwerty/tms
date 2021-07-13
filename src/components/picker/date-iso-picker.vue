<template>
  <v-text-field
    v-bind="this.$attrs"
    ref="code"
    v-mask="mask"
    placeholder="dd/mm/yyyy"
    v-model="data"
    @keypress.enter="onEnterPress"
  ></v-text-field>
</template>

<script>
import moment from 'moment'
import { mask } from 'vue-the-mask'
export default {
  props: {
    date: String
  },
  directives: {
    mask
  },
  data: () => ({
    data: '',
    menu: false,
    mask: 'XX/XX/XXXX'
  }),

  methods: {
    updated(value) {
      if (value) {
        this.$emit(
          'update:date',
          moment(this.data, 'DD/MM/YYYY')
            .endOf('day')
            .toISOString()
        )
        this.$emit(
          'input',
          moment(this.data, 'DD/MM/YYYY')
            .endOf('day')
            .toISOString()
        )
      } else {
        this.$emit('update:date', '')
        this.$emit('input', '')
      }
      this.menu = false
    },
    reset() {
      if (this.date) {
        this.data = moment(this.date).format('DD/MM/YYYY')
      } else {
        this.data = ''
      }
    },
    onEnterPress() {
      this.$emit('onEnterPress')
    }
  },
  created() {
    this.reset()
  },
  watch: {
    data(value) {
      this.updated(this.data)
    },
    date(value) {
      if (value) {
        this.updated(moment(value).format('DD/MM/YYYY'))
      }
    }
  }
}
</script>

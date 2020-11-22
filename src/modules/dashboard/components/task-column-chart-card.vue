<template>
  <v-sheet elevation="1" rounded="rounded">
    <v-container class="pa-4" fluid>
      <v-row>
        <v-col cols="12" md="3" class="py-0">
          <div class="primary--text text-h6">Doanh thu</div>
        </v-col>
        <v-col cols="12" md="9" class="py-0 d-flex" :class="{ 'justify-end': $vuetify.breakpoint.mdAndUp }">
          <v-select class="selector" item-color="primary" :items="years" label="Năm" single-line outlined dense />
          <date-picker-input class="selector pl-4" :value="selectedDate" @update:value="selectedDate = $event" />
        </v-col>
      </v-row>
    </v-container>
    <!-- <v-card-title class="v-card-title-custom">
      <card-title class="primary--text">Doanh thu</card-title>
      <v-spacer />
    </v-card-title> -->
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import DatePickerInput from '@/components/picker/date-picker-input.vue'
@Component({
  components: {
    DatePickerInput
  }
})
export default class TaskColumnChartCard extends Vue {
  selectedDate = '2020-11-20'

  @Watch('selectedDate') onSelectedDateChange(val: string) {
    console.log('onSelectedDateChange', val)
  }
}
</script>

<style scoped>
.selector {
  max-width: 164px;
}
</style>

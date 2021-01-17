<template>
  <v-menu left bottom attach :close-on-content-click="false">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon dark v-bind="attrs" v-on="on">
        <v-icon color="grey darken-1">settings</v-icon>
      </v-btn>
    </template>
    <v-card :style="`max-width: ${colNumber * 220}px`">
      <v-container fluid>
        <v-row class="d-inline-flex">
          <v-col :cols="12 / colNumber" v-for="(i, index) in headers.filter(h => h.text)" :key="index">
            <v-checkbox :label="i.text" hide-details :value="i" v-model="selecteds" class="pa-0 ma-0"></v-checkbox>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import _ from 'lodash'

@Component
export default class TableHeaderSetting extends Vue {
  @Prop({ default: [] }) headers: any[]
  @Prop({ default: 1 }) colNumber: number

  selecteds: any[] = []

  @Watch('headers', { immediate: true }) onHeadersChanged(val: any[]) {
    this.selecteds = val.filter(v => !v.defaultHide)
  }

  @Watch('selecteds', { immediate: true }) onSelectedsChanged(val: any[]) {
    this.$emit(
      'change',
      _.sortBy(val, o => this.headers.indexOf(o))
    )
  }
}
</script>

<style scoped></style>

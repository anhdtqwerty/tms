<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" scrollable width="600" v-model="syncedValue">
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>SỬA THÔNG TIN ĐƠN VỊ</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pa-0">
        <v-form ref="form">
          <v-container fluid px-5 py-2>
            <v-row>
              <v-col cols="12" class="pa-2">
                <v-text-field dense outlined v-model="name" label="Tên đơn vị"></v-text-field>
                <v-text-field dense outlined v-model="name" label="Mã đơn vị"></v-text-field>
                <v-text-field dense outlined v-model="name" label="Đơn vị cha"></v-text-field>
                <v-text-field dense outlined v-model="name" label="Email đơn vị"></v-text-field>
                <v-text-field dense outlined v-model="name" label="Số điện thoại đơn vị"></v-text-field>
                <v-textarea dense outlined v-model="username" label="Mô tả" counter="5000" />
              </v-col>
              <v-col cols="12" class="pa-2 d-flex justify-end">
                <v-btn depressed class="mr-4" medium @click="save">
                  <span>Hủy</span>
                </v-btn>
                <v-btn depressed color="primary" medium @click="save">
                  <span>Hoàn thành</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator'

@Component
export default class UnitEditDialog extends Vue {
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean

  name = ''
  username = ''

  save() {
    //
  }
}
</script>

<style scoped></style>

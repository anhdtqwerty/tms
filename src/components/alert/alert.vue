<template>
  <v-dialog
    width="auto "
    :fullscreen="$vuetify.breakpoint.xs"
    scrollable
    :value="controller.show"
    @input="controller.changeShow"
  >
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0" fixed>
        <v-toolbar-title>{{ controller.config.title }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-0">
        <v-form ref="form">
          <v-container fluid px-5 py-2>
            <v-row>
              <v-col cols="12" class="pa-2">
                <div>{{ controller.config.message }}</div>
              </v-col>
              <v-col cols="12" class="pa-2" align="end">
                <v-btn depressed color="primary" medium @click="controller.ok">
                  <span>Xác nhận</span>
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
import { Component, Prop, Vue } from 'vue-property-decorator'
import { AlertController } from './alert-controller'
@Component
export default class Alert extends Vue {
  @Prop() controller: AlertController
}
</script>

<style scoped></style>

<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xs" width="600" v-model="syncedValue" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense class="elevation-0">
        <v-toolbar-title>Chi tiết</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncedValue = false">
          <v-icon class="white--text">close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-container fluid px-5 py-2>
        <v-row>
          <v-col cols="12" class="pa-2">
            {{ text }}
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class ReadMoreDialog extends Vue {
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Prop() text: string
}
</script>

<style scoped></style>

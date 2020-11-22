<template>
  <v-main class="d-flex pa-0 ma-0 align-center">
    <v-card class="pa-0 ma-auto" max-width="1024" min-height="504">
      <v-row no-gutters style="min-height: 504px">
        <v-col cols="12" md="5" class="primary py-5 py-md-16">
          <v-row class="fill-height justify-center align-end">
            <v-img max-width="266" src="@/assets/logo_sologan.svg"></v-img>
          </v-row>
        </v-col>
        <v-col cols="12" md="7">
          <div class="px-4 px-md-16 py-12">
            <router-view />
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AuthContainer extends Vue {}
</script>

<style scoped></style>

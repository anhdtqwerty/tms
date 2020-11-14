<template>
  <v-main class="fill-height pa-xs-0 d-flex align-center">
    <span class="auth-background hidden-sm-only hidden-xs-only"></span>
    <v-card class="pa-sm-auto mx-auto pa-xs-0 ma-xs-0" max-width="1024">
      <v-row no-gutters>
        <v-col
          xs="12"
          sm="12"
          md="5"
          lg="5"
          xl="5"
          class="amber darken-1 hidden-sm-and-down d-flex flex-column justify-end align-center py-16"
          justify="center"
        >
          <div class="px-sm-16">
            <v-img src="@/assets/logo_sologan.svg"></v-img>
          </div>
        </v-col>

        <v-col class="white py-8" xs="12" sm="12" md="7" lg="7" xl="7">
          <router-view />
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

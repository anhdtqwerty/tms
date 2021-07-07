<template>
  <v-navigation-drawer
    :value="mainViewModel.drawer"
    @input="mainViewModel.changeDrawer"
    class="elevation-2"
    app
    :temporary="$vuetify.breakpoint.xs"
    :mini-variant.sync="mini"
    permanent
  >
    <div class="primary darken-1 d-flex align-center px-6 mobile-drawer-logo" style="position: relative">
      <v-img v-if="!mini" :height="40" src="@/assets/ministry.svg" contain position="center"></v-img>
      <v-btn class="chevron-left" v-if="!mini" dark icon @click.stop="mini = !mini">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </div>
    <v-list class="py-0">
      <template v-for="item in mainViewModel.menuConfigs">
        <v-list-group
          :key="item.title"
          v-if="item.children && $permission(item.permission)"
          active-class="left-primary-border"
        >
          <template v-slot:activator>
            <v-icon class="mr-2" style="height: 56px">{{ item.icon }}</v-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </template>
          <v-list class="left-primary-border py-0">
            <v-list-item
              link
              v-for="menu in item.children"
              v-show="$permission(menu.permission, menu.requiredLeader)"
              :key="menu.title"
              :input-value="menu.selected"
              :to="menu.link"
              color="primary"
              @click="mainViewModel.onSelectedMenu(menu)"
            >
              <v-icon class="ml-1 mr-2" style="height: 40px">{{ menu.icon }}</v-icon>
              <v-list-item-title>{{ menu.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-list-group>
        <v-list-item
          link
          :to="item.link"
          :key="item.title"
          v-if="!item.children && $permission(item.permission, item.requiredLeader)"
          active-class="left-primary-border"
          :input-value="item.selected"
          color="primary"
          @click="mainViewModel.onSelectedMenu(item)"
        >
          <v-icon class="mr-2" style="height: 56px">{{ item.icon }}</v-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { Observer } from 'mobx-vue'
import { MainContainerViewModel } from '../viewmodels/main-container.viewmodel'

@Observer
@Component
export default class MainDrawer extends Vue {
  @Inject() mainViewModel: MainContainerViewModel

  mini = true
}
</script>

<style scoped type="scss">
.mobile-drawer-logo {
  height: 64px;
}
.chevron-left {
  position: absolute;
  right: 12px;
  top: 12px;
}
</style>

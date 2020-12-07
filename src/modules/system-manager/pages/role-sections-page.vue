<template>
  <v-container fluid px-5 py-2>
    <v-row justify="space-between" align="center">
      <v-col cols="8" class="pa-2">
        <div class="text-h6">Vai trò</div>
        <breadcrumbs />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-container fluid class="px-5 py-2">
            <v-row>
              <v-col cols="12" class="pa-2 text-subtitle-1 font-weight-medium">Chọn loại phân quyền</v-col>
              <v-col v-for="item in roleSections" :key="item.id" class="pa-2" cols="6" md="3">
                <v-card>
                  <v-img v-bind:src="require(`@/assets/${item.image}`)" height="128"></v-img>
                  <v-card-title class="text-truncate text-button py-2">
                    <router-link link :to="`/role-manager/${item.id}`" style="text-decoration: none">{{
                      item.title
                    }}</router-link>
                  </v-card-title>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { PositionType } from '@/models/position-model'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class RoleSectionsPage extends Vue {
  showAddUser = false
  roleSections: { image: string; title: string; id: PositionType }[] = [
    { image: 'role-ministry.svg', title: 'Cài đặt vai trò bộ', id: 'ministry' },
    { image: 'role-unit.svg', title: 'Cài đặt vai trò đơn vị', id: 'unit' },
    { image: 'role-department.svg', title: 'Cài đặt vai trò phòng ban', id: 'department' },
    { image: 'role-individual.svg', title: 'Cài đặt vai trò cá nhân', id: 'individual' }
  ]
}
</script>

<style scoped></style>

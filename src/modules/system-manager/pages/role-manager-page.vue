<template>
  <v-container fluid px-5 py-2>
    <v-row justify="space-between" align="center">
      <v-col cols="8" class="pa-2">
        <div class="text-h6">Cài đặt vai trò</div>
        <breadcrumbs />
      </v-col>
      <v-col cols="4" align="right" class="pa-2">
        <v-btn medium color="success" @click="showAddDialog = true">
          <v-icon left>add</v-icon>
          <span>Thêm vai trò</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table :items="viewmodel.roles" item-key="id" :headers="headers" mobile-breakpoint="0">
            <template v-slot:[`item.title`]="{ item }">
              <text-link @click="showEditDialog = true">
                {{ item.title }}
              </text-link>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <role-add-dialog :value.sync="showAddDialog" />
    <role-edit-dialog :value.sync="showEditDialog" />
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { RoleManagerViewModel } from '../viewmodels/role-manager-viewmodel'

@Component({
  components: {
    RoleAddDialog: () => import('../dialogs/role-add-dialog.vue'),
    RoleEditDialog: () => import('../dialogs/role-edit-dialog.vue')
  }
})
export default class RoleManagerPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new RoleManagerViewModel(this.providers)

  showAddDialog = false
  showEditDialog = false

  headers = [
    { text: 'Tên vai trò', value: 'title', sortable: false },
    { text: 'Mô tả', value: 'description', sortable: false }
  ]
}
</script>

<style scoped></style>

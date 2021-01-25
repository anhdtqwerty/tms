<template>
  <v-container fluid px-5 py-2>
    <v-row justify="space-between" align="center">
      <v-col cols="8" class="pa-2">
        <div class="text-h6">Đơn vị</div>
        <breadcrumbs />
      </v-col>
      <v-col cols="4" align="right" class="pa-2">
        <v-btn v-if="$permission('system.unit.add')" medium color="success" @click="showAddUnit = true">
          <v-icon left>add</v-icon>
          <span>Thêm đơn vị</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table
            :items="viewmodel.units"
            item-key="id"
            :headers="headers"
            :footer-props="{ itemsPerPageOptions: [25] }"
            mobile-breakpoint="0"
          >
            <template v-slot:top>
              <v-container fluid class="px-5 py-0">
                <v-row>
                  <v-col cols="12" align="end" class="pa-2">
                    <v-btn icon small>
                      <v-icon>settings</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12" class="d-none d-sm-flex pa-2 align-center">
                    <app-text-field class="mr-4" hide-details v-model="searchName" label="Tên đơn vị" />
                    <app-text-field class="mr-4" hide-details v-model="searchCode" label="Mã đơn vị" />
                    <app-text-field class="mr-4" hide-details v-model="searchEmail" label="Email" />
                    <v-btn depressed color="primary" medium @click="search">
                      <span class="d-none d-md-flex">Tìm kiếm</span>
                      <v-icon dark>search</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </template>
            <template v-slot:[`item.title`]="{ item }">
              <text-link :to="`/unit/${item.id}`">
                {{ item.title }}
              </text-link>
            </template>

            <template v-slot:[`item.role.name`]="{ item }">
              <div class="staff-department">{{ item.department.title }}</div>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon v-if="$permission('system.unit.edit')" small class="mr-2" @click="editUnit(item)">
                mdi-pencil
              </v-icon>
              <v-icon v-if="$permission('system.unit.delete')" small @click="viewmodel.deleteUnit(item)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <unit-add-dialog :value.sync="showAddUnit" @success="viewmodel.unitAdded" />
    <unit-edit-dialog :value.sync="showEditUnit" @success="viewmodel.unitUpdated" :unit="edtingUnit" />
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { UnitModel } from '@/models/unit-model'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { UnitManagerViewModel } from '../viewmodels/unit-manager-viewmodel'

@Component({
  components: {
    UnitAddDialog: () => import('../dialogs/unit-add-dialog.vue'),
    UnitEditDialog: () => import('../dialogs/unit-edit-dialog.vue')
  }
})
export default class UnitManagerPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new UnitManagerViewModel(this.providers)

  showAddUnit = false
  showEditUnit = false
  edtingUnit: UnitModel = null

  searchName = ''
  searchCode = ''
  searchEmail = ''

  headers = [
    { text: 'Tên đơn vị', value: 'title', sortable: false },
    { text: 'Mã đơn vị', value: 'code', sortable: false },
    { text: 'Email đơn vị', value: 'email', sortable: true },
    { text: 'SĐT đơn vị', value: 'phone', sortable: false },
    { text: 'Địa chỉ', value: 'data.address', sortable: false },
    { text: 'Mô tả', value: 'description', sortable: false },
    { value: 'actions', align: 'right', sortable: false }
  ]

  editUnit(unit: UnitModel) {
    this.edtingUnit = unit
    this.showEditUnit = true
  }

  search() {
    this.viewmodel.search(this.searchName, this.searchCode, this.searchEmail)
  }
}
</script>

<style scoped></style>

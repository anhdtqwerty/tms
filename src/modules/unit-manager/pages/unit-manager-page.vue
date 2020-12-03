<template>
  <v-container fluid px-5 py-2>
    <v-row justify="space-between" align="center">
      <v-col cols="8" class="pa-2">
        <div class="text-h6">Đơn vị</div>
        <breadcrumbs />
      </v-col>
      <v-col cols="4" align="right" class="pa-2">
        <v-btn medium color="success" @click="showAddUnit = true">
          <v-icon left>add</v-icon>
          <span>Thêm đơn vị</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table :items="items" item-key="id" :headers="headers" mobile-breakpoint="0">
            <template v-slot:top>
              <v-container fluid class="px-5 py-0">
                <v-row>
                  <v-col cols="12" align="end" class="pa-2">
                    <v-btn icon x-small>
                      <v-icon>settings</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12" class="d-none d-sm-flex pa-2 align-center">
                    <v-text-field class="mr-4" hide-details dense outlined v-model="username" label="Mã cán bộ" />
                    <v-text-field class="mr-4" hide-details dense outlined v-model="username" label="Mã cán bộ" />
                    <v-text-field class="mr-4" hide-details dense outlined v-model="username" label="Mã cán bộ" />
                    <v-btn depressed color="primary" medium>
                      <span class="d-none d-md-flex">Tìm kiếm</span>
                      <v-icon dark>search</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </template>
            <template v-slot:[`item.name`]="{ item }">
              <router-link :to="`/unit/${item.code}`">
                {{ item.name }}
              </router-link>
            </template>

            <template v-slot:[`item.role.name`]="{ item }">
              <div class="staff-department">{{ item.department.title }}</div>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="showEditUnit = true">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteUnit(item)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <unit-add-dialog :value.sync="showAddUnit" />
    <unit-edit-dialog :value.sync="showEditUnit" />
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
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
  name = ''
  username = ''
  headers = [
    { text: 'Tên đơn vị', value: 'name', align: 'left', sortable: false },
    { text: 'Mã đơn vị', value: 'code', align: 'left', sortable: false },
    { text: 'Email đơn vị', value: 'email', align: 'left', sortable: true },
    { text: 'SĐT đơn vị', value: 'phone', align: 'left', sortable: false },
    { text: 'Mô tả', value: 'description', align: 'left', sortable: false },
    { value: 'actions', show: true, sortable: false }
  ]

  items = [
    { name: 'unit 1', code: 'unit1', email: 'unit1@unit.com', phone: '091231231', description: 'unit1 unit1 unit' }
  ]

  async deleteUnit() {
    const ok = await this.providers.alert.confirm(
      'XÁC NHẬN XÓA',
      'Bạn có Chắc Chắn muốn xóa Nhân viên này? Bạn sẽ không thể hoàn tác thao tác.'
    )
    console.log(ok)
  }
}
</script>

<style scoped></style>

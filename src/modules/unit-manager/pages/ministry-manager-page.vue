<template>
  <v-container fluid px-5 py-2>
    <v-row>
      <v-col cols="12" class="pa-2">
        <div class="text-h6">Bộ</div>
        <breadcrumbs />
      </v-col>
    </v-row>
    <v-row v-if="viewmodel.ministry">
      <v-col cols="12" class="pa-2">
        <div class="intro-background px-4 py-2">
          <v-row>
            <v-col cols="12" sm="10" lg="8" xl="6">
              <div class="intro-wrap pa-4">
                <div class="d-flex justify-space-between">
                  <div class="text-h5 font-weight-medium primary--text">{{ viewmodel.ministry.title }}</div>
                  <v-btn
                    v-if="$permission('system.unit.edit')"
                    class="d-flex d-sm-none"
                    icon
                    small
                    @click="editUnit(viewmodel.ministry)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </div>
                <div class="mt-6 font-weight-medium">
                  <!-- <div>Địa chỉ: 80 Trần Hưng Đạo, quận Hoàn Kiếm, Hà Nội</div> -->
                  <div>Mã đơn vị: {{ viewmodel.ministry.code }}</div>
                  <div>Điện thoại: {{ viewmodel.ministry.phone }}</div>
                  <div>Địa chỉ: {{ viewmodel.ministry | _get('data.address') }}</div>
                  <div>Email: {{ viewmodel.ministry.email }}</div>
                </div>
                <div class="mt-2 d-flex flex-column pa-4" style="border: 1px solid #1E88E5">
                  <span class="font-weight-medium">Mô tả</span>
                  <span class="mt-4">{{ viewmodel.ministry.description }} </span>
                </div>
              </div>
            </v-col>
            <v-col class="d-none d-sm-flex justify-end" cols="0" sm="2" lg="4" xl="6">
              <v-btn v-if="$permission('system.unit.edit')" icon small @click="editUnit(viewmodel.ministry)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
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
              <v-container fluid class="px-5 py-2">
                <v-row>
                  <v-col cols="12" class="pa-2 d-flex justify-space-between">
                    <div class="text-subtitle-1 font-weight-medium">Danh sách đơn vị trực thuộc</div>
                    <v-btn v-if="$permission('system.unit.add')" color="primary" small @click="showAddUnit = true">
                      <v-icon left>add</v-icon>Thêm
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
import { MinistryManagerViewModel } from '../viewmodels/ministry-manager-viewmodel'

@Component({
  components: {
    UnitAddDialog: () => import('../dialogs/unit-add-dialog.vue'),
    UnitEditDialog: () => import('../dialogs/unit-edit-dialog.vue')
  }
})
export default class MinistryManagerPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new MinistryManagerViewModel(this.providers)

  showAddUnit = false
  showEditUnit = false
  edtingUnit: UnitModel = null

  headers = [
    { text: 'Tên đơn vị', value: 'title', sortable: false },
    { text: 'Mã đơn vị', value: 'code', sortable: false },
    { text: 'Email đơn vị', value: 'email', sortable: false },
    { text: 'SĐT đơn vị', value: 'phone', sortable: false },
    { text: 'Địa chỉ', value: 'data.address', sortable: false },
    { text: 'Mô tả', value: 'description', sortable: false },
    { value: 'actions', align: 'right', sortable: false }
  ]

  editUnit(unit: UnitModel) {
    this.edtingUnit = unit
    this.showEditUnit = true
  }
}
</script>

<style scoped lang="scss">
.intro-background {
  background: url('../../../assets/ministry_cover.png') no-repeat center center;
  background-size: cover;
  // border: 8px solid transparent;
}
.intro-wrap {
  background-color: rgba($color: #fff, $alpha: 0.65);
}
</style>

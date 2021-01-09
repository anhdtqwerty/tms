<template>
  <v-menu
    top
    :close-on-content-click="true"
    :nudge-top="14"
    transition="scale-transition"
    offset-y
    min-width="290px"
    style="width:100%"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn medium color="success" v-bind="attrs" v-on="on">
        <span>Hành động</span>
        <v-icon right>expand_more</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-container fluid px-5 py-2>
        <v-row>
          <v-col cols="12" class="pa-2">
            <div class="mb-4" @click="taskActionCommon('edit')">
              <v-icon color="blue" left>edit</v-icon>
              <span class="blue--text">Cập nhật thông tin</span>
            </div>
            <div class="mb-4" @click="taskActionCommon('retrive')">
              <v-icon color="blue" left>replay</v-icon>
              <span class="blue--text">Thu hồi nhiệm vụ</span>
            </div>
            <div class="mb-4" @click="taskActionCommon('extend')">
              <v-icon color="blue" left>access_time</v-icon>
              <span class="blue--text">Gia hạn nhiệm vụ</span>
            </div>
            <div class="mb-4" @click="taskActionCommon('return')">
              <v-icon color="blue" left>replay</v-icon>
              <span class="blue--text">Trả lại nhiệm vụ</span>
            </div>
            <div class="mb-4" @click="taskActionCommon('assign')">
              <v-icon color="blue" left>pan_tool</v-icon>
              <span class="blue--text">Giao thực hiện</span>
            </div>
            <div class="mb-4" @click="taskActionCommon('approve')">
              <v-icon color="blue" left>offline_pin</v-icon>
              <span class="blue--text">Phê duyệt nhiệm vụ</span>
            </div>
            <div class="mb-4" @click="taskActionCommon('editStatus')">
              <v-icon color="blue" left>account_box</v-icon>
              <span class="blue--text">Cập nhật tiến độ</span>
            </div>
            <div class="mb-4">
              <v-icon color="blue" left>edit</v-icon>
              <span class="blue--text">Sửa cập nhật</span>
            </div>
            <div class="mb-4">
              <v-icon color="blue" left>delete</v-icon>
              <span class="blue--text">Xóa cập nhật</span>
            </div>
            <div class="mb-4">
              <v-icon color="blue" left>lock_open</v-icon>
              <span class="blue--text">Mở lại nhiệm vụ</span>
            </div>
            <div class="mb-4">
              <v-icon color="blue" left>delete</v-icon>
              <span class="blue--text">Xóa nhiệm vụ</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Inject, PropSync, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class TaskActionDialog extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean

  taskActionCommon(typeAction: string) {
    this.$emit('task-action', typeAction)
  }
}
</script>

<style scoped></style>

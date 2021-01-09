<template>
  <v-menu attach :close-on-content-click="true" transition="scale-transition" left>
    <template v-slot:activator="{ on }">
      <v-btn small icon v-on="on">
        <v-icon>
          more_vert
        </v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item-title class="mb-4 px-4" @click="taskActionCommon('edit')">
        <v-icon color="blue" left>edit</v-icon>
        <span class="blue--text">Cập nhật thông tin</span>
      </v-list-item-title>
      <v-list-item-title class="mb-4 px-4" @click="taskActionCommon('retrive')">
        <v-icon color="blue" left>replay</v-icon>
        <span class="blue--text">Thu hồi nhiệm vụ</span>
      </v-list-item-title>
      <v-list-item-title class="mb-4 px-4" @click="taskActionCommon('extend')">
        <v-icon color="blue" left>access_time</v-icon>
        <span class="blue--text">Gia hạn nhiệm vụ</span>
      </v-list-item-title>
      <v-list-item-title class="mb-4 px-4" @click="taskActionCommon('return')">
        <v-icon color="blue" left>replay</v-icon>
        <span class="blue--text">Trả lại nhiệm vụ</span>
      </v-list-item-title>
      <v-list-item-title class="mb-4 px-4" @click="taskActionCommon('assign')">
        <v-icon color="blue" left>pan_tool</v-icon>
        <span class="blue--text">Giao thực hiện</span>
      </v-list-item-title>
      <v-list-item-title class="mb-4 px-4" @click="taskActionCommon('approve')">
        <v-icon color="blue" left>offline_pin</v-icon>
        <span class="blue--text">Phê duyệt nhiệm vụ</span>
      </v-list-item-title>
      <v-list-item-title class="mb-4 px-4" @click="taskActionCommon('editStatus')">
        <v-icon color="blue" left>account_box</v-icon>
        <span class="blue--text">Cập nhật tiến độ</span>
      </v-list-item-title>
      <v-list-item-title class="mb-4 px-4">
        <v-icon color="blue" left>edit</v-icon>
        <span class="blue--text">Sửa cập nhật</span>
      </v-list-item-title>
      <v-list-item-title class="mb-4 px-4">
        <v-icon color="blue" left>delete</v-icon>
        <span class="blue--text">Xóa cập nhật</span>
      </v-list-item-title>
      <v-list-item-title class="mb-4 px-4" @click="taskActionCommon('reOpen')">
        <v-icon color="blue" left>lock_open</v-icon>
        <span class="blue--text">Mở lại nhiệm vụ</span>
      </v-list-item-title>
      <v-list-item-title class="mb-4 px-4">
        <v-icon color="blue" left>delete</v-icon>
        <span class="blue--text">Xóa nhiệm vụ</span>
      </v-list-item-title>
    </v-list>
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

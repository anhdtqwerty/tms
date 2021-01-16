<template>
  <v-menu attach :close-on-content-click="true" transition="scale-transition" left>
    <template v-slot:activator="{ on }">
      <v-btn small icon v-on="on">
        <v-icon>
          more_vert
        </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-container fluid px-5 py-2>
        <v-row>
          <v-col cols="12" class="pa-2">
            <div class="mb-4" @click="actionSubTask('detail')">
              <v-icon color="blue" left>visibility</v-icon>
              <span class="blue--text" style="cursor: pointer">Xem nhiệm vụ </span>
            </div>
            <div class="mb-4" @click="actionSubTask('edit')">
              <v-icon color="blue" left>edit</v-icon>
              <span class="blue--text" style="cursor: pointer">Sửa nhiệm vụ</span>
            </div>
            <div class="mb-4" @click="actionSubTask('delete')">
              <v-icon color="blue" left>delete</v-icon>
              <span class="blue--text" style="cursor: pointer">Xóa nhiệm vụ</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { TaskModel } from '@/models/task-model'
import { Component, Inject, Prop, PropSync, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class TaskSubActionMenu extends Vue {
  @Inject() providers!: AppProvider
  @PropSync('value', { type: Boolean, default: false }) syncedValue!: boolean
  @Prop() task: TaskModel

  actionSubTask(typeAction: string) {
    this.$emit('sub-task-action', typeAction)
  }
}
</script>

<style scoped></style>

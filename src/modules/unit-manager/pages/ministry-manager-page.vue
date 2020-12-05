<template>
  <v-container fluid px-5 py-2>
    <v-row>
      <v-col cols="12" class="pa-2">
        <div class="text-h6">Cài đặt vai trò</div>
        <breadcrumbs />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-2">
        <div class="intro-background px-4 py-2">
          <v-row>
            <v-col cols="12" md="10" lg="8" xl="6">
              <div class="intro-wrap pa-4">
                <div class="text-h5 font-weight-medium primary--text">Bộ giao thông vận tải</div>
                <div class="mt-6 font-weight-medium">
                  <div>Địa chỉ: 80 Trần Hưng Đạo, quận Hoàn Kiếm, Hà Nội</div>
                  <div>Mã đơn vị: gov123456</div>
                  <div>Điện thoại: 024.38221973</div>
                  <div>Email: vpbaocao@mt.gov.vn</div>
                </div>
                <div class="mt-2 d-flex flex-column pa-4" style="border: 1px solid #1E88E5">
                  <span class="font-weight-medium">Mô tả</span>
                  <span
                    >Vụ Kế hoạch - Đầu tư là tổ chức tham mưu giúp Bộ trưởng quản lý về kế hoạch và đầu tư, bao gồm:
                    Chiến lược, quy hoạch, chuẩn bị đầu tư, kế hoạch đầu tư phát triển và công tác thống kê trong ngành
                    Giao thông vận tải.
                  </span>
                  <span>
                    1. Chủ trì tổ chức xây dựng và tổng hợp chiến lược, quy hoạch, kế hoạch phát triển giao thông vận
                    tải 5 năm và hàng năm để Bộ trưởng trình Thủ tướng Chính phủ phê duyệt hoặc phê duyệt theo thẩm
                    quyền; hướng dẫn và kiểm tra việc xây dựng, thực hiện chiến lược, quy hoạch, kế hoạch phát triển các
                    chuyên ngành giao thông vận tải.
                  </span>
                  <span
                    >2. Tham mưu trình Bộ trưởng quy định về công tác thống kê ngành Giao thông vận tải; chủ trì, phối
                    hợp với các tổ chức, cơ quan, đơn vị tổng hợp công tác thống kê trong toàn ngành; lập báo cáo thống
                    kê thường xuyên, chuyên đề theo quy định.
                  </span>
                  <span
                    >3. Tổ chức thực hiện việc giao kế hoạch vốn đầu tư cho Tổng cục, Cục, chủ đầu tư, ban quản lý dự án
                    thuộc Bộ; hướng dẫn, kiểm tra và tổng hợp tình hình thực hiện kế hoạch vốn đầu tư.
                  </span>
                  <span
                    >4. Chủ trì tổ chức xây dựng, tổng hợp chiến lược, kế hoạch vận động vốn ODA và vốn vay ưu đãi; điều
                    phối, quản lý các nguồn vốn này, bao gồm:
                  </span>
                  <span
                    >a) Xây dựng chiến lược, kế hoạch, tổng hợp danh mục, đề cương chi tiết các chương trình, dự án ưu
                    tiên để thu hút nguồn vốn ODA và vốn vay ưu đãi, các nguồn tín dụng khác để Bộ trưởng trình Thủ
                    tướng Chính phủ phê duyệt hoặc phê duyệt theo thẩm quyền; </span
                  ><span
                    >b) Chủ trì tham mưu tổ chức vận động, điều phối, đàm phán, ký kết, gia nhập các điều ước quốc tế về
                    vốn ODA và vốn vay ưu đãi phù hợp với chiến lược, quy hoạch, kế hoạch và danh mục chương trình, dự
                    án ưu tiên được phê duyệt;
                  </span>
                  <span>
                    c) Thẩm định để Bộ trưởng trình cấp có thẩm quyền phê duyệt hoặc phê duyệt theo thẩm quyền văn kiện,
                    chương trình, dự án sử dụng vốn ODA;
                  </span>
                  <span
                    >d) Theo dõi, đánh giá chương trình dự án, định kỳ tổng hợp báo cáo Bộ trưởng về tình hình và hiệu
                    quả thu hút, sử dụng vốn ODA, vốn vay ưu đãi và các nguồn tín dụng khác</span
                  >
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-data-table :items="viewmodel.users" item-key="id" :headers="headers" mobile-breakpoint="0">
            <template v-slot:top>
              <v-container fluid class="px-5 py-2">
                <v-row>
                  <v-col cols="12" class="pa-2 d-flex justify-space-between">
                    <div class="text-subtitle-1 font-weight-medium">Danh sách cán đơn vị trực thuộc</div>
                    <v-btn color="primary" small> <v-icon left>add</v-icon>Thêm </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small @click="item">
                mdi-pencil
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { AppProvider } from '@/app-provider'
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'
import { MinistryManagerViewModel } from '../viewmodels/ministry-manager-viewmodel'

@Component
export default class MinistryManagerPage extends Vue {
  @Inject() providers!: AppProvider
  @Provide() viewmodel = new MinistryManagerViewModel(this.providers)

  headers = [
    { text: 'Họ và Tên', value: 'name', align: 'left', sortable: false },
    { text: 'Mã cán bộ', value: 'id', align: 'left', sortable: false },
    { text: 'Tên truy cập', value: 'username', align: 'left', sortable: true },
    { text: 'Trạng Thái', value: 'status', align: 'left', sortable: false },
    { text: 'Phòng ban', value: 'department', align: 'left', sortable: true },
    { text: 'Chức vị', value: 'position', align: 'left', sortable: true },
    { text: 'Email', value: 'email', align: 'left', sortable: false },
    { text: 'Xóa', value: 'actions', show: true }
  ]
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

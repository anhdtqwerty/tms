<script lang="ts">
import { VTextarea } from 'vuetify/lib'

import { Component, Prop } from 'vue-property-decorator'

@Component({})
export default class AppTextarea extends VTextarea {
  @Prop({ default: true }) outlined!: boolean
  @Prop({ default: true }) dense!: boolean
  @Prop({ default: true }) validateOnBlur!: boolean
}
</script>

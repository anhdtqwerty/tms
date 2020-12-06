<script lang="ts">
import { VTextField } from 'vuetify/lib'

import { Component, Prop } from 'vue-property-decorator'

@Component({})
export default class AppTextField extends VTextField {
  @Prop({ default: true }) outlined!: boolean
  @Prop({ default: true }) dense!: boolean
  @Prop({ default: true }) validateOnBlur!: boolean
}
</script>

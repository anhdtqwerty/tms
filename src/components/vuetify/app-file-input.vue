<script lang="ts">
import { VFileInput } from 'vuetify/lib'

import { Component, Prop } from 'vue-property-decorator'

@Component({})
export default class AppFileInput extends VFileInput {
  @Prop({ default: true }) outlined!: boolean
  @Prop({ default: true }) dense!: boolean
  @Prop({ default: '' }) prependIcon!: string
}
</script>

<template>
  <router-link v-if="to" :to="to" style="text-decoration: none"><slot /></router-link>
  <div v-else @click="$emit('click', $event)" class="primary--text" style="cursor: pointer">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class TextLink extends Vue {
  @Prop() to: string
}
</script>

<style lang="scss" scoped></style>

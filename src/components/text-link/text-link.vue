<template>
  <div @click="$emit('click', $event)" class="primary--text" style="cursor: pointer">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class TextLink extends Vue {}
</script>

<style lang="scss" scoped></style>

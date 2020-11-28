<template>
  <v-breadcrumbs class="pa-0" :items="items"
    ><template v-slot:divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template></v-breadcrumbs
  >
</template>

<script>
export default {
  computed: {
    items() {
      return this.$route.matched.map(item => {
        const title = item.meta && item.meta.title ? item.meta.title : ''
        const path = item.path ? item.path : '/'
        return {
          text: title,
          disabled: false,
          href: path
        }
      })
    }
  }
}
</script>
<style scope>
.v-breadcrumbs__item {
  color: #9e9e9e !important;
}
</style>

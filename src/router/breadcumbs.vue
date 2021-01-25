<template>
  <div class="d-flex">
    <div class="d-flex" v-for="(item, index) in items" :key="index">
      <router-link :to="item.path" class="breadcrumb-item">{{ item.text }}</router-link>
      <span v-if="index < items.length - 1" class="mx-2">/</span>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    items() {
      return this.$route.matched.map((item, index) => {
        const title = item.meta && item.meta.title ? item.meta.title : ''
        const path = item.path || '/dashboard'
        console.log(path)
        return {
          text: title,
          disabled: false,
          path: this.$route.matched.length - 1 !== index ? path : ''
        }
      })
    }
  }
}
</script>
<style scope>
.breadcrumb-item {
  color: #9e9e9e !important;
  text-decoration: none;
}
</style>

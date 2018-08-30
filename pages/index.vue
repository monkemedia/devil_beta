<template lang="pug">
  div
    h1 Homepage
    nuxt-link(to="/product/cars/5b86d9d47cd8ec3f4dbb25af") product
</template>

<script>
  export default {
    middleware: [
      'init-auth'
    ]
  }
</script>

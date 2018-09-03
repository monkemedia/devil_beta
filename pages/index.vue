<template lang="pug">
  div
    h1 Homepage
    nuxt-link(to="/product/cars/5b86d9d47cd8ec3f4dbb25af") product
    br
    nuxt-link(to="/product/cars/5b8d89601d976b68bbe5e822") product two
    br
    nuxt-link(to="/product/cars/5b8da8711d976b68bbe5e824") product three
</template>

<script>
  export default {
    middleware: [
      'init-auth'
    ]
  }
</script>

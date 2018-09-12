<template lang="pug">
 .columns
  .column
        header
          //- breadcrumb(:crumb="breadcrumb")
          h1.add-product-heading Stock your shop

        section
          ul
            li(v-for="n in 10")
              nuxt-link(to="listings/create") test
</template>

<script>
  export default {
    name: 'Listings',

    data () {
      return {
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>

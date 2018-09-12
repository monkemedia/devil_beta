<template lang="pug">
 .columns
  .column
        header
          //- breadcrumb(:crumb="breadcrumb")
          h1.add-product-heading Stock your shop

        section
          .columns
            .column.is-3
              nuxt-link(to="listings/create")
                .card.add-item
                  .card-content
                    | add item
            .column.is-3(v-for="n in 9")
              ListingItem
</template>

<script>
  import ListingItem from './ListingItem'

  export default {
    name: 'Listings',

    components: {
      ListingItem
    },

    data () {
      return {
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .add-item
    height 100%
</style>

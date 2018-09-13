<template lang="pug">
 .columns
  .column
        header
          //- breadcrumb(:crumb="breadcrumb")
          h1.add-product-heading Stock your shop
        section
          .columns.is-multiline
            .column.is-3
              nuxt-link(to="listings/create")
                .card.add-item
                  .card-content
                    | add item
            .column.is-3(v-for="(item, index) in vendorProducts")
              ListingItem(:item="item" :index="index")
            .column.is-3(v-for="n in itemPlaceholders()")
              ListingItem()
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
    },

    computed: {
      vendorProducts () {
        return this.$store.getters['products/loadedVendorProducts']
      }
    },

    methods: {
      itemPlaceholders () {
        return 7 - this.vendorProducts.length
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .add-item
    height 100%
</style>

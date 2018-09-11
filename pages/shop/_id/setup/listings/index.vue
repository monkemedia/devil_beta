<template lang="pug">
  div
    steps
    listings
</template>

<script>
  // import Breadcrumb from '@/components/Breadcrumbs/AdminBreadcrumb'
  import Steps from '@/components/Shop/Admin/Steps'
  import Listings from '@/components/Shop/Admin/Listings'

  export default {
    name: 'ShopListings',

    //   layout: 'shopSetup',

    middleware: [
      'init-auth',
      // 'auth',
      'add-item-error'
    ],

    components: {
      // Breadcrumb,
      Steps,
      Listings
    },

    async fetch ({ store }) {
      const shopId = store.getters['user/shopId']

      return store.dispatch('shop/fetchShop', shopId)
    },

    mounted () {
      if (!process.client) return

      const shopId = this.$store.getters['user/shopId']

      return this.$store.dispatch('shop/fetchShop', shopId)
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .add-product-heading
    display inline-flex
    align-items center

    .tag
      margin-left 1rem
</style>

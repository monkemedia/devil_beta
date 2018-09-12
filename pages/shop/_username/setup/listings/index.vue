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

    // async fetch ({ store, params, error }) {
    //   const paramId = params.id

    //   return api.products.vendorProduct(paramId)
    //     .then(res => {
    //       if (res.data.product !== null) {
    //         return store.commit('products/SET_VENDOR_PRODUCT', res.data.product)
    //       }

    //       store.commit('products/SET_VENDOR_PRODUCT', null)
    //       error({ statusCode: 404, message: 'This page cannot be found', path: '/admin/add-product' })
    //     })
    //     .catch(err => {
    //       if (err.response) {
    //         error({ statusCode: err.response.status, message: err.response.data.message })
    //       } else {
    //         error({ statusCode: 404, message: 'This page cannot be found', path: '/admin/add-product' })
    //       }
    //     })
    // },

    // mounted () {
    //   if (!process.client) return

    //   const paramId = this.$route.params.id

    //   return api.products.vendorProduct(paramId)
    //     .then(res => {
    //       if (res.data.product !== null) {
    //         return this.$store.commit('products/SET_VENDOR_PRODUCT', res.data.product)
    //       }

    //       this.$store.commit('products/SET_VENDOR_PRODUCT', null)
    //       this.error({ statusCode: 404, message: 'This page cannot be found', path: '/admin/add-product' })
    //     })
    // },

    async fetch ({ store }) {
      const shopId = store.getters['user/shopId']

      return store.dispatch('shop/fetchShop', shopId)
        .then(() => {
          return store.dispatch('products/vendorProducts')
        })
    },

    mounted () {
      if (!process.client) return

      const shopId = this.$store.getters['user/shopId']

      return this.$store.dispatch('shop/fetchShop', shopId)
        .then(() => {
          return this.$store.dispatch('products/vendorProducts')
        })
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

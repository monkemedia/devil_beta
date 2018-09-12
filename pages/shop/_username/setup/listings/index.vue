<template lang="pug">
  div
    steps
    listings(@deleteProduct="deleteProduct")
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
    },

    created () {
      this.$root.$on('deleteProduct', (payload) => {
        this.deleteProduct(payload)
      })
    },

    methods: {
      deleteProduct (payload) {
        const loadingComponent = this.$loading.open()

        return this.$store.dispatch('products/deleteProduct', payload)
          .then(() => {
            loadingComponent.close()
            this.alertToast({ message: 'Item has been deleted', type: 'is-success' })
          })
          .catch(() => {
            this.alertToast({ message: 'Your item cannot be deleted', type: 'is-warning' })
            loadingComponent.close()
          })
      }
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

<template lang="pug">
  .container
    .columns
      .column
        //- breadcrumb(:crumb="breadcrumb" v-if="loadedProduct")
    .columns
      .column.is-half
        image-carousel(:images="loadedProduct.images" v-if="loadedProduct")
      .column.is-offset-1.is-5
        product-details(:product="loadedProduct" v-if="loadedProduct")
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumbs/DefaultBreadcrumb'
  import ImageCarousel from '@/components/Product/ImageCarousel'
  import ProductDetails from '@/components/Product/ProductDetails'

  export default {
    middleware: [
      'init-auth'
    ],

    components: {
      Breadcrumb,
      ImageCarousel,
      ProductDetails
    },

    async fetch ({ store, params, error }) {
      const productId = params.id

      console.log('productId', productId)

      return store.dispatch('products/product', productId)
        .catch(err => {
          if (err.response) {
            return error({ statusCode: err.response.status, message: err.response.data.error })
          }
          error({ statusCode: 404, message: 'This page cannot be found' })
        })
    },

    computed: {
      loadedProduct () {
        return this.$store.getters['products/loadedProduct']
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .not-available
    font-size $size-180
</style>

<template lang="pug">
  .container
    .columns
      .column
        breadcrumb(:crumb="breadcrumb" v-if="loadedItem")
    .columns
      .column.is-half
        image-carousel(:images="loadedItem.images" v-if="loadedItem")
      .column.is-offset-1.is-5
        product-details(:product="loadedItem" v-if="loadedItem")
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumbs/DefaultBreadcrumb'
  import ImageCarousel from '@/components/Product/ImageCarousel'
  import ProductDetails from '@/components/Product/ProductDetails'

  export default {
    middleware: [
      'check-auth',
      'cart'
    ],

    components: {
      Breadcrumb,
      ImageCarousel,
      ProductDetails
    },

    asyncData (context) {
      const paramId = context.params.id
      const paramCat = context.params.cat
      const userId = context.store.getters['auth/userId']
      const vm = this

      return context.app.$axios.$get(`${process.env.BASE_URL}/categories/${paramCat}/${paramId}.json`)
        .then(result => {
          return {
            loadedItem: result,
            breadcrumb: {
              title: 'Back',
              path: `/product/${result.category}`
            }
          }
        })
        .catch(err => {
          if (err.response) {
            return context.error({ statusCode: err.response.status, message: err.response.data.error })
          }
          context.error({ statusCode: 404, message: 'This page cannot be found' })
        })
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .not-available
    font-size $size-medium
</style>

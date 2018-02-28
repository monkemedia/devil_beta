<template lang="pug">
  .container
    .columns
      .column
        breadcrumb(:crumb="breadcrumb")
    .columns
      .column.is-half
        image-carousel(:images="loadedItem.images")
      .column.is-offset-1.is-5
        product-details(:product="loadedItem")
    .columns(v-if="")
      .column.has-text-centered
        p.not-available This item no longer available
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumbs/DefaultBreadcrumb'
  import ImageCarousel from '@/components/Product/ImageCarousel'
  import ProductDetails from '@/components/Product/ProductDetails'

  export default {
    middleware: [
      'check-auth'
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
              route: `/product/${result.category}` 
            }
          }
        })
        .catch(err => {
          console.log('error', err)
        })
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .not-available
    font-size $size-medium
</style>
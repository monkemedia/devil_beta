<template lang="pug">
  .media
    .media-left
      figure(v-if="cartItem.images")
        lazy-image(
          :src="cartItem.images[0].url + '-/resize/70/-/crop/70x70/center/'"
          :small-src="cartItem.images[0].url + '-/resize/70/-/crop/70x70/center/'"
          :alt="cartItem.images[0].alt")
      figure.no-image(v-else)
        i.fa.fa-file-image-o(aria-hidden="true")
    .media-content
      h6
        router-link(:to="'/' + cartItem.category + '/' + cartItem.product_id") {{ cartItem.name }}
      span.seller By {{ cartItem.cart_reference | makeUsername }}
      .level
        .level-left.quantity Qty: {{ cartItem.quantity }}
        .level-right.price
          //- span(v-if="cartItem.on_sale")
          //-   | {{ cartItem.sale_price | currency }}
          span
            | {{ cartItem.unit_price.amount | currency(cartItem.unit_price.currency) }}
</template>

<script>
  export default {
    name: 'MiniCartItems',

    props: {
      cartItem: {
        type: Object,
        required: true
      }
    },

    computed: {
      getPath () {
        return this.$route.name
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'
  @import '~assets/css/utilities/mixins.styl'

  figure
    width 70px
    height 70px
    margin 0
    img
      max-height 100%
      width 100%
  h6
    font-size $size-150
    margin-bottom .4rem

  .media + .media
    border-top 0
    margin-top 0
    padding-top 0

  .quantity
  .price
    font-size $size-130
    BoldUppercase()

  .order-summary
    .price
      font-size $size-160

  .no-image
    justify-content center
    align-items center
    display flex
    background $grey-lighter
    .fa
      font-size 2rem
</style>

<template lang="pug">
  .media
    .media-left
      figure(v-if="cartItem.item.images")
        lazy-image(
          :src="cartItem.item.images[0].url + '-/resize/70/-/crop/70x70/center/'"
          :small-src="cartItem.item.images[0].url + '-/resize/70/-/crop/70x70/center/'"
          :alt="cartItem.item.images[0].alt")
      figure.no-image(v-else)
        i.fa.fa-file-image-o(aria-hidden="true")
    .media-content
      h6
        router-link(:to="'/' + cartItem.item.category + '/' + cartItem.item.product_id") {{ cartItem.item.title }}
      span.seller By {{ cartItem.item.username }}
      .level
        .level-left.quantity Qty: {{ cartItem.quantity }}
        .level-right.price
          span(v-if="cartItem.item.on_sale")
            | {{ cartItem.item.sale_price | currency }}
          span(v-else)
            | {{ cartItem.item.price | currency }}
</template>

<script>
  export default {
    name: 'MiniCartItems',

    props: {
      cartItem: {
        type: Object,
        required: true
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
    img
      max-height 100%
      width 100%
  h6
    font-size $size-150
    margin-bottom .4rem

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

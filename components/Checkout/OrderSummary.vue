<template lang="pug">
  .order-summary
    header
      h2.h3 Order summary
    section
      .cart-items(v-if="paramName !== 'cart'")
        mini-cart-items(v-for="(cartItem, index) in loadedCartItems" v-if="index < 5" :key="index" :cartItem="cartItem")
      .row.subtotal
        span Subtotal ({{ cartTotalItems }} {{ item }})
        span {{ cartSubtotal | currency }}
      .row.shipping
        span Shipping
        span N/A
      .row.total
        span Estimated total
        span {{ cartSubtotal + shipping | currency }}
    footer(v-show="pageName !== 'checkout'")
      nuxt-link(to="/checkout").button.is-primary.is-fullwidth.is-flip
        span(data-text="Check out") Check out

</template>

<script>
  import MiniCartItems from '@/components/MiniCart/items'

  export default {
    name: 'OrderSummary',

    props: {
      isSoldOut: {
        required: false,
        type: Boolean,
        default: false
      }
    },

    components: {
      MiniCartItems
    },

    data () {
      return {
        shipping: 0,
        paramName: this.$route.name
      }
    },

    computed: {
      pageName () {
        return this.$route.name
      },

      loadedCartItems () {
        return this.$store.getters['cart/loadedCartItems']
      },

      cartTotalItems () {
        return this.$store.getters['cart/cartTotalItems']
      },

      cartSubtotal () {
        return this.$store.getters['cart/cartSubtotal']
      },

      item () {
        if (this.cartTotalItems === 1) {
          return 'item'
        }
        return 'items'
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'
  @import '~assets/css/utilities/mixins.styl'

  .order-summary
    background-color $white
    padding 2.5rem 2rem
    BoldUppercase()
    font-size $size-140
    border 4px solid $secondary

  header
    border-bottom 1px solid $grey-300

  h2
    margin-top 0

  .cart-items
    border-bottom 1px solid $grey-300

  .media
    padding 2rem 0

  .row
    padding 1.5rem 0
    justify-content space-between
    display flex

    span
      display inline-flex
      &:first-child
        color $grey
      &:last-child
        font-size $size-160

    &.subtotal
    &.shipping
      border-bottom 1px solid $grey-300

    &.total
      padding-bottom 0
      span
        &:first-child
          color $secondary
          font-size $size-240
        &:last-child
          font-size $size-240

  .button
    margin-bottom 0

</style>

<template lang="pug">
  .order-summary
    header
      h2.h3 Order summary
      hr
    section
      .row
        span Subtotal ({{ cartTotalItems }} {{ item }})
        span {{ cartSubtotal | currency }}
      .row
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
  export default {
    name: 'OrderSummary',

    props: {
      isSoldOut: {
        required: false,
        type: Boolean,
        default: false
      }
    },

    data () {
      return {
        shipping: 0
      }
    },

    computed: {
      pageName () {
        return this.$route.name
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

  h2
    margin-top 0

  .row
    padding 1.5rem 0
    justify-content space-between
    display flex
    span
      display inline-flex
      &:first-child
        color $grey
      &:last-child
        font-size $size-150

    &.total
      span
        &:first-child
          color $secondary
          font-size $size-240
        &:last-child
          font-size $size-240

  .button
    margin-bottom 0

</style>

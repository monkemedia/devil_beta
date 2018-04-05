<template lang="pug">
  div
    .mini-cart-mobile
      span {{ cartTotalItems }}
    .dropdown.mini-cart-desktop-container(:class="{ 'is-active': isActive }")
      .dropdown-trigger
        a.mini-cart-desktop(aria-haspopup="true" aria-controls="dropdown-menu-mini-cart" @click="isActive = !isActive" v-on-clickaway="away")
          span.mini-cart-label My Cart
          span.cart-count {{ cartTotalItems }}
      .dropdown-menu#dropdown-menu-mini-cart(role="menu")
        .dropdown-content
          .dropdown-item.empty-cart(v-if="loadedCartItems.length === 0")
            p Your cart is empty
          .dropdown-item(v-else)
            .columns(v-for="(cartItem, index) in loadedCartItems" v-if="index < 5")
              .column.is-4
                figure(v-if="cartItem.item.images")
                  lazy-image(
                    :src="cartItem.item.images[0].url + '-/resize/70/-/crop/70x70/center/'"
                    :small-src="cartItem.item.images[0].url + '-/resize/70/-/crop/70x70/center/'"
                    :alt="cartItem.item.images[0].alt")
                figure.no-image(v-else)
                  i.fa.fa-file-image-o(aria-hidden="true")
              .column
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
              .columns(v-if="index > 5")
                .column.has-text-centered
                  nuxt-link.view-more(to="") view all items
            .columns
              .subtotal
                .column
                  | Subtotal
                .column.has-text-right
                  | {{ cartSubtotal | currency }}
            .columns
              .column
                nuxt-link(to="/cart").button.is-flip.is-fullwidth
                  span(data-text="View cart") View cart
              .column
                nuxt-link(to="/checkout").button.is-flip.is-secondary.is-fullwidth
                  span(data-text="Checkout") Checkout
</template>

<script>
  import { mixin as clickaway } from 'vue-clickaway'

  export default {
    name: 'MiniCart',

    mixins: [
      clickaway
    ],

    data () {
      return {
        isActive: false,
        cartData: null
      }
    },

    async fetch ({ store }) {
      store.dispatch('cart/fetchCartData')
    },

    mounted () {
      if (process.client) {
        this.$store.dispatch('cart/fetchCartData')
      }
    },

    methods: {
      away () {
        this.isActive = false
      }
    },

    computed: {
      loadedCartItems () {
        return this.$store.getters['cart/loadedCartItems']
      },

      cartTotalItems () {
        return this.$store.getters['cart/cartTotalItems']
      },

      cartSubtotal () {
        return this.$store.getters['cart/cartSubtotal']
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'
  @import '~assets/css/utilities/mixins.styl'

  .mini-cart-mobile
    background-image url('~assets/images/mini-cart-icon.svg')
    margin 0 0 0 2.4rem
    position relative
    height 19px
    width 19px
    margin-top -1px
    background-size contain

    span
      color $white
      position absolute
      top 8px
      left 7px
      line-height 1
      font-family $family-primary
      font-size $size-100

  .mini-cart-desktop-container
    display none
    .mini-cart-desktop
      BoldUppercase()
      color $white
      font-size $size-120
      display inline-flex
      padding-right 2rem

      .mini-cart-label
        background $primary
        padding 1rem $size-130
      .cart-count
        background $dark-red
        padding 1rem $size-130
        width 38px
        text-align center
  .dropdown-menu
    width 350px
    left auto
    right 20px
    padding-top 2.1rem

    .dropdown-content
      padding 3rem 1.5rem
      box-shadow none
      border 3px solid $primary
      border-radius 0

      .dropdown-item
        min-height 200px
        .view-more
          text-decoration underline
          font-size 1.2rem
          &:hover
          &:focus
            text-decoration none
        &.empty-cart
          justify-content center
          align-items center
          display flex
          p
            color $secondary

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

      .subtotal
        border-top 1px solid $grey-300
        border-bottom 1px solid $grey-300
        font-size $size-150
        margin 1.5rem 0
        display flex
        width 100%
        BoldUppercase()

      .button
        margin 0

    .no-image
      justify-content center
      align-items center
      display flex
      .fa
        font-size 5rem

  @media only screen and (min-width: $desktop)
    .mini-cart-mobile
      display none
    .mini-cart-desktop-container
      display inline-flex
</style>

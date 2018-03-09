<template lang="pug">
  div
    .mini-cart-mobile 
      span {{ cartTotalItems }}
    .dropdown.mini-cart-desktop-container(:class="{ 'is-active': isActive }")
      .dropdown-trigger
        a.mini-cart-desktop(aria-haspopup="true" aria-controls="dropdown-menu-mini-cart" @click="isActive = !isActive" v-on-clickaway="away")
          span.mini-cart-label My Cart
          span.cart-count {{ cartTotalItems }}
      //- .dropdown-menu#dropdown-menu-mini-cart(role="menu")
      //-   .dropdown-content
      //-     .dropdown-item.empty-cart(v-if="!cartItems")
      //-       p Your cart is empty
      //-     .dropdown-item(v-else)
      //-       .columns(v-for="(cartItem, index) in cartData" v-if="index < 5")
      //-         .column.is-4
      //-           figure
      //-             lazy-image(
      //-               :src="cartItem.images[0].url + '-/resize/70/-/crop/70x70/center/'"
      //-               :small-src="cartItem.images[0].url + '-/resize/70/-/crop/70x70/center/'"
      //-               :alt="cartItem.images[0].alt")
      //-         .column
      //-           h6 
      //-             router-link(:to="'/' + cartItem.category + '/' + cartItem.product_id") {{ cartItem.title }}
      //-           span.seller By {{ cartItem.username }}
      //-           .level
      //-             .level-left.quantity Qty: {{ cartItems[index].quantity }}
      //-             .level-right.price
      //-               span(v-if="cartItem.on_sale")
      //-                 | {{ cartItem.sale_price | currency }}
      //-               span(v-else)
      //-                 | {{ cartItem.price | currency }}
      //-       .columns(v-else)
      //-         .column.has-text-centered
      //-           nuxt-link.view-more(to="") view all items
      //-       .columns
      //-         .subtotal
      //-           .column
      //-             | Subtotal
      //-           .column.has-text-right 
      //-             | {{ cartSubtotal | currency }}

      //-       .columns
      //-         .column
      //-           a.button.is-flip.is-fullwidth
      //-             span(data-text="View cart") View cart
      //-         .column
      //-           a.button.is-flip.is-secondary.is-fullwidth
      //-             span(data-text="Checkout") Checkout
</template>

<script>
  import { mixin as clickaway } from 'vue-clickaway'
  import axios from 'axios'

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

    mounted () {
      this.getCartData()
    },

    methods: {
      away () {
        this.isActive = false
      },

      getCartData () {  
        const cartItems = this.cartItems
        const promises = []
        const newArray = []

        if (cartItems) {
          cartItems.forEach((item) => {
            promises.push(axios.get(`${process.env.BASE_URL}/products/${item.product_id}.json`))
          })

          axios.all(promises)
            .then((result) => {
              result.forEach((item) => {
                newArray.push(item.data)
              })
            })
          this.cartData = newArray
        }
      }
    },

    computed: {
      cartTotalItems () {
        return this.$store.getters['cart/cartTotalItems']
      },

      cartSubtotal () {
        return this.$store.getters['cart/cartSubtotal']
      }
    },

    watch: {
      cartItems (value) {
        this.getCartData()
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
      font-size $size-smaller
  
  .mini-cart-desktop-container
    display none
    .mini-cart-desktop
      BoldUppercase()
      color $white
      font-size $size-small
      display inline-flex
      padding-right 2rem

      .mini-cart-label
        background $primary
        padding 1rem 1.3rem
      .cart-count
        background $dark-red
        padding 1rem 1.3rem
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
        font-size $size-normal
        margin-bottom .4rem
      
      .seller
        font-size $size-small
        color $grey
        display flex
        margin-bottom .3rem
        BoldUppercase()

      .quantity
      .price
        font-size 1.3rem
        BoldUppercase()
      
      .subtotal
        border-top 1px solid $grey-300
        border-bottom 1px solid $grey-300
        font-size $size-normal
        margin 1.5rem 0
        display flex
        width 100%
        BoldUppercase()
      
      .button
        margin 0
    
  @media only screen and (min-width: $desktop)
    .mini-cart-mobile
      display none
    .mini-cart-desktop-container
      display inline-flex
</style>
<template lang="pug">
  .card
    header.card-header
      .card-header-title
        p 2. Review items & shipping
    .card-content
      .content
        form
          .columns
            .column
              .columns.cart-items(v-for="(cartItem, index) in cartItems()" :key="index")
                .column
                  .columns(v-for="item in cartItem.items")
                    .column
                      cart-items(:cartItem="item")
                .column
                  //- shipping-methods(:uid="cartItem.item.uid" v-if="cartItem")
</template>

<script>
  import _ from 'lodash'
  import CartItems from '@/components/Checkout/cartItems.vue'
  import ShippingMethods from '@/components/Checkout/ShippingMethods'
  // import VueScrollTo from 'vue-scrollto'
  // import axios from 'axios'

  export default {
    name: 'ReviewItemsAndShipping',

    props: {
      shippingMethodData: {
        type: Array,
        required: false
      }
    },

    components: {
      CartItems,
      ShippingMethods
    },

    data () {
      return {
        radio: 'free'
      }
    },

    created () {
      this.cartItems()
    },

    computed: {
      loadedCartItems () {
        return this.$store.getters['cart/loadedCartItems']
      }
    },

    methods: {
      cartItems () {
        const cartItems = this.loadedCartItems

        const result = _.chain(cartItems)
          .groupBy((e) => {
            return e.item.username
          })
          .map((el, index) => {
            return {
              username: index,
              items: el
            }
          })
          .value()

        return result
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .password-container
  .billing-address
    padding 2rem
    background $grey-light
    margin 2rem 0

  .create-account
    padding-top 2rem

  .continue-container
    border-top 1px solid $grey-300

  .card-content
    padding-top 4rem
    padding-bottom 4rem

  .cart-items
    padding-bottom 2rem

    + .cart-items
      border-top 1px solid $grey-300
      padding-top 2rem

</style>

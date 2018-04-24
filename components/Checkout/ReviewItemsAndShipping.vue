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
              .columns.cart-items(v-for="(cartItem, index) in loadedCartItems" :key="index")
                .column
                  mini-cart-items(:cartItem="cartItem")
                .column
                  shipping-methods(:uid="cartItem.item.uid" v-if="cartItem")
</template>

<script>
  import MiniCartItems from '@/components/MiniCart/items.vue'
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
      MiniCartItems,
      ShippingMethods
    },

    data () {
      return {
        radio: 'free'
      }
    },

    computed: {
      loadedCartItems () {
        return this.$store.getters['cart/loadedCartItems']
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

<template lang="pug">
  .container
    .columns
      .column
        breadcrumb(:crumb="breadcrumb")
    .columns
      .column
        h1 Your cart ({{ cartTotalItems }})
    .columns
      .column.is-9
        .cart-box
          span.no-items(v-if="cartTotalItems < 1")
            h2 There are no items in your cart.
            p If you have an account with us, please log in to see items you previously added.
          b-table(:data="loadedCartItems" v-if="loadedCartItems")
            template(slot-scope="props")
              b-table-column(field="item" label="Item")
                .item-details.media
                  figure.media-left
                    lazy-image(
                      :src="props.row.item.images[0].url + '-/resize/70/-/crop/70x70/center/'"
                      :small-src="props.row.item.images[0].url + '-/resize/70/-/crop/70x70/center/'"
                      :alt="props.row.item.images[0].alt")
                  .media-content
                    h6 {{ props.row.item.title }}
                    span.seller Seller: {{ props.row.item.username }}
                    span.ctas
                      a Edit details
                      a Remove
              b-table-column.quantity(field="quantity" label="Quantity") {{ props.row.quantity }}
              b-table-column.subtotal(field="subtotal" label="Subtotal") {{ props.row.item.price * props.row.quantity | currency }}

</template>

<script>
  import Breadcrumb from '@/components/Breadcrumbs/DefaultBreadcrumb'
  import axios from 'axios'

  export default {
    middleware: [
      'check-auth',
      'cart'
    ],

    components: {
      Breadcrumb
    },

    data () {
      return {
        breadcrumb: { 
          title: 'Continue shopping', 
          path: '/'
        }
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

    computed: {
      loadedCartItems () {
        return this.$store.getters['cart/loadedCartItems']
      },
      cartTotalItems () {
        return this.$store.getters['cart/cartTotalItems']
      }
    }
  }
  
</script>

<style lang="stylus">
  @import '~assets/css/utilities/variables.styl'
  @import '~assets/css/utilities/mixins.styl'

  .cart-box
    font-size $size-normal 
    background $white
    padding 1rem 1.5rem
    min-height 300px
    display flex
    justify-content center
    align-items center
    
    h6
      margin-bottom .5rem
      
    .ctas
      a
        BoldUppercase()
        font-size $size-smaller
        text-decoration underline
        &:hover
        &:focus
          text-decoration none

        &:first-child
          margin-right 1rem
    
    .no-items
      text-align center
      h2
        margin-top 0
      
    .b-table
      width 100%
      table
        thead
          background-color $secondary
          th
            color $white
            border-width 0
      .quantity
      .subtotal
        font-size 1.3rem
        font-weight bold
  
</style>
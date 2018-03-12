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
          //- p {{ loadedCartItems }}
          b-table(:data="loadedCartItems" v-if="loadedCartItems")
            template(slot-scope="props")
              b-table-column(field="item" label="Item")
                .item-details
                  figure
                    lazy-image(
                      :src="props.row.item.images[0].url + '-/resize/70/-/crop/70x70/center/'"
                      :small-src="props.row.item.images[0].url + '-/resize/70/-/crop/70x70/center/'"
                      :alt="props.row.item.images[0].alt")
                  .content
                    h6 Test
              b-table-column(field="quantity" label="Quantity") {{props.row.quantity}}
              b-table-column(field="subtotal" label="Subtotal")

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

    // async fetch ({ store }) {
    //   store.dispatch('cart/fetchCartData')
    // },
    mounted () {
      this.$store.dispatch('cart/fetchCartData')
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

  .cart-box
    font-size $size-normal 
    background $white
    padding 1rem 1.5rem
    
    table
      thead
        background-color $secondary
        th
          color $white
          border-width 0
  
</style>
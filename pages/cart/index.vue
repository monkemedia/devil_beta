<template lang="pug">
  .container
    .columns
      .column
        breadcrumb(:crumb="breadcrumb")
    .columns
      .column
        h1 Your cart (2)
    .columns
      .column.is-9
        .cart-box
          b-table(:data="cartData" v-if="cartData")
            template(slot-scope="props")
              b-table-column(field="item" label="Item")
                .item-details
                  figure
                    lazy-image(
                      :src="props.row.images[0].url + '-/resize/70/-/crop/70x70/center/'"
                      :small-src="props.row.images[0].url + '-/resize/70/-/crop/70x70/center/'"
                      :alt="props.row.images[0].alt")
                  .content
                    h6 Test
              b-table-column(field="quantity" label="Quantity")
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
          route: '/'
        }
      }
    },

    mounted () {
      this.$store.dispatch('cart/fetchCartData')
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
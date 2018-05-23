<template lang="pug">
  .container
    .columns
      .column
        breadcrumb(:crumb="breadcrumb")
    .columns
      .column
        h1 Your cart ({{ cartTotalItems }})
    .columns.is-multiline
      .column.is-12-tablet.is-7-widescreen
        //- b-message(type="is-danger" v-if="isSoldOut.length > 0") Looks like one or more items are out of stock.
        .cart-box(:class="{ 'no-items' :  cartTotalItems < 1 }")
          span(v-if="cartTotalItems < 1")
            h2 There are no items in your cart.
            p If you have an account with us, <nuxt-link to="sign-in" class="underline">please log in</nuxt-link> to see items you previously added.
          b-table(:data="loadedCartItems" v-else)
            template(slot-scope="props")
              .vendors(v-for="vendor in props.row")
                b-table-column(field="item" label="Item")
                  .item-details.media
                    figure.media-left(v-if="vendor.images")
                      lazy-image(
                        :src="vendor.images[0].url + '-/resize/70/-/crop/70x70/center/'"
                        :small-src="vendor.images[0].url + '-/resize/70/-/crop/70x70/center/'"
                        :alt="vendor.images[0].alt")
                    figure.media-left.no-image(v-else)
                      i.fa.fa-file-image-o(aria-hidden="true")
                    .media-content
                      h6 {{ vendor.name }}
                      span.seller Seller: {{ vendor.cart_reference | makeUsername }}
                      span.ctas
                        a(@click="deleteModal(props.row, props.index)") Remove
                b-table-column.quantity(field="quantity" label="Quantity")
                  increment-counter(:productDetails="{ quantity: vendor.quantity, product_id: vendor.product_id, cart_id: vendor.session_id }")
                b-table-column.subtotal(field="subtotal" label="Subtotal") {{ vendor.unit_price.amount * vendor.quantity | currency('USD') }}
      .column.is-12-tablet.is-4-widescreen.is-offset-1-widescreen
        order-summary()

</template>

<script>
  import Breadcrumb from '@/components/Breadcrumbs/DefaultBreadcrumb'
  import IncrementCounter from '@/components/Checkout/IncrementCounter'
  import OrderSummary from '@/components/Checkout/OrderSummary'

  export default {
    middleware: [
      'init-auth'
    ],

    components: {
      Breadcrumb,
      IncrementCounter,
      OrderSummary
    },

    data () {
      return {
        breadcrumb: {
          title: 'Continue shopping',
          path: '/'
        }
      }
    },

    computed: {
      loadedCartItems () {
        return this.$store.getters['cart/loadedCartItems']
      },

      cartTotalItems () {
        return this.$store.getters['cart/cartTotalItems']
      }

      // isSoldOut () {
      //   return _.filter(this.loadedCartItems, (item) => {
      //     return item.item.stock === 0
      //   })
      // }
    },

    methods: {
      deleteModal (product, index) {
        this.$dialog.confirm({
          title: 'Test',
          message: 'Are you sure you want to delete',
          cancelText: 'Disagree',
          confirmText: 'Agree',
          type: 'is-success',
          onConfirm: () => {
            this.$store.dispatch('cart/deleteFromCart', product)
              .then((success) => {
                this.$delete(this.loadedCartItems, index)
              })
              .catch(() => {
                this.alertToast({ message: 'Your item cannot be deleted', type: 'is-warning' })
              })
          }
        })
      }

      // stock (value, isClass) {
      //   let stock = value > 0 ? 'In stock' : 'Sold out'
      //   if (isClass) {
      //     return __.slugify(stock)
      //   }
      //   return stock
      // }
    }
  }

</script>

<style lang="stylus">
  @import '~assets/css/utilities/variables.styl'
  @import '~assets/css/utilities/mixins.styl'

  .cart-box
    font-size $size-150
    background $white
    padding 1rem 1.5rem
    min-height 351px

    h6
      margin-bottom .5rem

    .no-image
      width 70px
      height 70px
      justify-content center
      align-items center
      display flex

      .fa
        font-size 5rem

    .stock
      &.in-stock
        color $green-dark
      &.sold-out
        color $red

    .ctas
      a
        BoldUppercase()
        font-size $size-100
        Underline($secondary)

        &:first-child
          margin-right 1rem

    &.no-items
      display flex
      justify-content center
      align-items center

      span
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
        font-size $size-130
        font-weight bold

</style>

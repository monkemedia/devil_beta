<template lang="pug">
  .card
    .card-header-title
      h1 {{ product.name }}
      span.username By {{ product.username }}
      .price-container
        span.price(v-if="product.on_sale") {{ product.sale_price | currency(product.price.currency) }}
          span.was-price was {{ product.price.amount | currency(product.price.currency) }}
        span.price(v-else) {{ product.price.amount || 0 | currency(product.price.currency) }}
      hr
    .card-content
      .content
        p {{ product.description }}
        .select.quantity.is-multiple(v-if="product.stock > 0")
          select(v-model="quantity")
            option(value="default" disabled) Select quantity
            option(v-for="n in 5" :value="n" :disabled="n > product.stock") {{ n }}

        span.sold-out(v-if="product.stock === 0") Sold out

        button.button.is-secondary.is-fullwidth.is-flip.add-to-cart(
          :class="{ 'item-added' : itemAdded, 'is-loading' : loading }"
          @click="addToCart"
          :disabled="product.stock === 0 || quantity === 'default'")
          span.add-to-cart-text(data-text="Add to cart") Add to cart
          span.added-to-cart-text Added

      .tabs
        ul(role="tablist")
          li(v-for="(tab, index) in tabs" :class="{ 'is-active' : (index === activeTabIndex) }")
            a(@click="toggleTab(index)") {{ tab.name }}
      .tab-content(role="tabpanel")
        div(v-for="(tab, index) in tabs" data-content="description")
          span(v-html="tab.content" v-show="index === activeTabIndex")
</template>

<script>
  export default {
    name: 'ProductDetails',

    props: {
      product: {
        type: Object,
        required: true
      }
    },

    data () {
      return {
        activeTabIndex: 0,
        loading: false,
        itemAdded: false,
        tabs: [
          {
            name: 'Description',
            content: '<p>Content here</p>'
          },
          {
            name: 'Shipping',
            content: '<p>Content here 2</p>'
          }
        ],
        quantity: 'default'
      }
    },

    methods: {
      toggleTab (index) {
        this.activeTabIndex = index
      },

      addToCart () {
        this.$store.dispatch('cart/addToCart', {
          product: this.product,
          quantity: this.quantity,
          page: 'pdp'
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'
  @import '~assets/css/utilities/mixins.styl'

  .card
    .card-header-title
      padding 3rem 3rem 0 3rem
      display flow-root

      h1
        font-size 3rem
        width 100%
        margin-bottom 0

      .username
        BoldUppercase()
        font-size 1.2rem
        color $grey

      .price
        BoldUppercase()
        font-size 2rem
        color $primary

      .was-price
        font-size 1.4rem
        color $grey
        padding-left 1rem
        text-transform uppercase
        text-decoration line-through
        font-family 'Avenir-Medium'

    .card-content
      padding 0 3rem 3rem 3rem

      .quantity
        select
          background-color $grey-lighter
          font-size 1.2rem
          BoldUppercase()
          min-width 140px
          color $grey

      .sold-out
        font-size $size-150
        font-weight bold

      .add-to-cart
        .added-to-cart-text
          display none
          padding-left 1.8rem
          position relative
          &:before
            content '\f00c'
            position absolute
            left 0
            top 0
            font-family FontAwesome
            width auto
        &.item-added
          pointer-events none
          transform translateY(0)
          .added-to-cart-text
            display inline-flex
            transform translateY(0)
          .add-to-cart-text
            display none

      .tabs
        li a
          padding-bottom .7em
        li.is-active a
        li a:hover
        li a:focus
          border-bottom-width 1px
          position relative

          &:after
            content ''
            display block
            position absolute
            left 0
            bottom 0
            height 3px
            width 100%
            background $secondary
</style>

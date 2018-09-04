<template lang="pug">
  .increment-counter
    a.minus(@click="increment('minus')" :class="{ 'disabled' : quantity < 2 }")
      i.fa.fa-minus
    input(v-model="quantity" disabled)
    a.plus(@click="increment('plus')")
      i.fa.fa-plus
</template>

<script>
  export default {
    name: 'IncrementCounter',

    props: {
      productDetails: {
        type: Object,
        required: true
      }
    },

    data () {
      return {
        quantity: this.productDetails.quantity
      }
    },

    methods: {
      increment (val) {
        let qty = this.quantity
        const stock = this.productDetails.product.stock

        if (val === 'plus') {
          qty += 1
        } else {
          qty -= 1
        }

        if (qty > stock) {
          return this.$dialog.alert({
            title: 'Whoops',
            message: 'There isn\'t enough items in stock',
            confirmText: 'Agree'
          })
        }

        this.quantity = qty
        this.$store.dispatch('cart/addToCart', {
          ...this.productDetails,
          quantity: qty,
          page: 'cart'
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  $increment-grey = $grey-light

  .increment-counter
    padding .7rem 1rem
    background-color $increment-grey
    width 100px
    display inline-flex
    justify-content space-between
    align-items center

  .minus
  .plus
    display inline-flex

  input
    width 30px
    border 0
    background-color $increment-grey
    font-size $size-130
    font-weight bold
    text-align center

  .disabled
    pointer-events none
    color $grey

</style>

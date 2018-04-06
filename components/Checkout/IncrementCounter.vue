<template lang="pug">
  .increment-counter
    a.minus(@click="increment('minus')" :class="{ 'disabled' : quantity < 2 }")
      i.fa.fa-minus
    input(v-model="quantity" disabled)
    a.plus(@click="increment('plus')" :class="{ 'disabled' : quantity > 4 }")
      i.fa.fa-plus
</template>

<script>
  import _ from 'lodash'

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
      updateDb: _.debounce(function (qty, val) {
        this.$store.dispatch('cart/liveStock', this.productDetails)
          .then((liveStock) => {
            console.log(qty)
            // Check to see if user is adding more items than the stock allows
            if (qty > liveStock) {
              this.quantity = liveStock
              throw new Error('no-stock')
            }

            return this.$store.dispatch('cart/updateCartItemQuantity', {
              ...this.productDetails,
              quantity: qty
            })
          })
          .then(() => {
            console.log('val', val)
            this.$emit('quantity', qty)
            return this.$store.dispatch('cart/fetchCartData')
          })
          .catch((err) => {
            if (err.message === 'no-stock') {
              this.$dialog.alert({
                title: 'Whoops',
                message: 'There isn\'t enough items in stock',
                confirmText: 'Agree'
              })
              return
            }

            this.$dialog.alert({
              title: 'Whoops',
              message: 'Looks like something has gone wrong',
              confirmText: 'Agree'
            })
          })
      }, 300),

      increment (val) {
        let qty = this.quantity
        if (val === 'plus') {
          qty += 1
        } else {
          qty -= 1
        }
        this.quantity = qty
        this.updateDb(qty, val)
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

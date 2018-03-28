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
      updateDb: _.debounce(function (qty) {
        console.log('debounce')
        this.$store.dispatch('cart/updateCartItemQuantity', {
          ...this.productDetails,
          quantity: qty
        })
          .then(() => {
            return this.$store.dispatch('cart/fetchCartData')
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
        this.updateDb(qty)
        this.$emit('quantity', qty)
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
<template lang="pug">
  .increment-counter
    a.minus(@click="increment('minus')" :class="{ 'disabled' : qty < 2 }")
      i.fa.fa-minus
    input(v-model="qty" disabled)
    a.plus(@click="increment('plus')" :class="{ 'disabled' : qty > 4 }")
      i.fa.fa-plus
</template>

<script>
  export default {
    name: 'IncrementCounter',

    props: {
      quantity: {
        type: Number,
        required: true,
        default: 0
      }
    },

    data () {
      return {
        qty: this.quantity
      }
    },

    methods: {
      increment (val) {
        if (val === 'plus') {
          return this.qty += 1
        }

        return this.qty -= 1
        
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'
  
  $increment-grey = #ccc
  
  .increment-counter
    padding .6rem 1rem
    background-color $increment-grey
    width 100%
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
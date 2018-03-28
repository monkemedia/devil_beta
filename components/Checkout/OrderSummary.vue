<template lang="pug">
  .order-summary
    header
      h2.h3 Order summary
    section
      .row
        span Subtotal (1 item)
        span £59
      .row
        span Shipping
        span N/A
      .row.total
        span Estimated total
        span £59
    footer
      button.button.is-primary.is-fullwidth.is-flip 
        span(data-text="Check out") Check out

</template>

<script>
  export default {
    name: 'OrderSummary',

    props: {
    },

    data () {
      return {
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'
  @import '~assets/css/utilities/mixins.styl'
  
  .order-summary
    background-color $white
    padding 2.5rem 2rem
    BoldUppercase()
    font-size $size-140
    border 4px solid $secondary
  
  h2
    margin-top 0
  
  .row
    padding 1.5rem 0
    justify-content space-between
    display flex
    span
      display inline-flex
      &:first-child
        color $grey
    
    &.total
      font-size $size-240
      span
        &:first-child
          color $secondary
    
  .button
    margin-bottom 0
      
</style>
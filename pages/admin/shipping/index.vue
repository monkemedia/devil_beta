<template lang="pug">
  section.section
    .columns
      .column
        header
          h1.add-product-heading Shipping
          shipping-form(:shippingData="shipping")

</template>

<script>
  import ShippingForm from '@/components/Admin/Shipping/Index.vue'

  export default {
    name: 'Shipping',

    layout: 'admin',

    middleware: [
      'check-auth',
      'auth'
    ],

    components: {
      ShippingForm
    },

    data () {
      return {
        shipping: []
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'
</style>

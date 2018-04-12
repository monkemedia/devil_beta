<template lang="pug">
  .container.default-container-padding.checkout
    .columns
      .column
        h1 Checkout
    .columns.is-multiline
      .column.is-12-tablet.is-7-widescreen
        b-message(type="is-danger" v-if="isRegisterError") {{ isRegisterError }}
        shipping-form(@errorMessage="errorMessage")
      .column.is-12-tablet.is-4-widescreen.is-offset-1-widescreen
        order-summary

</template>

<script>
  import ShippingForm from '@/components/Checkout/ShippingForm'
  import OrderSummary from '@/components/Checkout/OrderSummary'

  export default {
    name: 'Shipping',

    components: {
      ShippingForm,
      OrderSummary
    },

    data () {
      return {
        isRegisterError: ''
      }
    },

    methods: {
      errorMessage (err) {
        console.log('TEST', err)
        this.isRegisterError = err
      }
    }
  }
</script>

<style lang="stylus">

</style>

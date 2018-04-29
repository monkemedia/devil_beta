<template lang="pug">
  .container.default-container-padding.checkout
    .columns
      .column
        h1 Checkout
    .columns.is-multiline
      .column.is-12-tablet.is-7-widescreen
        b-message(type="is-danger" v-if="isRegisterError") {{ isRegisterError }}
        shipping-address-form(v-if="getParams !== 'shippingMethod'" @errorMessage="errorMessage" :shippingData="shippingData")
        shipping-result(v-if="getParams === 'shippingMethod'" :shippingData="shippingData")
        review-items-and-shipping(:shippingMethodData="shippingMethodData")
      .column.is-12-tablet.is-4-widescreen.is-offset-1-widescreen
        order-summary

</template>

<script>
  import ShippingAddressForm from '@/components/Checkout/ShippingAddressForm'
  import ShippingResult from '@/components/Checkout/ShippingResult'
  import ReviewItemsAndShipping from '@/components/Checkout/ReviewItemsAndShipping'
  import OrderSummary from '@/components/Checkout/OrderSummary'

  export default {
    name: 'Shipping',

    middleware: [
      'init-auth',
      'auth'
    ],

    components: {
      ShippingAddressForm,
      ShippingResult,
      ReviewItemsAndShipping,
      OrderSummary
    },

    async fetch ({ store }) {
      return store.dispatch('checkout/getShippingData')
    },

    mounted () {
      if (process.client) {
        return this.$store.dispatch('checkout/getShippingData')
      }
    },

    data () {
      return {
        isRegisterError: false
      }
    },

    methods: {
      errorMessage (err) {
        this.isRegisterError = err
      }
    },

    computed: {
      shippingData () {
        return this.$store.getters['checkout/loadedShippingData']
      },

      shippingMethodData () {
        return this.$store.getters['checkout/loadedShippingMethodData']
      },

      getParams () {
        return this.$route.query.step
      }
    },

    watch: {
      getParams () {

      }
    }
  }
</script>

<style lang="stylus">

</style>

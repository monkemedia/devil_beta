<template lang="pug">
  .container.default-container-padding.checkout
    .columns
      .column
        h1 Checkout
    .columns.is-multiline
      .column.is-12-tablet.is-7-widescreen
        b-message(type="is-danger" v-if="isRegisterError") {{ isRegisterError }}
        shipping-form(v-show="getParams !== 'shippingMethod'" @errorMessage="errorMessage" :shippingData="shippingData")
        shipping-result(v-show="getParams === 'shippingMethod'" :shippingData="shippingData")
        shipping-method
      .column.is-12-tablet.is-4-widescreen.is-offset-1-widescreen
        order-summary

</template>

<script>
  import ShippingForm from '@/components/Checkout/ShippingForm'
  import ShippingResult from '@/components/Checkout/ShippingResult'
  import ShippingMethod from '@/components/Checkout/ShippingMethod'
  import OrderSummary from '@/components/Checkout/OrderSummary'

  export default {
    name: 'Shipping',

    middleware: [
      'check-auth',
      'auth'
    ],

    components: {
      ShippingForm,
      ShippingResult,
      ShippingMethod,
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

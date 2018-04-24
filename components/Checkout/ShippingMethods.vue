<template lang="pug">
  div
    .field(v-for="(shipping, index) in orderedShippingMethods")
      b-radio(v-model="radio" :native-value="shipping.option") {{ shipping.price | currency }} <span class="label">{{ filterShipping(shipping.option)[0].label }}</span>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'ShippingMethods',

    props: {
      uid: {
        type: String,
        required: true
      }
    },

    data () {
      return {
        radio: 0,
        shippingServices: [
          { label: 'Royal Mail 2nd Class (2 to 3 working days)', value: 'royal_mail_2nd_class' },
          { label: 'Test 2', value: 'test_2' }
        ]
      }
    },

    mounted () {
      this.$store.dispatch('checkout/getShippingMethodData', this.uid)
    },

    computed: {
      getShippingMethods () {
        return this.$store.getters['checkout/loadedShippingMethodData']
      },

      orderedShippingMethods () {
        return _.orderBy(this.getShippingMethods, 'price')
      }
    },

    methods: {
      filterShipping (value) {
        return _.filter(this.shippingServices, (item) => {
          return item.value === value
        })
      }
    },

    watch: {
      radio () {
        console.log(this.radio)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .b-radio.radio
    .label
      font-family 'Avenir-Medium'
      color $grey
</style>

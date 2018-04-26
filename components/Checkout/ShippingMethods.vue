<template lang="pug">
  div
    .field(v-for="(shipping, index) in orderedShippingMethods")
      input(type="radio" :name="cartItem.item.product_id" :value="shipping.price" :checked="index === 0" @input="test")
      label {{ shipping.price | currency }} <span class="label">{{ filterShipping(shipping.option)[0].label }}</span>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'ShippingMethods',

    props: {
      uid: {
        type: String,
        required: true
      },
      cartItem: {
        type: Object,
        required: true
      }
    },

    data () {
      return {
        shippingServices: [
          { label: 'Royal Mail 2nd Class (2 to 3 working days)', value: 'royal_mail_2nd_class' },
          { label: 'Test 2', value: 'test_2' }
        ],
        orderedShippingMethods: null
      }
    },

    mounted () {
      this.$store.dispatch('checkout/getShippingMethodData', this.uid)
        .then((res) => {
          this.orderedShippingMethods = _.orderBy(res, 'price')
        })
    },

    created () {
      console.log('mnkye', this.orderedShippingMethods)
    },

    computed: {
      getShippingMethods () {
        return this.$store.getters['checkout/loadedShippingMethodData']
      }

      // orderedShippingMethods () {
      //   return _.orderBy(this.getShippingMethods, 'price')
      // }
    },

    methods: {
      filterShipping (value) {
        return _.filter(this.shippingServices, (item) => {
          return item.value === value
        })
      },

      test (el) {
        console.log('value', Number(el.target.value))
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

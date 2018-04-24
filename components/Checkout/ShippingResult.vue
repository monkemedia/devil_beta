<template lang="pug">
  .shipping-result-container
    header
      .level
        .level-left
          p 1. Shipping
        .level-right
          a.edit.underline(@click="editShipping") Edit
    .content
      .columns
        .column
          p.title Shipping address:
          ul.no-list
            li {{ shippingData.shipping.firstName }} {{ shippingData.shipping.lastName }}
            li {{ shippingData.shipping.addressOne }}
            li(v-if="shippingData.shipping.addressTwo") {{ shippingData.shipping.addressTwo }}
            li {{ shippingData.shipping.city }}
            li(v-if="shippingData.shipping.county") {{ shippingData.shipping.county }}
            li {{ shippingData.shipping.postcode }}
            li {{ countryName(shippingData.shipping.country)[0].country }}
        .column
          p.title Billing address:
          ul.no-list(v-if="shippingData.billing.city")
            li {{ shippingData.billing.firstName }} {{ shippingData.billing.lastName }}
            li {{ shippingData.billing.addressOne }}
            li(v-if="shippingData.billing.addressTwo") {{ shippingData.billing.addressTwo }}
            li {{ shippingData.billing.city }}
            li(v-if="shippingData.billing.county") {{ shippingData.billing.county }}
            li {{ shippingData.billing.postcode }}
            li {{ countryName(shippingData.billing.country)[0].country }}
          ul.no-list(v-else)
            li {{ shippingData.shipping.firstName }} {{ shippingData.shipping.lastName }}
            li {{ shippingData.shipping.addressOne }}
            li(v-if="shippingData.shipping.addressTwo") {{ shippingData.shipping.addressTwo }}
            li {{ shippingData.shipping.city }}
            li(v-if="shippingData.shipping.county") {{ shippingData.shipping.county }}
            li {{ shippingData.shipping.postcode }}
            li {{ countryName(shippingData.shipping.country)[0].country }}
</template>

<script>
  import countries from '@/assets/data/countries.json'
  import _ from 'lodash'

  export default {
    name: 'ShippingResult',

    props: {
      shippingData: {
        type: Object,
        required: false
      }
    },

    methods: {
      countryName (abbr) {
        return _.filter(countries, { abbreviation: abbr })
      },

      editShipping () {
        this.$router.push({ path: this.$route.path })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'
  @import '~assets/css/utilities/mixins.styl'

  .shipping-result-container
    padding 2rem
    background $grey-light
    margin 2rem 0

  header
    padding-bottom 2rem
    p
      font-size $size-150
      BoldUppercase()
      color $secondary

    .edit
      BoldUppercase()
      font-size $size-120

  .content
    .title
      font-size $size-130
      BoldUppercase()

    ul
      font-size $size-130
      li
        margin-top 0
</style>

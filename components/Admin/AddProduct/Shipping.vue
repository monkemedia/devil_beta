<template lang="pug">
  .form-panel.shipping-panel
    legend Shipping
    p Add variants if this product comes in multiple versions, like different sizes or colours.
    table
      thead
        tr
          th(width="60%")
            span Shipping option(s) #[sup *]
          th(width="30%")
            span Rate
          th(width="10%")
      tbody
        tr(v-for="(shipping, index) in shippingOptions")
          td(width="60%")
            span.field
              .control
                .select.is-fullwidth.is-multiple
                  select(
                    :name="shipping.option_slug"
                    :id="shipping.option_slug"
                    v-model="shipping.option"
                    data-vv-delay="600"
                    :class="{ 'is-danger': errors.has(shipping.option_slug) }"
                    v-validate="'required'"
                    @change="onShippingChange")
                      option(disabled value="") Please select a shipping option
                      option(v-for="service in shippingServices" :value="service.value") {{ service.label }}
                p(v-show="errors.has(shipping.option_slug)" class="help is-danger") The shipping option field is required.
          td(width="30%")
            span.field.has-addons
              .control.button.is-static.is-currency £
              .control
                input.input(
                  :name="shipping.price_slug"
                  :id="shipping.price_slug"
                  v-model.number="shipping.price"
                  @change="onShippingChange"
                  type="number")
          td(width="10%")
            span
              a.icon.remove-shipping-option(v-if="index > 0")
                i.fa.fa-trash(@click="removeShippingOption(index)")
        tr(v-if="shippingOptions.length < 3")
          td(width="100%")
            span.field
              .control
                a.add-additional-link(@click="cloneShippingOption")
                  | Offer additional shipping options
</template>

<script>
  export default {
    name: 'Shipping',

    inject: ['$validator'],

    props: {
      shippingData: {
        type: Array,
        required: false
      }
    },

    data () {
      return {
        shippingOptions: [
          {
            option_slug: 'domestic_shipping_option_name_0',
            price_slug: 'domestic_shipping_price_name_0',
            option: '',
            price: 0
          }
        ],
        shippingServices: [
          { label: 'Royal Mail 2nd Class (2 to 3 working days)', value: 'royal_mail_2nd_class' },
          { label: 'Test 2', value: 'test_2' }
        ],
        isInternationalShipping: false,
        isDomesticExpressShipping: false,
        isInternationalExpressShipping: false
      }
    },

    mounted () {
      this.shippingOptions = this.shippingData && this.shippingData.length ? this.shippingData : this.shippingOptions
    },

    methods: {
      removeShippingOption (index) {
        this.shippingOptions.splice(index, 1)
      },

      cloneShippingOption () {
        let index = this.shippingOptions.length
        this.shippingOptions.push({
          option_slug: `domestic_shipping_option_name_${index += 1}`,
          price_slug: `domestic_shipping_price_name_${index += 1}`,
          option: '',
          price: 0
        })
      },

      onShippingChange () {
        const array = []
        this.shippingOptions.forEach((item) => {
          if (item.option !== '') {
            const data = {
              option_slug: item.option_slug,
              price_slug: item.price_slug,
              option: item.option,
              price: item.price
            }
            array.push(data)
          }
        })
        this.$emit('passShipping', array)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .select > select
    background $grey-lighter

  .is-currency
    border 0 !important
    margin 0
    font-size $size-150
    line-height 1
    padding 0 .5rem

    @media only screen and (min-width $desktop)
      padding 0 1.2rem

  .remove-shipping-option
    padding 2rem

  p
    margin-bottom 2rem

    &.help
      margin-bottom 0
</style>

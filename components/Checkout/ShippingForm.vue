<template lang="pug">
  .card
    header.card-header
      .card-header-title
        p 1. Shipping
    .card-content
      .content
        form
          .columns
            .column
              .field
                label.label First name #[sup *]
                .control
                  input.input(
                    name="shippingFirstName"
                    id="shippingFirstName"
                    v-model="form.shipping.firstName"
                    type="text"
                    data-vv-delay="600"
                    :class="{ 'is-danger': errors.has('shippingFirstName') }"
                    v-validate="'required'")
                  p(v-show="errors.has('shippingFirstName')" class="help is-danger" v-html="errors.first('shippingFirstName')")
            .column
              .field
                label.label Last name #[sup *]
                .control
                  input.input(
                    name="shippingLastName"
                    id="shippingLastName"
                    v-model="form.shipping.lastName"
                    type="text"
                    data-vv-delay="600"
                    :class="{ 'is-danger': errors.has('shippingLastName') }"
                    v-validate="'required'")
                  p(v-show="errors.has('shippingLastName')" class="help is-danger" v-html="errors.first('shippingLastName')")
          .columns
            .column
              .field
                label.label Address 1 #[sup *]
                .control
                  input.input(
                    name="shippingAddressOne"
                    id="shippingAddressOne"
                    v-model="form.shipping.addressOne"
                    type="text"
                    data-vv-delay="600"
                    :class="{ 'is-danger': errors.has('shippingAddressOne') }"
                    v-validate="'required'")
                  p(v-show="errors.has('shippingAddressOne')" class="help is-danger" v-html="errors.first('shippingAddressOne')")
            .column
              .field
                label.label Address 2
                .control
                  input.input(
                    name="shippingAddressTwo"
                    id="shippingAddressTwo"
                    v-model="form.shipping.addressTwo"
                    type="text")
          .columns
            .column
              .field
                label.label City #[sup *]
                .control
                  input.input(
                    name="shippingCity"
                    id="shippingCity"
                    v-model="form.shipping.city"
                    type="text"
                    data-vv-delay="600"
                    :class="{ 'is-danger': errors.has('shippingCity') }"
                    v-validate="'required'")
                  p(v-show="errors.has('shippingCity')" class="help is-danger" v-html="errors.first('shippingCity')")
            .column
              .field
                label.label County / State / Province
                .control
                  input.input(
                    name="shippingCounty"
                    id="shippingCounty"
                    v-model="form.shipping.county"
                    type="text")
          .columns
            .column
              .field
                label.label Postcode / Zip #[sup *]
                .control
                  input.input(
                    name="shippingPostcode"
                    id="shippingPostcode"
                    v-model="form.shipping.postcode"
                    type="text"
                    data-vv-delay="600"
                    :class="{ 'is-danger': errors.has('shippingPostcode') }"
                    v-validate="'required'")
                  p(v-show="errors.has('shippingPostcode')" class="help is-danger" v-html="errors.first('shippingPostcode')")
            .column
              .field
                label.label Country #[sup *]
                .control.is-expanded
                  .select.is-fullwidth.is-multiple
                    select(
                      name="shippingCountry"
                      id="shippingCountry"
                      v-model="form.shipping.country"
                      data-vv-delay="600"
                      :class="{ 'is-danger': errors.has('shippingCountry') }"
                      v-validate="'required'")
                      option(disabled value="") Please select a country
                      option(v-for="country in countries" :value="country.abbreviation") {{ country.country }}
                  p(v-show="errors.has('shippingCountry')" class="help is-danger" v-html="errors.first('shippingCountry')")

          .columns
            .column.is-6
              b-checkbox(v-model="showBilling") Use this address for billing
          .billing-address(v-if="!showBilling")
            .columns
              .column
                .field
                  label.label First name #[sup *]
                  .control
                    input.input(
                      name="billingFirstName"
                      id="billingFirstName"
                      v-model="form.billing.firstName"
                      type="text"
                      data-vv-delay="600"
                      :class="{ 'is-danger': errors.has('billingFirstName') }"
                      v-validate="'required|alpha_dash|min:3'")
                    p(v-show="errors.has('billingFirstName')" class="help is-danger" v-html="errors.first('billingFirstName')")
              .column
                .field
                  label.label Last name #[sup *]
                  .control
                    input.input(
                      name="billingLastName"
                      id="billingLastName"
                      v-model="form.billing.lastName"
                      type="text"
                      data-vv-delay="600"
                      :class="{ 'is-danger': errors.has('billingLastName') }"
                      v-validate="'required|alpha_dash|min:3'")
                    p(v-show="errors.has('billingLastName')" class="help is-danger" v-html="errors.first('billingLastName')")
            .columns
              .column
                .field
                  label.label Address 1 #[sup *]
                  .control
                    input.input(
                      name="billingAddressOne"
                      id="billingAddressOne"
                      v-model="form.billing.addressOne"
                      type="text"
                      data-vv-delay="600"
                      :class="{ 'is-danger': errors.has('billingAddressOne') }"
                      v-validate="'required'")
                    p(v-show="errors.has('billingAddressOne')" class="help is-danger" v-html="errors.first('billingAddressOne')")
              .column
                .field
                  label.label Address 2
                  .control
                    input.input(
                      name="billingAddressTwo"
                      id="billingAddressTwo"
                      v-model="form.billing.addressTwo"
                      type="text")
            .columns
              .column
                .field
                  label.label City #[sup *]
                  .control
                    input.input(
                      name="billingCity"
                      id="billingCity"
                      v-model="form.billing.city"
                      type="text"
                      data-vv-delay="600"
                      :class="{ 'is-danger': errors.has('billingCity') }"
                      v-validate="'required|alpha_dash|min:3'")
                    p(v-show="errors.has('billingCity')" class="help is-danger" v-html="errors.first('billingCity')")
              .column
                .field
                  label.label County / State / Province
                  .control
                    input.input(
                      name="billingCounty"
                      id="billingCounty"
                      v-model="form.billing.county"
                      type="text")
            .columns
              .column
                .field
                  label.label Postcode / Zip #[sup *]
                  .control
                    input.input(
                      name="billingPostcode"
                      id="billingPostcode"
                      v-model="form.billing.postcode"
                      type="text"
                      data-vv-delay="600"
                      :class="{ 'is-danger': errors.has('billingPostcode') }"
                      v-validate="'required'")
                    p(v-show="errors.has('billingPostcode')" class="help is-danger" v-html="errors.first('billingPostcode')")
              .column
                .field
                  label.label Country #[sup *]
                  .control.is-expanded
                    .select.is-fullwidth.is-multiple
                      select(
                        name="billingCountry"
                        id="billingCountry"
                        v-model="form.country"
                        data-vv-delay="600"
                        :class="{ 'is-danger': errors.has('billingCountry') }"
                        v-validate="'required'")
                        option(disabled value="") Please select a country
                        option(v-for="country in countries" :value="country.abbreviatio") {{ country.country }}
                    p(v-show="errors.has('billingCountry')" class="help is-danger" v-html="errors.first('billingCountry')")

          .columns
            .column
              .field.is-right
                hr
                .buttons.is-right
                  button.button.is-primary.sign-in-button.is-flip(
                    :class="{ 'is-loading': loading }"
                    @click.prevent="validateShipping")
                      span(data-text="Continue to shipping method") Continue to shipping method
</template>

<script>
  import Vue from 'vue'
  import VeeValidate, { Validator } from 'vee-validate'
  // import VueScrollTo from 'vue-scrollto'
  import countries from '@/assets/data/countries.json'

  Vue.use(VeeValidate)

  const dict = {
    custom: {
      shippingFirstName: {
        required: 'Whoops! First name is required'
      },
      shippingLastName: {
        required: 'Whoops! Last name is required'
      },
      shippingAddressOne: {
        required: 'Whoops! Address Line 1 is required'
      },
      shippingCity: {
        required: 'Whoops! City is required'
      },
      shippingPostcode: {
        required: 'Whoops! Postcode / Zip is required'
      },
      shippingCountry: {
        required: 'Whoops! Country is required'
      },
      billingFirstName: {
        required: 'Whoops! First name is required'
      },
      billingLastName: {
        required: 'Whoops! Last name is required'
      },
      billingAddressOne: {
        required: 'Whoops! Address Line 1 is required'
      },
      billingCity: {
        required: 'Whoops! City is required'
      },
      billingPostcode: {
        required: 'Whoops! Postcode / Zip is required'
      },
      billingCountry: {
        required: 'Whoops! Country is required'
      }
    }
  }

  Validator.localize('en', dict)

  export default {
    name: 'ShippingForm',

    props: {
      shippingData: {
        type: Object,
        required: false
      }
    },

    data () {
      return {
        countries: countries,
        form: this.shippingData ? { ...this.shippingData } : {
          shipping: {
            firstName: '',
            lastName: '',
            addressOne: '',
            addressTwo: '',
            city: '',
            county: '',
            postcode: '',
            country: ''
          },
          billing: {
            firstName: '',
            lastName: '',
            addressOne: '',
            addressTwo: '',
            city: '',
            county: '',
            postcode: '',
            country: ''
          }
        },
        showBilling: true,
        loading: false
      }
    },

    methods: {
      validateShipping () {
        // hide errors first
        this.$emit('errorMessage', false)
        // Validate form first
        this.$validator.validateAll()
          .then(() => {
            this.loading = true
            // Save shipping data
            return this.$store.dispatch('checkout/saveShippingData', this.form)
          })
          .then(() => {
            this.loading = false
            this.$router.push({ path: this.$route.path, query: { step: 'shippingMethod' } })
          })
          .catch((err) => {
            this.loading = false
            this.$emit('errorMessage', err)
          })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .password-container
  .billing-address
    padding 2rem
    background $grey-light
    margin 2rem 0

  .create-account
    padding-top 2rem

  .continue-container
    border-top 1px solid $grey-300

  .card-content
    padding-top 4rem
    padding-bottom 4rem

</style>

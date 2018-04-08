<template lang="pug">
  .card
    header.card-header
      .card-header-title
        p 1. Shipping
    .card-content
      .content
        form
          .columns(v-if="isUnregistered")
            .column.is-6
              .field
                label.label Email #[sup *]
                .control
                  input.input(
                    name="email"
                    id="email"
                    v-model="form.email"
                    type="email"
                    data-vv-delay="600"
                    :class="{ 'is-danger': errors.has('email') }"
                    v-validate="'required|email'")
                  p(v-show="errors.has('email')" class="help is-danger" v-html="errors.first('email')")
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
                      option(v-for="country in countries" :value="country.abbreviatio") {{ country.country }}
                  p(v-show="errors.has('shippingCountry')" class="help is-danger" v-html="errors.first('shippingCountry')")
          .create-account
            .columns
              .column.is-6
                b-checkbox(v-model="showPassword" v-if="isUnregistered") I would like to create an account
          .password-container(v-if="showPassword && isUnregistered")
            .columns
              .column
                .field
                  label.label Username #[sup *]
                  .control
                    input.input(
                      name="username"
                      id="username"
                      v-model="form.username"
                      type="text"
                      data-vv-delay="600"
                      :class="{ 'is-danger': errors.has('username') }"
                      v-validate="'required|alpha_dash|min:3'")
                    p(v-show="errors.has('username')" class="help is-danger" v-html="errors.first('username')")
            .columns
              .column
                .field
                  label.label Password
                  .control
                    input.input(
                      name="password"
                      id="password"
                      v-model="form.password"
                      type="password"
                      data-vv-delay="600"
                      :class="{ 'is-danger': errors.has('password') }"
                      v-validate="'required|min:6'")
                    p(v-show="errors.has('password')" class="help is-danger" v-html="errors.first('password')")
              .column
                .field
                  label.label Confirm password
                  .control
                    input.input(
                      name="password"
                      id="confirmPassword"
                      v-model="form.confirmPassword"
                      type="password"
                      data-vv-delay="600"
                      :class="{ 'is-danger': errors.has('confirmPassword') }"
                      v-validate="'required|confirmed:password'")
                    p(v-show="errors.has('confirmPassword')" class="help is-danger" v-html="errors.first('confirmPassword')")
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
                  button.button.is-primary(@click.prevent="validateShipping") Continue to shipping method
</template>

<script>
  import Vue from 'vue'
  import VeeValidate, { Validator } from 'vee-validate'
  import countries from '@/assets/data/countries.json'

  Vue.use(VeeValidate)

  const dict = {
    custom: {
      email: {
        required: 'Whoops! Email is required',
        email: 'Whoops! Email address must be valid'
      },
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
      username: {
        required: 'Whoops! Username is required'
      },
      password: {
        required: 'Whoops! Password is required',
        min: 'Whoops! Password must be at least 6 characters'
      },
      confirmPassword: {
        required: 'Whoops! Password confirmation is required',
        confirmed: 'Whoops! Passwords don\'t match'
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

    data () {
      return {
        countries: countries,
        form: {
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
          shipping: {
            firstName: '',
            lastName: '',
            addressOne: '',
            addressTwo: '',
            city: '',
            county: '',
            country: ''
          },
          billing: {
            firstName: '',
            lastName: '',
            addressOne: '',
            addressTwo: '',
            city: '',
            county: '',
            country: ''
          }
        },
        showPassword: false,
        showBilling: true,
        loading: false
      }
    },

    computed: {
      isUnregistered () {
        return this.$route.query.visitor === 'unregistered'
      }
    },

    methods: {
      validateShipping ({ dispatch, rootGetters }) {
        // hide errors first
        this.isRegisterError = false
        // Validate form first
        this.$validator.validateAll()
          .then(() => {
            let username
            this.loading = true

            function seeIfEmailExists () {
              const url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/createAuthUri?key=${process.env.FB_API_KEY}`

              return this.$axios.$post(url)
                .then((res) => {
                  console.log('res', res)
                })
            }

            // User is unregistered
            if (this.$route.query.visitor === 'unregistered') {
              // If user is creating a new account
              if (this.showPassword && this.form.username !== null) {
                // lets see if username exists
                username = this.form.username
                return this.$store.dispatch('auth/validateUsername', username)
              }
              // If user is signing in as a guest
              // Lets see if email address already exists
            }

            // User is registered
            // Save straight to database
            return true
          })
          .then(() => {
            const isAuthenticated = rootGetters['anonAuth/isAuthenticated']

            if (!isAuthenticated) {
              // User isn't authenticated so, sign them in anonymously
              return
            }
            // Save shipping data to database
            return dispatch('checkout/saveShippingData')
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

</style>

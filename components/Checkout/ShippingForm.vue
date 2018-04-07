<template lang="pug">
  .card
    header.card-header
      .card-header-title
        p 1. Shipping
    .card-content
      .content
        .columns
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
                  name="firstName"
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  data-vv-delay="600"
                  :class="{ 'is-danger': errors.has('firstName') }"
                  v-validate="'required|alpha_dash|min:3'")
                p(v-show="errors.has('firstName')" class="help is-danger" v-html="errors.first('firstName')")
          .column
            .field
              label.label Last name #[sup *]
              .control
                input.input(
                  name="lastName"
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  data-vv-delay="600"
                  :class="{ 'is-danger': errors.has('lastName') }"
                  v-validate="'required|alpha_dash|min:3'")
                p(v-show="errors.has('lastName')" class="help is-danger" v-html="errors.first('lastName')")
        .columns
          .column
            .field
              label.label Address 1 #[sup *]
              .control
                input.input(
                  name="addressOne"
                  id="addressOne"
                  v-model="form.addressOne"
                  type="text"
                  data-vv-delay="600"
                  :class="{ 'is-danger': errors.has('addressOne') }"
                  v-validate="'required'")
                p(v-show="errors.has('addressOne')" class="help is-danger" v-html="errors.first('addressOne')")
          .column
            .field
              label.label Address 2
              .control
                input.input(
                  name="addressTwo"
                  id="addressTwo"
                  v-model="form.addressTwo"
                  type="text"
                  :class="{ 'is-danger': errors.has('addressTwo') }")
        .columns
          .column
            .field
              label.label City #[sup *]
              .control
                input.input(
                  name="city"
                  id="city"
                  v-model="form.city"
                  type="text"
                  data-vv-delay="600"
                  :class="{ 'is-danger': errors.has('city') }"
                  v-validate="'required|alpha_dash|min:3'")
                p(v-show="errors.has('city')" class="help is-danger" v-html="errors.first('city')")
          .column
            .field
              label.label County / State / Province
              .control
                input.input(
                  name="county"
                  id="county"
                  v-model="form.county"
                  type="text"
                  :class="{ 'is-danger': errors.has('county') }")
        .columns
          .column
            .field
              label.label Postcode / Zip #[sup *]
              .control
                input.input(
                  name="postcode"
                  id="postcode"
                  v-model="form.postcode"
                  type="text"
                  data-vv-delay="600"
                  :class="{ 'is-danger': errors.has('postcode') }"
                  v-validate="'required'")
                p(v-show="errors.has('postcode')" class="help is-danger" v-html="errors.first('postcode')")
          .column
            .field
              label.label Country #[sup *]
              .control.is-expanded
                .select.is-fullwidth.is-multiple
                  select(
                    name="country"
                    id="country"
                    v-model="form.country"
                    data-vv-delay="600"
                    :class="{ 'is-danger': errors.has('country') }"
                    v-validate="'required'")
                    option(disabled value="") Please select a country
                    option(v-for="country in countries" :value="country.abbreviatio") {{ country.country }}
                p(v-show="errors.has('country')" class="help is-danger" v-html="errors.first('country')")
        .columns
          .column.is-6
            b-checkbox(v-model="showPassword") I would like to create an account
        .password-container(v-if="showPassword")
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
</template>

<script>
  import Vue from 'vue'
  import VeeValidate from 'vee-validate'
  import countries from '@/assets/data/countries.json'

  Vue.use(VeeValidate)

  export default {
    name: 'ShippingForm',

    data () {
      return {
        countries: countries,
        form: {
          email: '',
          firstName: '',
          lastName: '',
          addressOne: '',
          addressTwo: '',
          city: '',
          county: '',
          country: ''
        },
        showPassword: false,
        showBilling: true
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .password-container
    padding 2rem
    background $grey-light
    margin-bottom 2rem

</style>

<template lang="pug">
  .card
    header.card-header
      .card-header-title
        p 1. Shipping
    .card-content
      .content
        .columns
          .column
            .field
              label.label Email #[sup *]
              .control
                input.input(
                  name="email"
                  id="email"
                  v-model="email"
                  type="email"
                  data-vv-delay="600"
                  :class="{ 'is-danger': errors.has('email') }"
                  v-validate="'required|email'")
                p(v-show="errors.has('email')" class="help is-danger" v-html="errors.first('email')")
          .column
        .columns
          .column
            .field
              label.label First name #[sup *]
              .control
                input.input(
                  name="firstName"
                  id="firstName"
                  v-model="firstName"
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
                  v-model="lastName"
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
                  v-model="addressOne"
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
                  v-model="addressTwo"
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
                  v-model="city"
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
                  v-model="county"
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
                  v-model="postcode"
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
                    v-model="country"
                    data-vv-delay="600"
                    :class="{ 'is-danger': errors.has('country') }"
                    v-validate="'required'")
                    option(disabled value="") Please select a country
                    option(v-for="country in countries" :value="country.abbreviatio") {{ country.country }}
                p(v-show="errors.has('country')" class="help is-danger" v-html="errors.first('country')")
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
        countries: countries
      }
    },

    mounted () {
      console.log(countries)
    }

    // mounted () {
    //   axios.get(`${process.env.BASE_URL}/countries.json`, { httpsAgent: agent })
    //     .then((res) => {
    //       console.log('RES', res.data)
    //       this.countries = res.data
    //     })
    // }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

</style>

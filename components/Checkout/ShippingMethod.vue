<template lang="pug">
  .card
    header.card-header
      .card-header-title
        p 2. Shipping method
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
</template>

<script>
  import Vue from 'vue'
  import VeeValidate, { Validator } from 'vee-validate'
  // import VueScrollTo from 'vue-scrollto'
  // import axios from 'axios'

  Vue.use(VeeValidate)

  const dict = {
    custom: {
      shippingFirstName: {
        required: 'Whoops! First name is required'
      }
    }
  }

  Validator.localize('en', dict)

  export default {
    name: 'ShippingMethod',

    data () {
      return {
        form: {
          shipping: {
            firstName: 'richard'
          }
        }
      }
    },

    methods: {
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

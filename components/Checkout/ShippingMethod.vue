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
              .columns
                .column
                  .field
                    b-radio(v-model="radio" native-value="free") Free
                .column
                  p hello
              .columns
                .column
                  .field
                    b-radio(v-model="radio" native-value="2.99") £2.99

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
        radio: 'free'
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

  .card-content
    padding-top 4rem
    padding-bottom 4rem

</style>

<template lang="pug">
  div
    form
      .columns
        .column.is-half
          .field
            label.label Where is your bank located #[sup *]
            .control.is-expanded
              .select.is-fullwidth.is-multiple
                select(
                name="country"
                id="country"
                v-model="formData.country"
                data-vv-delay="600"
                :class="{ 'is-danger': errors.has('country') }"
                v-validate="'required'")
                  option(disabled value="") Please select a country
                  option(v-for="country in countries" :value="country.code") {{ country.label }}
              p(v-show="errors.has('country')" class="help is-danger" v-html="errors.first('country')")

</template>

<script>
  import Vue from 'vue'
  import VeeValidate, { Validator } from 'vee-validate'
  import VueScrollTo from 'vue-scrollto'
  import countries from '@/utils/countries'

  Vue.use(VeeValidate)

  const dict = {
    custom: {
      country: {
        required: 'Whoops! Country is required'
      }
    }
  }

  Validator.localize('en', dict)

  export default {
    name: 'BankForm',

    props: {
      itemData: {
        type: Object,
        required: false
      }
    },

    data () {
      return {
        loading: false,
        formData: {
          country: this.itemData ? this.itemData.country : ''
        },
        countries: countries
      }
    },

    created () {
      this.$parent.$on('createAccount', this.createAccount)
    },

    computed: {
      isFormValid () {
        return Object.keys(this.fields).every(key => this.fields[key] && this.fields[key].validated)
      }
    },

    methods: {
      createAccount () {
        return this.$store.dispatch('stripe/createAccount', this.formData, { root: true })
      }
    },

    watch: {
      scrollToError () {
        VueScrollTo.scrollTo('.is-danger')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

</style>

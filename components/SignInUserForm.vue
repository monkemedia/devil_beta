<template lang="pug">
  form(@submit.prevent="submit")
    b-message(type="is-danger" v-if="isSignInError") {{ isSignInError }}

    .field
      label.label Email
      .control
        input.input(
          name="email"
          label="Email"
          id="email"
          v-model="email"
          type="email"
          v-validate="'required|email'"
          data-vv-delay="600"
          :class="{'is-danger': errors.has('email') }")
        p(v-show="errors.has('email')" class="help is-danger" v-html="errors.first('email')")

    .field
      label.label Password
      .control
        input.input(
          name="password"
          label="Password"
          id="password"
          type="password"
          v-model="password"
          v-validate="'required'"
          data-vv-delay="600"
          :class="{'is-danger': errors.has('password') }")
        p(v-show="errors.has('password')" class="help is-danger" v-html="errors.first('password')")

    .columns
      .column.p-t-none.p-b-none
        .field
          .control
            button.button.is-primary.sign-in-button.is-flip(
              :class="{ 'is-loading': loading }"
              type="submit") 
                span(data-text="Sign in") Sign in
      .column.p-t-none.p-b-none.forgot-password
        nuxt-link(to="/register") Not yet registered?
</template>

<script>
  import _ from 'lodash'
  import Vue from 'vue'
  import VeeValidate, { Validator } from 'vee-validate'
  import VueScrollTo from 'vue-scrollto'

  Vue.use(VeeValidate)

  export default {
    name: 'SignInUserForm',

    data () {
      return {
        loading: false,
        email: null,
        password: 'C0re50!!',
        isSignInError: null
      }
    },

    methods: {
      submit () {
        // Validate form first
        this.$validator.validateAll()
          .then((response) => {
            if (response) {
              this.loading = true
              this.$store.dispatch('authenticateUser', {
                email: this.email,
                password: this.password
              })
                .then(() => {
                  this.loading = false
                  this.$router.push('/admin')
                })
                .catch(err => {
                  const string = _.lowerCase(err.message)
                  this.isSignInError = string
                  this.loading = false
                })
            } else {
              VueScrollTo.scrollTo('.is-danger')
            }
          })
      }
    },

    watch: {
      isSignInError () {
        VueScrollTo.scrollTo('.is-danger')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'
  @import '~assets/css/utilities/mixins.styl'

  .sign-in-button
    width 100%
  .forgot-password
    align-items center
    justify-content center
    display flex
    a
      BoldUppercase()
      text-decoration underline
      font-size $size-small

      &:hover
        text-decoration none
</style>

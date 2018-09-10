<template lang="pug">
  form(@submit.prevent="submit")
    b-message(type="is-danger" v-if="isSignInError") {{ isSignInError }}

    .field
      label.label Email #[sup *]
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
      label.label Password #[sup *]
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
        nuxt-link(to="/create-account") Not yet registered?
</template>

<script>
  import _ from 'lodash'
  import Vue from 'vue'
  import VeeValidate, { Validator } from 'vee-validate'
  import VueScrollTo from 'vue-scrollto'

  Vue.use(VeeValidate)

  const dict = {
    custom: {
      email: {
        required: 'Whoops! Email is required'
      },
      password: {
        required: 'Whoops! Password is required'
      }
    }
  }

  Validator.localize('en', dict)

  export default {
    name: 'SignInUserForm',

    data () {
      return {
        loading: false,
        email: 'info@monkemedia.co.uk',
        password: '1111qqqq',
        isSignInError: false
      }
    },

    methods: {
      submit () {
        // Hide errors first
        this.isSignInError = false
        // Validate form first
        this.$validator.validateAll()
          .then((response) => {
            if (response) {
              this.loading = true
              this.$store.dispatch('auth/login', {
                email: this.email,
                password: this.password
              })
                .then(() => {
                  this.loading = false
                  const isVendor = this.$store.getters['user/vendor']
                  const username = this.$store.getters['user/username']

                  if (this.$route.query.page === 'seller' && isVendor) {
                    console.log('go to seller account')
                    this.$router.push({ path: `/shop/${username}/setup/preferences` })
                  }
                  // if (this.$route.name === 'checkout') {
                  //   this.$router.push('/shipping')
                  // } else if (this.$route.query.page === 'seller') {
                  //   this.$router.push('/shop/')
                  // } else {
                  //   // Force SSR
                  //   document.location.href = '/admin'
                  // }
                })
                .catch(err => {
                  if (err) {
                    console.log(err.response)
                    if (err.response.status === 401) {
                      this.isSignInError = _.lowerCase('Looks like your email or password is incorrect')
                    }
                  } else {
                    this.isSignInError = _.lowerCase(err.message)
                  }

                  this.loading = false
                })
            } else {
              VueScrollTo.scrollTo('.is-danger')
            }
          })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'
  @import '~assets/css/utilities/mixins.styl'

  .sign-in-button
    width 100%
    margin-bottom 0
  .forgot-password
    align-items center
    justify-content center
    display flex
    margin-top 2rem
    a
      BoldUppercase()
      Underline($secondary)
      font-size $size-120
</style>

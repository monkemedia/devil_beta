<template lang="pug">
  form(@submit.prevent="onRegister")
    b-message(type="is-danger" v-if="isRegisterError") {{ isRegisterError }}
    .field
      label.label Username #[sup *]
      .control
        input.input(
          name="username"
          id="username"
          v-model="username"
          type="text"
          data-vv-delay="600"
          :class="{ 'is-danger': errors.has('username') }"
          v-validate="'required|alpha_dash|min:3'")
        p(v-show="errors.has('username')" class="help is-danger" v-html="errors.first('username')")

    .field
      label.label Full name #[sup *]
      .control
        input.input(
          name="name"
          id="name"
          v-model="name"
          type="text"
          data-vv-delay="600"
          :class="{ 'is-danger': errors.has('name') }"
          v-validate="'required'")
        p(v-show="errors.has('name')" class="help is-danger" v-html="errors.first('name')")

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

    .field
      label.label Password #[sup *]
      .control
        input.input(
          name="password"
          id="password"
          v-model="password"
          type="password"
          data-vv-delay="600"
          :class="{ 'is-danger': errors.has('password') }"
          v-validate="'required|min:6'")
        p(v-show="errors.has('password')" class="help is-danger" v-html="errors.first('password')")

    .field
      label.label Confirm password #[sup *]
      .control
        input.input(
          name="confirmedPassword"
          id="confirmedPassword"
          v-model="confirmedPassword"
          type="password"
          data-vv-delay="600"
          :class="{ 'is-danger': errors.has('confirmedPassword') }"
          v-validate="'required|confirmed:password'")
        p(v-show="errors.has('confirmedPassword')" class="help is-danger" v-html="errors.first('confirmedPassword')")

    .field
      .control
        button.button.is-primary.sign-in-button.is-flip(
          type="submit"
          :class="{ 'is-loading': loading }")
          span(data-text="Create account") Create account
      p.have-account Already have an account? <nuxt-link to="/sign-in" class="underline"> Sign in</nuxt-link>

</template>

<script>
  import Vue from 'vue'
  import VeeValidate, { Validator } from 'vee-validate'
  import VueScrollTo from 'vue-scrollto'

  Vue.use(VeeValidate)

  const dict = {
    custom: {
      username: {
        required: 'Whoops! Username is required'
      },
      name: {
        required: 'Whoops! Full name is required'
      },
      email: {
        required: 'Whoops! Email is required'
      },
      password: {
        required: 'Whoops! Password is required',
        min: 'Whoops! Password must be at least 6 characters'
      },
      confirmedPassword: {
        required: 'Whoops! Password confirmation is required',
        confirmed: 'Whoops! Passwords don\'t match'
      }
    }
  }

  Validator.localize('en', dict)

  export default {
    name: 'RegisterUserForm',

    data () {
      return {
        username: 'incubusrich',
        name: 'Richy',
        email: 'incubusrich@hotmail.com',
        password: '1111qqqq',
        confirmedPassword: '1111qqqq',
        pass: '',
        confirmPass: '',
        isRegisterError: null,
        loading: false
      }
    },

    methods: {
      onRegister () {
        // hide errors first
        this.isRegisterError = false
        // Validate form first
        this.$validator.validateAll()
          .then(() => {
            // Validate username first
            const payload = {
              email: this.email,
              password: this.password,
              name: this.name,
              username: this.username,
              vendor: this.$route.query.page === 'seller'
            }

            this.loading = true
            return this.$store.dispatch('auth/register', payload)
          })
          .then(() => {
            return this.$store.dispatch('auth/login', {
              email: this.email,
              password: this.password
            })
          })
          .then(() => {
            this.loading = false
            if (this.$route.query.page === 'seller') {
              console.log('go to seller account')
              this.$router.push({ path: `/shop/${this.username}/setup/preferences` })
            } else {
              this.$router.push('/admin')
            }
          })
          .catch(err => {
            console.log('err', err)
            if (err.response.status === 409) {
              this.isRegisterError = err.response.data.message
            } else {
              this.isRegisterError = err.message
            }

            this.loading = false
            VueScrollTo.scrollTo('.is-danger')
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
    margin-bottom 1rem

  .have-account
    font-size $size-100
    BoldUppercase()
</style>

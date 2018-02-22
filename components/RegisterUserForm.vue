<template lang="pug">
  form(@submit.prevent="onRegister")
    //- b-message(type="is-danger" v-if="isRegisterError") {{ isRegisterError }}

    b-field.account-types
      b-radio-button(
        v-model="accountType"
        native-value="buyer") Buyer
      b-radio-button(
        v-model="accountType"
        native-value="seller") Seller

    .field
      label.label Username
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
      label.label Email
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
      label.label Password
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
      label.label Confirm password
      .control
        input.input(
          name="password"
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          data-vv-delay="600"
          :class="{ 'is-danger': errors.has('confirmPassword') }"
          v-validate="'required|confirmed:password'")
        p(v-show="errors.has('confirmPassword')" class="help is-danger" v-html="errors.first('confirmPassword')")

    .field
      .control
        //- :class="{ 'is-loading': isRegisterButtonLoading }") 
        button.button.is-primary.sign-in-button.is-flip(
          type="submit")
          
          span(data-text="Create account") Create account
      p.have-account Already have an account? <router-link to="/sign-in" class="underline"> Sign in</router-link>

</template>

<script>
  import Vue from 'vue'
  import VeeValidate, { Validator } from 'vee-validate'
  import VueScrollTo from 'vue-scrollto'

  Vue.use(VeeValidate)

  export default {
    name: 'RegisterUserForm',

    data () {
      return {
        accountType: 'buyer',
        username: 'incubusrich',
        email: 'info@monkemedia.co.uk',
        password: '1111qqqq',
        confirmPassword: '1111qqqq',
        pass: '',
        confirmPass: ''
      }
    },

    computed: {
      comparePasswords () {
        return this.password !== this.confirmPassword ? 'Passwords do not match' : true
      }
    },

    methods: {
      onRegister () {
        // Validate form first
        this.$validator.validateAll()
          .then((response) => {
            const payload = {
              accountType: this.accountType,
              email: this.email,
              password: this.password,
              username: this.username
            }

            if (response) {
              this.$store.dispatch('registerUser', payload)
            } else {
              VueScrollTo.scrollTo('.is-danger')
            }
          })
      }

      // onDismissed () {
      //   this.$store.commit('SET_REGISTER_ERROR', false)
      // }
    }
  }
</script>
<style lang="stylus">
  .account-types
    .control[data-v-309bb44e] 
      .button
        width 100% !important
</style>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'
  @import '~assets/css/utilities/mixins.styl'

  .account-types
    .control
      width 50%

  .sign-in-button
    width 100%
    margin-bottom 1rem

  .have-account
    font-size $size-smaller
    BoldUppercase()
</style>
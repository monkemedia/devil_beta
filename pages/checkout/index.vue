<template lang="pug">
  .container.default-container-padding
    .columns
      .column
        h1 Checkout
    .columns.is-multiline
      .column.is-12-tablet.is-8-widescreen
        .checkout-login-wrapper
          .columns.is-gapless
            .column
              .sign-in-wrapper
                h2.h1 Sign In
                sign-in-user-form
            .column
              .create-account-wrapper
                h2.create-account-header Create account
                p Accounts are for members only, so please create an account below, and if you are a member, your account will be approved.
                nuxt-link.button.is-secondary.sign-in-button.is-flip(to="/create-account?visitor=unregistered")
                  span(data-text="Create account") Create account
      .column.is-12-tablet.is-4-widescreen
        order-summary

</template>

<script>
  import SignInUserForm from '@/components/SignInUserForm'
  import OrderSummary from '@/components/Checkout/OrderSummary'

  export default {
    name: 'Checkout',

    components: {
      SignInUserForm,
      OrderSummary
    },

    middleware: [
      'init-auth'
    ]
  }
</script>

<style lang="stylus">
  @import '~assets/css/utilities/variables.styl'

  .checkout-login-wrapper
    padding 2.4rem
    background $grey-light
    height 100%

  .create-account-wrapper
    padding-top 5rem

  @media only screen and (min-width: $tablet )
    .sign-in-wrapper
      padding 0 4rem 0 0
      position relative
      &:after
        position absolute
        content ''
        border-right 1px solid $grey-300
        height 75%
        top 50%
        right 0
        transform translateY(-50%)
    .create-account-wrapper
      padding 0 0 0 4rem

</style>

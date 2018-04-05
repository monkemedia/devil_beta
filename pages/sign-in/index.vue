<template lang="pug">
  .container.default-container-padding
    .columns
      .column
        h1 Sign In
        sign-in-user-form
      .column
        h2.h3 Create account
        p Accounts are for members only, so please create an account below, and if you are a member, your account will be approved.
        nuxt-link.button.is-secondary.sign-in-button.is-flip(to="/create-account")
          span(data-text="Create account") Create account
</template>

<script>
  import SignInUserForm from '@/components/SignInUserForm'

  export default {
    name: 'SignIn',

    middleware: [
      'check-auth',
      'fetch-cart-data'
    ],

    components: {
      SignInUserForm
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .container
    .column
      &:first-child
          margin-bottom 3rem

      @media only screen and (min-width: $tablet)
        padding-left 4rem
        padding-right 4rem

        &:first-child
          position relative
          &:after
            position absolute
            content ''
            border-right 1px solid $grey-300
            height 75%
            top 50%
            right 0
            transform translateY(-50%)

      @media only screen and (min-width: $desktop)
        &:first-child
          margin-bottom 0

      @media only screen and (min-width: $widescreen)
        padding-left 6rem
        padding-right 6rem

      @media only screen and (min-width: $fullhd)
        padding-left 10rem
        padding-right 10rem

      .create-account
        width 100%

        @media only screen and (min-width: $desktop)
          width auto
</style>

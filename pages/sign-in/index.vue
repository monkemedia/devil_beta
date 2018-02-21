<template lang="pug">
  .container.default-container-padding
    .columns
      .column
        h1 Sign In
        Sign-in-user-form
      .column
        h2.h3 Create account
        p Accounts are for members only, so please create an account below, and if you are a member, your account will be approved.
        router-link.button.is-secondary.sign-in-button.is-flip(to="/create-account") 
          span(data-text="Create account") Create account
</template>

<script>
  import { mapGetters } from 'vuex'
  import SignInUserForm from '@/components/SignInUserForm'

  export default {
    name: 'SignIn',

    components: {
      SignInUserForm
    },

    // fetch ({ store }) {
    //   store.commit('SET_SIGN_IN_ERROR', false) // Stop alert box showing when enter page

    //   if (this.user !== null) {
    //     const accountType = this.user.account_type || null

    //     if (accountType === 'seller') {
    //       this.$router.push({ path: '/admin' })
    //     } else {
    //       this.$router.push({ path: '/' })
    //     }
    //   }
    // },

    computed: {
      ...mapGetters([
        'user'
      ]),

      user () {
        return this.$store.getters.user
      }
    },

    watch: {
      user (value) {
        if (value !== null && value !== undefined) {
          this.alertToast({ message: 'You have successfully signed in', type: 'is-success' })

          if (value.account_type === 'seller') {
            this.$router.push({ path: '/admin' })
          } else {
            this.$router.push({ path: '/' })
          }
        }
      }
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
          border-right 1px solid $grey-light
      
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

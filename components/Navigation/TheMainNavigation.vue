<template lang="pug">
  .navbar-menu(:class="{ 'is-active': isMobileMenuActive }")
    .navbar-start
      .navbar-item#search-bar-desktop
        search-bar

    .navbar-end
      .navbar-item#user-login-desktop
        my-account
      .navbar-item#become-a-seller-desktop
        nuxt-link.become-a-seller-button(to="/sign-in?page=seller" v-if="!isAuthenticated") Become a seller
        nuxt-link.become-a-seller-button(to="/create-shop" v-else) Become a seller
      .navbar-item#mini-cart-desktop
        mini-cart
</template>

<script>
  import SearchBar from '@/components/Headers/SearchBar'
  import MyAccount from '@/components/Headers/MyAccount'
  import MiniCart from '@/components/Headers/MiniCart'

  export default {
    name: 'TheMainNavigation',

    components: {
      SearchBar,
      MyAccount,
      MiniCart
    },

    data () {
      return {
        navigation: [
          { title: 'Cart', path: '/cart' },
          { title: 'Men', path: '/' },
          { title: 'Sell', path: '/' }
        ]
      }
    },

    computed: {
      isMobileMenuActive () {
        return this.$store.getters.isMobileMenuOpen
      },

      isAuthenticated () {
        return this.$store.getters['auth/isAuthenticated']
      }
    },

    methods: {
      isActive (nav) {
        if (nav.title === this.$route.name) {
          return true
        }
        return false
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .navbar
    border-bottom 1px solid $gray-200
    .navbar-menu
      a.navbar-item
        font-size 1.8rem
        line-height 3
        margin 0 2rem
        padding 0
        overflow hidden

        @media (min-width: $desktop)
          font-size 1.4rem

          &:after
            NavbarUnderline()

          &:hover
          &.is-active
            &:after
              transform scale(1.3)
      &.is-active
        border-top 1px solid $gray-200

      #become-a-seller-desktop
      #search-bar-desktop
      #user-login-desktop
      #mini-cart-desktop
        display none

        @media (min-width: $desktop)
          display inline-flex

      .become-a-seller-button
        border 1px solid $grey
        padding 12px 10px
        margin-left 20px
</style>

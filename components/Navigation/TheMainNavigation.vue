<template lang="pug">
  .navbar-menu(:class="{ 'is-active': isMobileMenuActive }")
    .navbar-start
      nuxt-link.navbar-item(:to="nav.path" v-for="nav in navigation" :key="nav.title" :class="{ 'is-active': isActive(nav) }") {{ nav.title}}
    .navbar-end
      .navbar-item#search-bar-desktop
        search-bar
      .navbar-item#user-login-desktop
        my-account
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
      
      #search-bar-desktop
      #user-login-desktop
      #mini-cart-desktop
        display none
        
        @media (min-width: $desktop)
          display inline-flex
</style>

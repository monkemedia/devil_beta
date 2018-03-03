<template lang="pug">
  nav.navbar(:class="stickyHeader")
    .container
      .navbar-brand
        nuxt-link.navbar-item.logo-container(to="/home")
          img.main-logo(src="@/static/devil-panties-logo.svg" alt="Devil Panties")
        SearchBar#search-bar-mobile
        MiniCart#mini-cart-mobile
        BurgerMenu
      MainNavigation
    SearchBarOverlay

</template>

<script>
import SearchBar from '@/components/Headers/SearchBar'
import MiniCart from '@/components/Headers/MiniCart'
import BurgerMenu from '@/components/Headers/BurgerMenu'
import MainNavigation from '@/components/Navigation/TheMainNavigation'
import SearchBarOverlay from '@/components/Headers/SearchBarOverlay'

let stickyActive
let lastScrollTop = 0

export default {
  name: 'TheDefaultHeader',

  components: {
    SearchBar,
    MiniCart,
    BurgerMenu,
    MainNavigation,
    SearchBarOverlay
  },

  data () {
    return {
      stickyHeader: false
    }
  },

  mounted () {
    if (process.browser) { 
      window.addEventListener('scroll', this.handleScroll)
    }
  },

  methods: {
    handleScroll () {
      const $win = window
      const st = $win.pageYOffset || document.documentElement.scrollTop
      if (st > lastScrollTop && st >= 300) { // On scroll down
        stickyActive = true
        this.stickyHeader = 'slideInDown animated is-sticky-header'
      } else if (stickyActive && st < lastScrollTop) { // On scroll up
        stickyActive = false
        this.stickyHeader = 'slideOutUp animated is-sticky-header'
        setTimeout(() => {
          this.stickyHeader = ''
        }, 300)
      }
      lastScrollTop = st
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .navbar
    background $white
    border-bottom 1px solid #eee
    z-index 1
    position absolute
    top 0
    left 0
    right 0
    
    &.is-sticky-header
      position fixed
      height 50px
      
      .navbar-brand
        height auto
    
    &.animated
      animation-duration: .3s;

    .navbar-brand
      align-items center
      padding 1rem 2rem
      height 60px

      @media (min-width: $desktop)
        height 80px

      .logo-container
        top -1px
        .main-logo
          height 24px
          max-height 100%
          
          @media (min-width: $desktop)
            height 28px

      #search-bar-mobile
      #mini-cart-mobile
        @media (min-width: $desktop)
          display none
</style>

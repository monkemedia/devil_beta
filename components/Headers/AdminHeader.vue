<template lang="pug">
  nav.navbar
    .navbar-brand
      nuxt-link.navbar-item.is-hidden-mobile.is-hidden-tablet-only(to="/admin")
        //- img.main-logo(src="/static/devil-panties-main-logo.png" srcset="/static/devil-panties-main-logo.png 1x, /static/devil-panties-main-logo@x2.png 2x" alt="Devil Panties")
      burger-menu
    .navbar-menu
      .navbar-end
        .navbar-item#user-login-desktop
          my-account
</template>

<script>
  import BurgerMenu from '@/components/Headers/BurgerMenu'
  import MyAccount from '@/components/Headers/MyAccount'

  export default {
    name: 'Header',

    components: {
      BurgerMenu,
      MyAccount
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .navbar
    background $white
    border-bottom 1px solid #eee

    .navbar-brand
      align-items center
      padding 1rem 2rem
      height 60px

      .navbar-item
        .main-logo
          height 30px
          max-height 100%
</style>

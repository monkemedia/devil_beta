<template lang="pug">
  aside.menu.app-sidebar(:class="{ 'is-open': toggleMenu }")
    ul.menu-list
      li(v-for="nav in navigation")
        nuxt-link(active-class="is-active" :to="nav.route" exact) {{ nav.title }}
        ul(v-if="nav.sub")
          li(v-for="subNav in nav.sub")
            nuxt-link(active-class="is-active" :to="subNav.route" append) {{ subNav.title }}
</template>

<script>
  export default {
    name: 'LeftNav',

    data () {
      return {
        navigation: [
          {
            title: 'Dashboard',
            route: '/admin'
          },
          {
            title: 'Orders',
            route: '/admin/orders'
          },
          {
            title: 'Products',
            route: '/admin/products',
            sub: [
              {
                title: 'All Products',
                route: '/admin/products/'
              },
              {
                title: 'Add Product',
                route: '/admin/add-product'
              }
            ]
          },
          {
            title: 'Customers',
            route: '/admin/customers'
          }
        ]
      }
    },

    computed: {
      toggleMenu () {
        if (this.$store.getters.isAdminMobileMenuOpen) {
          return true
        }
        return false
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .app-sidebar
    position fixed
    top 61px
    left 0
    bottom 0
    padding 20px 0 50px
    width 180px
    min-width 45px
    max-height 100vh
    height calc(100% - 50px)
    z-index 10
    background #fff
    box-shadow 0 2px 3px hsla(0,0%,7%,.1), 0 0 0 1px hsla(0,0%,7%,.1)
    overflow-y auto
    overflow-x hidden
    
    @media only screen and (max-width $desktop)
      transform translate3d(-180px,0,0)
      transition transform 260ms ease, -webkit-transform 260ms
    
    &.is-open
      transform translate3d(0, 0, 0)
</style>
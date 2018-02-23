<template lang="pug">
  .navbar-burger(@click.prevent="toggleMobileMenu" :class="{ 'is-active': isMobileMenuActive }")
    span
    span
    span
</template>

<script>
  export default {
    name: 'BurgerMenu',

    methods: {
      toggleMobileMenu () {
        if (this.$store.getters.isMobileMenuOpen) {
          this.$store.commit('SET_MOBILE_MENU_TOGGLE', false)
        } else {
          this.$store.commit('SET_MOBILE_MENU_TOGGLE', true)
        }
      }
    },

    computed: {
      isMobileMenuActive () {
        return this.$store.getters.isMobileMenuOpen
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .navbar-burger
    border 0
    background-color transparent
    margin 0 0 0 2rem
    
    span
      width 22px
      height 2px
      left calc(50% - 11px)
      &:nth-child(1)
        top calc(50% - 8px)
      &:nth-child(3)
        top calc(50% + 6px)
    
    &.is-active 
      span
        &:nth-child(1)
          transform translateY(7px) rotate(45deg)
        &:nth-child(3)
          transform translateY(-7px) rotate(-45deg)
</style>
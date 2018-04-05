<template lang="pug">
  div
    admin-header.is-fixed-top
    left-nav
    .app-main
      section.section
        nuxt
</template>

<script>
  import AdminHeader from '@/components/Headers/AdminHeader'
  import LeftNav from '@/components/Navigation/AdminLeftNav'

  export default {
    name: 'LayoutAdmin',

    components: {
      AdminHeader,
      LeftNav
    }
  }
</script>

<style lang="stylus">
   @import '~assets/css/utilities/variables.styl'

  .navbar.is-fixed-top
    z-index 10

  .app-main
    padding-top 50px
    margin-left 0
    justify-content center
    display flex

    @media only screen and (min-width $desktop)
      margin-left 180px

    .section
      max-width 1096px
      width 100%
      margin-top 0
</style>

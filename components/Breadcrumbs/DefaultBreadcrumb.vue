<template lang="pug">
  nav.breadcrumb(aria-label="breadcrumbs")
    ul
      li
        nuxt-link(:to="crumb.path" exact) {{ crumb.title }}
</template>

<script>
  export default {
    name: 'Breadcumb',

    props: {
      crumb: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'
  @import '~assets/css/utilities/mixins.styl'

  .breadcrumb
    a
      padding-left 1.2rem !important
      BoldUppercase()
      font-size 1.2rem
      position relative

      &:before
        content '\f053'
        font-family FontAwesome
        position absolute
        left 0
        top 8px
        font-size $size-100

</style>

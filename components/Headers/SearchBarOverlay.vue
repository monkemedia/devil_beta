<template lang="pug">
  .search-bar-overlay(:class="{ 'is-open': toggleSearchBar }")
    .search-inner-wrapper.container
      form.form
        span.fa.fa-search
        input(type="text" placeholder="Search for product")
        a
          i.fa.fa-close.close(@click.prevent="closeSearchBar")
</template>

<script>
  export default {
    name: 'SearchBarOverlay',

    data () {
      return {}
    },

    methods: {
      closeSearchBar () {
        this.$store.commit('modals/SET_SEARCH_BAR', false)
      }
    },

    computed: {
      toggleSearchBar () {
        if (this.$store.getters['modals/isSearchBarOpen']) {
          return true
        }
        return false
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .search-bar-overlay
    opacity 0
    visibility hidden
    display none
    transition-property opacity,visibility
    width 100%
    position absolute
    height 100%
    z-index 100
    align-items center
    display flex
    justify-content center

    &.is-open
      opacity 1
      visibility visible
      display block 

    .search-inner-wrapper
      background $white
      height 100%
      padding 1rem 2rem

      .form
        display inline-flex
        justify-content space-between
        align-items center
        width 100%
        height 100%

        .fa-search
          font-size 2.6rem

        input
          font-size $size-large
          border 0
          outline-width 0
          padding-left 2rem
          width 100%
        
        .close
          font-size 2rem
</style>
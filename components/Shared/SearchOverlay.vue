<template lang="pug">
  .search-overlay(:class="{ isOpen: toggleSearchOverlay }" @click.prevent="closeSearchBar")
</template>

<script>
  export default {
    name: 'SearchOverlay',

    computed: {
      toggleSearchOverlay () {
        if (this.$store.getters['modals/isSearchBarOpen']) {
          return true
        }
        return false
      }
    },

    methods: {
      closeSearchBar () {
        this.$store.commit('modals/SET_SEARCH_BAR', false)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .search-overlay
    background $secondary
    width 100%
    height 100%
    position fixed
    z-index 50
    opacity 0
    visibility hidden
    display none

    &.isOpen
      opacity .8
      visibility visible
      display block
</style>

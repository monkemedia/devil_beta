<template lang="pug">
  a.toggle--search(@click.prevent="openSearchBar")
    i.fa.fa-search
</template>

<script>
  export default {
    name: 'SearchBar',

    methods: {
      openSearchBar () {
        this.$store.commit('modals/SET_SEARCH_BAR', true)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .toggle--search
    margin-left auto
    align-items center
    display flex
    .fa-search
      font-size $size-normal
      line-height 1.2
      margin-top -1px
</style>
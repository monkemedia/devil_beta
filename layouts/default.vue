<template lang="pug">
  div
    search-overlay
    main-header
    section.section
      nuxt
</template>

<script>
  import SearchOverlay from '@/components/Shared/SearchOverlay'
  import MainHeader from '@/components/Headers/TheDefaultHeader'

  export default {
    name: 'Default',

    components: {
      SearchOverlay,
      MainHeader
    }
  }
</script>

<style lang="stylus">
  .section
    margin-top 80px
</style>
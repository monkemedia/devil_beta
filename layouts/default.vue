<template lang="pug">
  div
    main-header
    section.section
      nuxt
</template>

<script>
  import MainHeader from '@/components/Headers/TheDefaultHeader'

  export default {
    name: 'Default',

    components: {
      MainHeader
    }
  }
</script>

<style lang="stylus">
  .section
    margin-top 80px
</style>
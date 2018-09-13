<template lang="pug">
  nav.navbar.is-fixed-bottom
    .container
      .navbar-menu
        .navbar-end
          button.button.is-primary.is-fullwidth.is-flip(@click.prevent="onClick" :class="{ 'is-loading': isLoading }")
            span(data-text="Save & continue") Save & continue
</template>

<script>
  export default {
    name: 'FixedFooter',

    data () {
      return {
        loading: false
      }
    },

    computed: {
      isLoading () {
        return this.$store.getters['buttons/isSetupLoading']
      }
    },

    methods: {
      onClick () {
        this.$emit('saveAndContinueEvent')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .button
    margin 1rem 0
    height 44px
    line-height 3.4

</style>

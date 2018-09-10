<template lang="pug">
 .subway
    p(v-for="(sub, index) in subway")
      | {{ sub.label }}
      span(v-if="index < progressStep") completed
      span(v-if="index === progressStep") active
</template>

<script>
  export default {
    name: 'Subway',

    data () {
      return {
        subway: [
          {
            label: 'Shop preferences'
          },
          {
            label: 'Stock your shop'
          },
          {
            label: 'Billing address'
          }
        ]
      }
    },

    computed: {
      progressStep () {
        return this.$store.getters['shop/shopProgress'].step
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>

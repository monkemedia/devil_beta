<template lang="pug">
  .steps
    .step-item(v-for="(step, index) in steps" :class="stepClass(step, index)")
      nuxt-link(:to="step.path" v-if="index <= progressSteps.step" exact)
        .step-marker {{ index + 1 }}
        .step-details
          p.step-title {{ step.label }}
      span(v-else)
        .step-marker {{ index + 1 }}
        .step-details
          p.step-title {{ step.label }}
</template>

<script>
  export default {
    name: 'Steps',

    data () {
      const username = this.$store.getters['user/username']

      return {
        steps: [
          {
            label: 'Shop preferences',
            path: `/shop/${username}/setup/preferences`,
            name: 'preferences'
          },
          {
            label: 'Stock your shop',
            path: '/shop/monkeyboy/setup/listings',
            name: 'listings'
          },
          {
            label: 'Billing address',
            path: 'test',
            name: 'test'
          }
        ]
      }
    },

    computed: {
      progressSteps () {
        return this.$store.getters['shop/shopProgress']
      }
    },

    methods: {
      stepClass (step, index) {
        const pageURL = this.$route.path.split('/').pop()
        const pageParm = this.$route.params

        console.log(pageParm)

        console.log('step', step)

        if (index < this.progressSteps.step) {
          if (pageURL === step.name) {
            return 'is-success is-active'
          }
          return 'is-success is-completed'
        } else if (
          pageURL === step.name ||
          (pageURL === 'create' && step.name === 'listings') ||
        (pageParm && pageParm.productId && step.name === 'listings')) {
          return 'is-success is-active'
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>

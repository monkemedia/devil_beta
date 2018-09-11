<template lang="pug">
  .steps
    .step-item(v-for="(step, index) in steps" :class="stepClass(step, index)")
      nuxt-link(:to="step.path" v-if="index <= progressSteps.step ")
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
      console.log('this.$route', this.$route)
      return {
        steps: [
          {
            label: 'Shop preferences',
            path: 'preferences'
          },
          {
            label: 'Stock your shop',
            path: 'listings'
          },
          {
            label: 'Billing address',
            path: 'test'
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
        const pageParam = this.$route.path.split('/').pop()
        console.log('one', pageParam)
        console.log('two', step.path)
        if (index < this.progressSteps.step) {
          if (pageParam === step.path) {
            return 'is-success is-active'
          }
          return 'is-success is-completed'
        } else if (pageParam === step.path) {
          return 'is-success is-active'
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>

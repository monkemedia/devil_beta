<template lang="pug">
  div
    steps
    shop-preferences-form(:formData="formData")
    fixed-footer(@saveAndContinueEvent="triggerSave")
</template>

<script>
  import Steps from '@/components/Shop/Admin/Steps'
  import ShopPreferencesForm from '@/components/Shop/Admin/ShopPreferencesForm'
  import FixedFooter from '@/components/Shop/Admin/FixedFooter'

  export default {
    name: 'ShopPreferences',

    head: {
      htmlAttrs: {
        class: 'has-navbar-fixed-bottom'
      }
    },

    middleware: [
      'init-auth',
      // 'auth',
      'add-item-error'
    ],

    components: {
      Steps,
      ShopPreferencesForm,
      FixedFooter
    },

    data () {
      return {
        formData: {
          language: '',
          country: '',
          currency: '',
          step: ''
        },

        progress: {
          step: ''
        }
      }
    },

    async fetch ({ store }) {
      const shopId = store.getters['user/shopId']

      return store.dispatch('shop/fetchShop', shopId)
        .then(res => {
          console.log('test res', res)
          const shop = res.data.shop
          const progress = res.data.progress

          this.formData = {
            language: shop.language || '',
            country: shop.country || '',
            currency: shop.currency || ''
          }

          this.progress = {
            step: progress.step || ''
          }
        })
    },

    mounted () {
      if (!process.client) return

      const shopId = this.$store.getters['user/shopId']

      return this.$store.dispatch('shop/fetchShop', shopId)
        .then(res => {
          console.log('test res', res)
          const shop = res.data.shop
          const progress = res.data.progress

          this.formData = {
            language: shop.language || '',
            country: shop.country || '',
            currency: shop.currency || ''
          }

          this.progress = {
            step: progress.step || ''
          }
        })
    },

    methods: {
      triggerSave () {
        this.$emit('saveForm')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .add-product-heading
    display inline-flex
    align-items center

    .tag
      margin-left 1rem
</style>

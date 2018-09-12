<template lang="pug">
  div
    steps
    shop-preferences-form(:formData="formData")
</template>

<script>
  // import Breadcrumb from '@/components/Breadcrumbs/AdminBreadcrumb'
  import Steps from '@/components/Shop/Admin/Steps'
  import ShopPreferencesForm from '@/components/Shop/Admin/ShopPreferencesForm'

  export default {
    name: 'ShopPreferences',

    //   layout: 'shopSetup',

    middleware: [
      'init-auth',
      // 'auth',
      'add-item-error'
    ],

    components: {
      // Breadcrumb,
      Steps,
      ShopPreferencesForm
    },

    data () {
      return {
        // breadcrumb: { title: 'Products', path: '/admin/products' }
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

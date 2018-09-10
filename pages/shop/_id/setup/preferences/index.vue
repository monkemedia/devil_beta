<template lang="pug">
  div
    subway
    shop-preferences-form(:formData="formData" @updateProgress="updateProgress" v-if="progress.step === 0")
    stock-your-shop(v-if="progress.step === 1")
</template>

<script>
  // import Breadcrumb from '@/components/Breadcrumbs/AdminBreadcrumb'
  import Subway from '@/components/Shop/Admin/Subway'
  import ShopPreferencesForm from '@/components/Shop/Admin/ShopPreferencesForm'
  import StockYourShop from '@/components/Shop/Admin/StockYourShop'

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
      Subway,
      ShopPreferencesForm,
      StockYourShop
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
    },

    methods: {
      updateProgress (value) {
        console.log('method')
        this.progress.step = value
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

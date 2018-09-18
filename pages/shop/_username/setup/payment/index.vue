<template lang="pug">
  div
    steps
    bank-form
    fixed-footer(@saveAndContinueEvent="triggerSave")
</template>

<script>
  // import Breadcrumb from '@/components/Breadcrumbs/AdminBreadcrumb'
  import Steps from '@/components/Shop/Admin/Steps'
  import BankForm from '@/components/Shop/Admin/BankForm'
  import FixedFooter from '@/components/Shop/Admin/FixedFooter'

  export default {
    name: 'ShopPayment',

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
      // Breadcrumb,
      Steps,
      BankForm,
      FixedFooter
    },

    async fetch ({ store }) {
      const shopId = store.getters['user/shopId']

      return store.dispatch('shop/fetchShop', shopId)
        .then(() => {
          // return store.dispatch('stripe/fetchAccount')
        })
    },

    mounted () {
      if (!process.client) return

      const shopId = this.$store.getters['user/shopId']

      return this.$store.dispatch('shop/fetchShop', shopId)
        .then(() => {
          // return this.$store.dispatch('stripe/fetchAccount')
        })
    },

    methods: {
      triggerSave () {
        this.$emit('createAccount')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

</style>

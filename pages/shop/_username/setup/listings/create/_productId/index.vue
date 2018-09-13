<template lang="pug">
  div
    steps
    add-product-form(:itemData="vendorProduct")
    fixed-footer(@saveAndContinueEvent="triggerSaveCreateForm")
</template>

<script>
  import Steps from '@/components/Shop/Admin/Steps'
  import AddProductForm from '@/components/Admin/AddProduct/MainForm'
  import FixedFooter from '@/components/Shop/Admin/FixedFooter'

  export default {
    name: 'EditListing',

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
      AddProductForm,
      FixedFooter
    },

    async fetch ({ store, params }) {
      const shopId = store.getters['user/shopId']
      const productId = params.productId

      return store.dispatch('shop/fetchShop', shopId)
        .then(() => {
          return store.dispatch('products/vendorProduct', productId)
        })
    },

    mounted () {
      if (!process.client) return

      const shopId = this.$store.getters['user/shopId']
      const productId = this.$route.params.productId

      return this.$store.dispatch('shop/fetchShop', shopId)
        .then(() => {
          return this.$store.dispatch('products/vendorProduct', productId)
        })
    },

    computed: {
      vendorProduct () {
        return this.$store.getters['products/loadedVendorProduct']
      }
    },

    methods: {
      triggerSaveCreateForm () {
        this.$emit('saveCreateForm')
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>

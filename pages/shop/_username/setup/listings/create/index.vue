<template lang="pug">
  div
    steps
    add-product-form
    fixed-footer(@saveAndContinueEvent="triggerSaveCreateForm")
</template>

<script>
  import Steps from '@/components/Shop/Admin/Steps'
  import AddProductForm from '@/components/Admin/AddProduct/MainForm'
  import FixedFooter from '@/components/Shop/Admin/FixedFooter'

  export default {
    name: 'CreateListing',

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

    async fetch ({ store }) {
      const shopId = store.getters['user/shopId']

      return store.dispatch('shop/fetchShop', shopId)
    },

    mounted () {
      if (!process.client) return

      const shopId = this.$store.getters['user/shopId']

      return this.$store.dispatch('shop/fetchShop', shopId)
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

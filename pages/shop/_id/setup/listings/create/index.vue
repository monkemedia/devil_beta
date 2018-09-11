<template lang="pug">
  div
    steps
    add-product-form
</template>

<script>
  import Steps from '@/components/Shop/Admin/Steps'
  import AddProductForm from '@/components/Admin/AddProduct/MainForm'

  export default {
    name: 'CreateListing',

    //   layout: 'shopSetup',

    middleware: [
      'init-auth',
      // 'auth',
      'add-item-error'
    ],

    components: {
      Steps,
      AddProductForm
    },

    async fetch ({ store }) {
      const shopId = store.getters['user/shopId']

      return store.dispatch('shop/fetchShop', shopId)
    },

    mounted () {
      if (!process.client) return

      const shopId = this.$store.getters['user/shopId']

      return this.$store.dispatch('shop/fetchShop', shopId)
    }
  }
</script>

<style lang="stylus" scoped>

</style>

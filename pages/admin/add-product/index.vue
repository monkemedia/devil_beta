<template lang="pug">
  div
    .columns
      .column
        header
          breadcrumb(:crumb="breadcrumb")
          h1.add-product-heading Add Product
    main-form(:categories="categories")
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumbs/AdminBreadcrumb'
  import MainForm from '@/components/Admin/AddProduct/MainForm'

  export default {
    name: 'AddProduct',

    layout: 'admin',

    middleware: [
      'init-auth',
      'auth'
    ],

    components: {
      Breadcrumb,
      MainForm
    },

    async fetch ({ store }) {
      return store.dispatch('products/categories')
    },

    mounted () {
      if (process.client) {
        return this.$store.dispatch('products/categories')
      }
    },

    data () {
      return {
        breadcrumb: { title: 'Products', path: '/admin/products' }
      }
    },

    computed: {
      categories () {
        return this.$store.getters['products/loadedCategories']
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

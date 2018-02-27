<template lang="pug">
  div
    .columns
      .column
        header
          breadcrumb(:crumb="breadcrumb")
          h1.add-product-heading Add Product
    main-form
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumbs/AdminBreadcrumb'
  import MainForm from '@/components/AddProduct/MainForm'

  export default {
    name: 'AddProduct',

    layout: 'admin',

    middleware: [
      'check-auth',
      'auth'
    ],

    components: {
      Breadcrumb,
      MainForm
    },

    data () {
      return {
        breadcrumb: { title: 'Products', route: '/admin/products' },
        storefront: ''
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
<template lang="pug">
  div
    .columns
      .column
        header
          breadcrumb(:crumb="breadcrumb")
          h1.add-product-heading Add Product
            span.tag.is-uppercase(:class="status(storefront)" v-if="storefront")
              | {{ storefront}}
    main-form(@passStorefront="passStorefront")
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumbs/AdminBreadcrumb'
  import MainForm from '@/components/AddProduct/MainForm'

  export default {
    name: 'AddProducts',

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
    },

    methods: {
      status (value) {
        return value === 'hidden' ? 'is-warning' : 'is-success'
      },

      passStorefront (value) {
        this.storefront = value
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
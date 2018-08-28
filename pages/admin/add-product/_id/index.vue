<template lang="pug">
  div
    .columns
      .column
        header
          breadcrumb(:crumb="breadcrumb")
          h1.add-product-heading Add Product
            span.tag.is-uppercase(:class="statusClass(itemData.store_front)" v-if="itemData")
              | {{ status(itemData.store_front) }}
    main-form(:itemData="itemData")
</template>

<script>
  import api from '~/api'
  import Breadcrumb from '@/components/Breadcrumbs/AdminBreadcrumb'
  import MainForm from '@/components/Admin/AddProduct/MainForm'

  export default {
    name: 'AddProductId',

    layout: 'admin',

    middleware: [
      'init-auth',
      'auth',
      'add-item-error'
    ],

    components: {
      Breadcrumb,
      MainForm
    },

    data () {
      return {
        breadcrumb: { title: 'Products', path: '/admin/products' }
      }
    },

    async fetch ({ store, params, error }) {
      const paramId = params.id

      return api.products.vendorProduct(paramId)
        .then(res => {
          if (res.data.product !== null) {
            return store.commit('products/SET_VENDOR_PRODUCT', res.data.product)
          }

          store.commit('products/SET_VENDOR_PRODUCT', null)
          error({ statusCode: 404, message: 'This page cannot be found', path: '/admin/add-product' })
        })
        .catch(err => {
          if (err.response) {
            error({ statusCode: err.response.status, message: err.response.data.message })
          } else {
            error({ statusCode: 404, message: 'This page cannot be found', path: '/admin/add-product' })
          }
        })
    },

    mounted () {
      if (process.client) {
        const paramId = this.$route.params.id

        return api.products.vendorProduct(paramId)
          .then(res => {
            if (res.data.product !== null) {
              return this.$store.commit('products/SET_VENDOR_PRODUCT', res.data.product)
            }

            this.$store.commit('products/SET_VENDOR_PRODUCT', null)
            this.error({ statusCode: 404, message: 'This page cannot be found', path: '/admin/add-product' })
          })
      }
    },

    computed: {
      itemData () {
        return this.$store.getters['products/loadedVendorProduct']
      }
    },

    methods: {
      statusClass (value) {
        return value ? 'is-success' : 'is-warning'
      },

      status (value) {
        return value ? 'Live' : 'Draft'
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

<template lang="pug">
  div
    .columns
      .column
        header
          breadcrumb(:crumb="breadcrumb")
          h1.add-product-heading Add Product
            span.tag.is-uppercase(:class="status(itemData.status)" v-if="itemData")
              | {{ itemData.status }}
    main-form(:itemData="itemData" :categories="categories")
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

      return store.dispatch('products/categories')
        .then(() => {
          return api.products.product(paramId)
            .then(res => {
              if (res.data.data !== null) {
                return store.commit('products/SET_MERCHANT_PRODUCT', res.data.data)
              }

              store.commit('products/SET_MERCHANT_PRODUCT', null)
              error({ statusCode: 404, message: 'This page cannot be found', path: '/admin/add-product' })
            })
            .catch(err => {
              if (err.response) {
                error({ statusCode: err.response.status, message: err.response.data.error })
              } else {
                error({ statusCode: 404, message: 'This page cannot be found', path: '/admin/add-product' })
              }
            })
        })
    },

    mounted () {
      if (process.client) {
        const paramId = this.$route.params.id

        return this.$store.dispatch('products/categories')
          .then(() => {
            return api.products.product(paramId)
              .then(res => {
                if (res.data.data !== null) {
                  return this.$store.commit('products/SET_MERCHANT_PRODUCT', res.data.data)
                }

                this.$store.commit('products/SET_MERCHANT_PRODUCT', null)
                this.error({ statusCode: 404, message: 'This page cannot be found', path: '/admin/add-product' })
              })
          })
      }
    },

    computed: {
      itemData () {
        return this.$store.getters['products/loadedMerchantProduct']
      },

      categories () {
        return this.$store.getters['products/loadedCategories']
      }
    },

    methods: {
      status (value) {
        return value === 'draft' ? 'is-warning' : 'is-success'
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

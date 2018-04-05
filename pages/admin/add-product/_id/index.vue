<template lang="pug">
  div
    .columns
      .column
        header
          breadcrumb(:crumb="breadcrumb")
          h1.add-product-heading Add Product
            span.tag.is-uppercase(:class="status(itemData.storefront)" v-if="itemData")
              | {{ itemData.storefront }}
    main-form(:itemData="itemData")
</template>

<script>
  import axios from 'axios'
  import Breadcrumb from '@/components/Breadcrumbs/AdminBreadcrumb'
  import MainForm from '@/components/Admin/AddProduct/MainForm'

  export default {
    name: 'AddProductId',

    layout: 'admin',

    middleware: [
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
      const token = store.getters['auth/token']
      const userId = store.getters['auth/userId']

      return axios.get(`${process.env.BASE_URL}/userProducts/${userId}/${paramId}.json?auth=${token}`)
        .then(result => {
          console.log('TREVOR', result)
          if (result.data !== null) {
            return store.commit('sellersItems/SET_SELLERS_ITEM', result.data)
          }
          store.commit('sellersItems/SET_SELLERS_ITEM', null)
          error({ statusCode: 404, message: 'This page cannot be found', path: '/admin/add-product' })
        })
        .catch(err => {
          if (err.response) {
            return error({ statusCode: err.response.status, message: err.response.data.error })
          }
          error({ statusCode: 404, message: 'This page cannot be found', path: '/admin/add-product' })
        })
    },

    computed: {
      itemData () {
        return this.$store.getters['sellersItems/loadedSellersItem']
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

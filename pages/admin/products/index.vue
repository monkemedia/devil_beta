<template lang="pug">
  section.section
    header
      h1 Products
      nuxt-link.button.is-primary.is-flip(to="/admin/add-product")
        span(data-text="Add product")
          | Add product
    div(v-if="!loadedItems")
      h2 Add your products
      p Get closer to your first sale by adding products.
      nuxt-link.button.is-secondary(to="/admin/add-product") Add product
    table.table.is-fullwidth(v-else)
      thead
        tr
          th(width="13%") Item
          th.is-hidden-touch
          th.is-hidden-mobile Stock
          th.is-hidden-mobile Price
          th Status
          th
      tbody
        tr(is="product-table-cell" :item="item" v-for="(item, index) in loadedItems" @deleteItem="deleteItem")
</template>

<script>
  import axios from 'axios'
  import ProductTableCell from '@/components/Admin/Products/ProductTableCell'

  export default {
    name: 'AdminProducts',

    layout: 'admin',

    middleware: [
      'check-auth',
      'auth'
    ],

    components: {
      ProductTableCell
    },

    data () {
      return {
        items: null
      }
    },

    async fetch ({ store, params, error }) {
      const token = store.getters['auth/token']
      const userId = store.getters['auth/userId']

      return axios.get(`${process.env.FB_URL}/userProducts/${userId}.json?auth=${token}`)
        .then((result) => {
          if (result.data !== null) {
            return store.commit('sellersItems/SET_SELLERS_ITEMS', result.data)
          }
          store.commit('sellersItems/SET_SELLERS_ITEMS', null)
        })
        .catch((err) => {
          if (err.response) {
            return error({ statusCode: err.response.status, message: err.response.data.error })
          }
          error({ statusCode: 404, message: 'This page cannot be found', path: '/admin/add-product' })
        })
    },

    computed: {
      loadedItems () {
        return this.$store.getters['sellersItems/loadedSellersItems']
      }
    },

    methods: {
      deleteItem (payload) {
        const token = this.$store.getters['auth/token']
        const uniqueId = this.$store.getters['auth/userId']
        const loadingComponent = this.$loading.open()
        const productId = payload.product_id
        const category = payload.category

        return axios.delete(`${process.env.FB_URL}/userProducts/${uniqueId}/${productId}.json?auth=${token}`)
          .then(() => {
            return this.$store.dispatch('sellersItems/deleteItem', { productId, category, token })
          })
          .then(() => {
            loadingComponent.close()
            this.alertToast({ message: 'Item has been deleted', type: 'is-success' })
          })
          .catch(() => {
            this.alertToast({ message: 'Your item cannot be deleted', type: 'is-warning' })
            loadingComponent.close()
          })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'
  @import '~assets/css/utilities/mixins.styl'

  header
    justify-content space-between
    display flex
    margin-bottom 2rem

    .button
      margin 0

  .table
    BoldUppercase()
    thead
      background-color $secondary
      font-size 1.2rem
      th
        color $white
        padding-top 1.2rem
        padding-bottom 1.2rem
    tbody
      font-size 1.5rem
</style>

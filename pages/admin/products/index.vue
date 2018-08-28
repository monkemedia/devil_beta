<template lang="pug">
  section.section
    header
      h1 Products
      nuxt-link.button.is-primary.is-flip(to="/admin/add-product")
        span(data-text="Add product")
          | Add product
    div(v-if="products.length === 0")
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
        tr(is="product-table-cell" :item="item" v-for="(item, index) in products" @deleteProduct="deleteProduct")
</template>

<script>
  // import axios from 'axios'
  import ProductTableCell from '@/components/Admin/Products/ProductTableCell'

  export default {
    name: 'AdminProducts',

    layout: 'admin',

    middleware: [
      'init-auth',
      'auth'
    ],

    components: {
      ProductTableCell
    },

    async fetch ({ store }) {
      return store.dispatch('products/vendorProducts')
    },

    mounted () {
      if (process.client) {
        return this.$store.dispatch('products/vendorProducts')
      }
    },

    computed: {
      products () {
        return this.$store.getters['products/loadedVendorProducts']
      }
    },

    methods: {
      deleteProduct (payload) {
        const loadingComponent = this.$loading.open()
        const productId = payload.product_id

        return this.$store.dispatch('products/deleteProduct', productId)
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

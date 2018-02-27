<template lang="pug">
  section.section
    header
      h1 Products
      nuxt-link.button.is-primary.is-flip(:to="{ name: 'Add Product' }") 
        span(data-text="Add product")
          | Add product
    div(v-if="noItemLoaded")
      h2 Add your products
      p Get closer to your first sale by adding products.
      nuxt-link.button.is-secondary(:to="{ name: 'Add Product' }") Add product
    table.table.is-fullwidth(v-if="loadedItems")
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
  import ProductTableCell from '@/components/Admin/Products/ProductTableCell'

  export default {
    name: 'AdminProducts',

    layout: 'admin',

    components: {
      ProductTableCell
    },

    data () {
      return {
        loadedItems: '',
        noItemLoaded: false
      }
    },

    mounted () {
      let loading
      loading = this.$loading.open()
      this.$store.dispatch('sellersItem/loadSellersItems')
        .then((response) => {
          if (response) {
            this.loadedItems = response
          } else {
            this.noItemLoaded = true
          }
          loading.close()
        })
        .catch(() => {
          this.alertToast({ message: 'Your items cannot be loaded', type: 'is-warning' })
        })
    },

    methods: {
      deleteItem (payload) {
        this.$delete(this.loadedItems, payload.product_id)
        this.$store.dispatch('sellersItems/removeSellersItem', payload)
          .then(() => {
            this.$delete(this.loadedItems, payload.product_id)
            this.alertToast({ message: 'Item has been deleted', type: 'is-success' })
          })
          .catch(() => {
            this.alertToast({ message: 'Your item cannot be deleted', type: 'is-warning' })
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
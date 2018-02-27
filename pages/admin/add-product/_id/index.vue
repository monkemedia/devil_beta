<template lang="pug">
  div
    .columns
      .column
        header
          breadcrumb(:crumb="breadcrumb")
          h1.add-product-heading Add Product
            span.tag.is-uppercase(:class="status(storefront)" v-if="storefront")
              | {{ storefront}}
    main-form(:itemData="itemData")
</template>

<script>
  import axios from 'axios'
  import Breadcrumb from '@/components/Breadcrumbs/AdminBreadcrumb'
  import MainForm from '@/components/AddProduct/MainForm'

  export default {
    name: 'AddProductId',

    layout: 'admin',

    middleware: [
      'check-auth',
      'auth',
      'add-item-error'
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

    async fetch ({ store, params }) {
      const paramId = params.id
      const token = store.getters['auth/token']
      const userId = store.getters['auth/userId']
      const vm = this
      return await axios.get(`${process.env.BASE_URL}/usersProducts/${userId}/${paramId}.json?auth=${token}`)
        .then(result => {
          console.log('result', result)
          if (result.data !== null) {
            store.commit('userItem/SET_USER_ITEM', result.data)
          } else {
            store.commit('userItem/SET_USER_ITEM', null)
            store.commit('userItem/SET_ERROR', true)
          }
        })
        .catch(err => {
          // this.alertToast({ message: 'Item doesnt exist', type: 'is-danger' })
        })
    },

    computed: {
      itemData () {
        return this.$store.getters['userItem/loadedUserItem']
      },

      isError () {
        return this.$store.getters['userItem/isError']
      }
    },

    methods: {
      status (value) {
        return value === 'hidden' ? 'is-warning' : 'is-success'
      },

      passStorefront (value) {
        this.storefront = value
      }
    },

    watch: {
      isError (value) {
        console.log('value', value)
        alert()
        if (value) {
          alert()
          this.alertToast({ message: 'Item doesnt exist', type: 'is-danger' })
        }
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
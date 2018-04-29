<template lang="pug">
  section.section
    .columns
      .column
        header
          h1.add-product-heading Shipping
          shipping-form(:shippingData="shipping")

</template>

<script>
  import axios from 'axios'
  import ShippingForm from '@/components/Admin/Shipping/Index.vue'

  export default {
    name: 'Shipping',

    layout: 'admin',

    middleware: [
      'init-auth',
      'auth'
    ],

    components: {
      ShippingForm
    },

    asyncData ({ store }) {
      const token = store.getters['auth/token']
      const uid = store.getters['auth/uid']

      return axios.get(`${process.env.FB_URL}/users/${uid}/shippingMethods.json?auth=${token}`)
        .then((result) => {
          console.log('shipping result', result.data)
          return {
            shipping: result.data
          }
        })
    },

    data () {
      return {
        shipping: []
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'
</style>

<template lang="pug">
  section.section
    .columns
      .column
        header
          h1.add-product-heading Bank account

</template>

<script>
  import axios from 'axios'

  export default {
    name: 'BankAccount',

    layout: 'admin',

    middleware: [
      'init-auth',
      'auth'
    ],

    created () {
      return axios.post('/api/create-account/')
        .then((res) => {
          console.log('response', res)
        })
        .catch((e) => {
          console.log(e)
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

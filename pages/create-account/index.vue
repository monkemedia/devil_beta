<template lang="pug">
  .container.default-container-padding
    .columns.is-centered
      .column.is-6-tablet.is-5-desktop.is-4-widescreen
        h1 Create an account
        register-user-form
</template>

<script>
  import RegisterUserForm from '@/components/RegisterUserForm'

  export default {
    name: 'Register',

    middleware: [
      'check-auth'
    ],

    components: {
      RegisterUserForm
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

</style>

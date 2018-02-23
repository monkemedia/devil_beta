<template lang="pug">
  a(@click.prevent="logOut" :class="type") Log out
</template>

<script>
  export default {
    name: 'LogOut',

    props: {
      type: {
        type: String,
        required: true
      }
    },

    methods: {
      logOut () {
        this.$store.dispatch('auth/logout')
        this.$router.push('/sign-in')
      }
    },

    watch: {
      logOutError () {
        this.$toast.open({
          message: 'You have successfully registered with us',
          duration: 5000,
          type: 'is-danger'
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .button
    width 100%
    margin-bottom 0
</style>

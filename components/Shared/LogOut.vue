<template lang="pug">
  a(@click.prevent="logOut" :class="type") Log out
</template>

<script>
  import { mapGetters } from 'vuex'

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
        const self = this
        function message (data, type) {
          setTimeout(() => {
            self.$toast.open({
              message: data.message,
              duration: 2000,
              type: 'is-success'
            })
          }, 400)
        }

        this.$store.dispatch('logout')
          .then((response) => {
            message(response, 'is-success')
            this.$router.push('/sign-in')
          })
          .catch((err) => {
            message(err, 'is-danger')
          })
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

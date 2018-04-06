<template lang="pug">
  div
    .user-login-buttons(v-if="!isAuthenticated")
      nuxt-link.animated-underline(to="/sign-in") Sign in
      span.or or
      nuxt-link.animated-underline(to="/create-account") Register

    .user-logged-in(v-else)
      .dropdown(:class="{ 'is-active': isActive }")
        .dropdown-trigger
          a.user-logged-in-wrapper(aria-haspopup="true" aria-controls="dropdown-menu-user-account" @click="isActive = !isActive" v-on-clickaway="away")
            span.avatar
              i.fa.fa-user
            span Hi, {{ username }}
            span.icon.icon-chevron.is-small
              i.fa.fa-angle-down(aria-hidden="true")
        .dropdown-menu#dropdown-menu-user-account(role="menu" :class="$route.name")
          .dropdown-content
            h6.h3.dropdown-header Hi, {{ username }}
            hr.dropdown-divider
            nuxt-link.dropdown-item(v-for="item in items" :to="item.path" :key="item.name") {{ item.name }}
            .dropdown-item
              log-out(type="button is-secondary")
</template>

<script>
  import LogOut from '@/components/Shared/LogOut'
  import { mixin as clickaway } from 'vue-clickaway'

  export default {
    name: 'UserLogin',

    components: {
      LogOut
    },

    mixins: [
      clickaway
    ],

    data () {
      return {
        isActive: false,
        items: [
          {
            name: 'Console',
            path: '/admin'
          }
        ]
      }
    },

    computed: {
      isAuthenticated () {
        return this.$store.getters['auth/isAuthenticated']
      },

      username () {
        return this.$store.getters['auth/username']
      }

    },

    methods: {
      away () {
        this.isActive = false
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'
  @import '~assets/css/utilities/mixins.styl'

  .user-login-buttons
    BoldUppercase()
    font-size $size-120

    .or
      color $tertiary
      margin 0 .6rem

  .user-logged-in
    BoldUppercase()
    font-size $size-120

    .user-logged-in-wrapper
      display flex
      align-items center

    .avatar
      border-radius 50%
      background-color $grey-light
      display inline-flex
      height 25px;
      width 25px
      position relative
      overflow hidden
      margin-right .8rem

      .fa-user
        position absolute
        top 6px
        left 5px
        &:before
          font-size 2rem

    .dropdown-menu
      min-width 300px
      right 0
      left auto
      padding-top 2.7rem
      .dropdown-content
        padding 3rem
        border 1px solid $grey-light
        border-radius 0
        box-shadow none
        text-align center
        a.dropdown-item
          padding-top 1rem
          padding-bottom 1rem
          font-size $size-120
          &:first-of-type
            margin-top 2rem
      &.Create
        padding-top 1.7rem

    .icon-chevron
      margin-left .5rem

    .dropdown-header
      margin-top 0

</style>

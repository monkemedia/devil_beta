<template lang="pug">
  div
    h1 Create Post

    h2 Exisiting posts
    post-list
</template>

<script>
  import PostList from '@/components/Posts/PostList'

  export default {
    middleware: [
      'check-auth',
      'auth',
      'cart'
    ],

    layout: 'admin',

    components: {
      PostList
    }
  }
</script>
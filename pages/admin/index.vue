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
      'init-auth',
      'auth'
    ],

    layout: 'admin',

    components: {
      PostList
    }
  }
</script>

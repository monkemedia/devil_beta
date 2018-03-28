<template lang="pug">
  div
    h1 Get the lates tech news
    section
      post-preview(id="1" title="Hello people this is a test")
</template>

<script>
  import PostPreview from '@/components/Posts/PostPreview'

  export default {
    middleware: [
      'check-auth',
      'cart'
    ],

    components: {
      PostPreview
    }
  }
</script>


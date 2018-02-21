<template lang="pug">
  div
    nuxt-link(:to="'/posts/' + 1")
      article 
        h2 Post title {{ id }}
        p {{ title }}
</template>

<script>
  export default {
    name: 'PostPreview',
    props: {
      id: {
        type: String,
        required: true
      },

      title: {
        type: String,
        required: true
      }
    }
  }
</script>
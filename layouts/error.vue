<template lang="pug">
  .container
    .columns
      .column.has-text-centered(v-if="error.statusCode === 404")
        h1 {{ error.statusCode }}
        p {{ error.message }}
        nuxt-link.button.is-primary.is-flip(:to="error.path ? error.path : '/'")
          span(data-text="Go Back") Go Back
      .column.has-text-centered(v-else)
        h1 {{ error.statusCode }}
        p {{ error.message }}
        nuxt-link.button.is-primary.is-flip(:to="error.path ? error.path : '/'")
          span(data-text="Go Back") Go Back
</template>

<script>
  export default {
    props: {
      error: {
        type: Object,
        required: true
      }
    }
    // layout: 'blog' // you can set a custom layout for the error page
  }
</script>

<template lang="pug">
  div
    h1 Homepage
</template>

<script>
  export default {
    middleware: [
      'init-auth'
    ]
  }
</script>

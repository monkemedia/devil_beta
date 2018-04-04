<template lang="pug">
  div
    h1 Homepage
</template>

<script>

  export default {
    middleware: [
      'check-auth',
      'check-anon-auth'
    ]
  }
</script>


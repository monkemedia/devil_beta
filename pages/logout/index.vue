<template lang="pug">
</template>

<script>
  export default {
    name: 'LogoutPage',

    created () {
      this.$router.push('sign-in')
    }
  }
</script>

<template lang="pug">
 .card
  .card-image
    figure.image
      img(src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image")
  .card-content(v-if="item")
    p {{ item.name }}
  footer.card-footer(v-if="item")
    <a href="#" class="card-footer-item">Save</a>
    <a href="#" class="card-footer-item">Edit</a>
    <a href="#" class="card-footer-item">Delete</a>
</template>

<script>
  export default {
    name: 'ListingItem',

    props: {
      item: {
        type: Object,
        required: false
      }
    },

    data () {
      return {
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>

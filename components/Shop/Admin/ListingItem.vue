<template lang="pug">
 .card
  .card-image
    figure.image
      img(src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image")
  .card-content(v-if="item")
    p {{ item.name }}
  footer.card-footer(v-if="item")
    nuxt-link.card-footer-item(:to="`listings/create/${item._id}`") Edit
    a.card-footer-item(@click="deleteModal()") Delete
</template>

<script>
  export default {
    name: 'ListingItem',

    props: {
      item: {
        type: Object,
        required: false
      },
      index: {
        type: Number,
        required: false
      }
    },

    data () {
      return {
      }
    },

    methods: {
      deleteModal () {
        console.log(this.item)
        this.$dialog.confirm({
          title: 'Test',
          message: 'Are you sure you want to delete',
          cancelText: 'Disagree',
          confirmText: 'Agree',
          type: 'is-success',
          onConfirm: () => {
            console.log('confirmed')
            this.$root.$emit('deleteProduct', {
              productId: this.item._id,
              productIndex: this.index,
              images: this.item.images || null
            })
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>

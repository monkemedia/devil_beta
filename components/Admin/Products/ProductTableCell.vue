<template lang="pug">
  tr
    td.is-hidden-touch
      .product-image
        figure(v-if="item.images !== undefined && item.images.length > 0")
          lazy-image(
            :src="item.images[0].url + '-/resize/110/-/crop/110x110/center/'"
            :small-src="item.images[0].url + '-/resize/110/-/crop/110x110/center/'"
            :alt="item.images[0].alt")
        span.no-image(v-else)
          i.fa.fa-file-image-o(aria-hidden="true")
    td
      .product-details
        strong {{ item.name || 'No Title' }}
    td.is-hidden-mobile {{ item.stock }}
    td.is-hidden-mobile
      span(v-if="item.on_sale") {{ item.sale_price | currency(item.price.currency) }}
        span.was-price {{ item.price.amount | currency(item.price.currency) }}
      span(v-else) {{ item.price.amount | currency(item.price.currency) }}
    td
      span.tag.is-uppercase(:class="statusClass(item.store_front)")
        | {{ status(item.store_front) }}
    td
      .dropdown.is-right(:class="{ 'is-active': toggled }")
        .dropdown-trigger
          a(aria-haspopup="true" :aria-controls="item.id" @click="toggle(item)" v-on-clickaway="away")
            i.fa.fa-ellipsis-h(aria-hidden="true")
        .dropdown-menu(role="menu" :id="item.id")
          .dropdown-content
            nuxt-link.dropdown-item(:to="'/admin/add-product/' + item._id")
              span.icon.is-small.m-r-md
                i.fa.fa-pencil
              | Edit item
            a.dropdown-item(@click="deleteModal()")
              span.icon.is-small.m-r-md
                i.fa.fa-trash
              | Delete item
</template>

<script>
  import { mixin as clickaway } from 'vue-clickaway'

  export default {
    name: 'ProductTableCell',

    mixins: [
      clickaway
    ],

    props: {
      item: {
        type: Object,
        required: true
      }
    },

    data () {
      return {
        toggled: false
      }
    },

    methods: {
      statusClass (value) {
        return value ? 'is-success' : 'is-warning'
      },

      status (value) {
        return value ? 'Live' : 'Draft'
      },

      toggle () {
        this.toggled = !this.toggled
      },

      away () {
        this.toggled = false
      },

      deleteModal () {
        console.log(this.item)
        this.$dialog.confirm({
          title: 'Test',
          message: 'Are you sure you want to delete',
          cancelText: 'Disagree',
          confirmText: 'Agree',
          type: 'is-success',
          onConfirm: () => {
            this.$emit('deleteProduct', {
              product_id: this.item._id,
              images: this.item.images || null
            })
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .product-image
    figure
      width 100%
      max-width 110px
      height 110px
      border 1px solid $grey-lighter
      img
        width 100%

    .no-image
      width 100%
      justify-content center
      display inline-flex
      max-width 110px
      height 110px
      align-items center
      .fa
        font-size 3.3rem
        color $grey
  .dropdown-item
    font-size 1.2rem
    padding .8rem 1.2rem

  .was-price
    color $grey
    text-decoration line-through
    font-family 'Avenir-Medium'
</style>

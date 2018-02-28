<template lang="pug">
  div
    .carousel-container(v-if="images.length")
      figure.is-hidden-mobile.desktop-images
        image-zoom(:img="images[currentIndex].url" :width="1000")

      slick.is-hidden-tablet.mobile-images(ref="slick" :options="slickOptionsMobile")
        figure(v-for="(image, index) in images" :class="{ 'is-active': image[index] === currentIndex }")
          a(@click="mainImageHandler(index)")
            lazy-image(
              :src="image.url + '-/resize/70/-/crop/70x70/center/'"
              :small-src="image.url + '-/resize/70/-/crop/70x70/center/'"
              :alt="image.alt")
      slick.is-hidden-mobile.thumbnails(ref="slick" :options="slickOptions")
        figure(v-for="(image, index) in images" :class="{ 'is-active': index === currentIndex }")
          a(@click="mainImageHandler(index)")
            lazy-image(
              :src="image.url + '-/resize/70/-/crop/70x70/center/'"
              :small-src="image.url + '-/resize/70/-/crop/70x70/center/'"
              :alt="image.alt")

    //- No images
    .carousel-container(v-else)
      figure.no-image
        span
          i.fa.fa-file-image-o(aria-hidden="true")
</template>

<script>
  import Slick from 'vue-slick'
  import ImageZoom from '@/components/Shared/ImageZoom'
  import '@/node_modules/slick-carousel/slick/slick.css'

  export default {
    name: 'ImageCarousel',

    components: {
      Slick,
      ImageZoom
    },

    props: [
      'images'
    ],

    data () {
      return {
        width: 1000,
        currentIndex: 0,
        slickOptions: {
          slidesToShow: 5,
          vertical: true,
          verticalSwiping: true
        },
        slickOptionsMobile: {
          slidesToShow: 1,
          vertical: false,
          verticalSwiping: false,
          prevArrow: false,
          nextArrow: false
        }
      }
    },

    methods: {
      mainImageHandler (value) {
        this.currentIndex = value
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'
  
  div
    height 100%
  
  div
    height 100%
  
  .carousel-container
    display flex
    justify-content space-between
    height 100%
    
    figure
      border 1px solid $grey-300
      height 70px
      width 70px
      
      &.is-active
        border 2px solid $grey

    .desktop-images
      width 100%
      height 100%
      max-width 552px
      
    img 
      display block
      width 100%
      height auto

    .mobile-images
      width 100%
    
    .no-image
      width 100%
      span
        width 100%
        border 1px solid $grey-lighter
        justify-content center
        display inline-flex
        height 100%
        align-items center
        .fa
          font-size 8rem
          color $grey
  
  .thumbnails
    width 100px
    padding-left 15px
  
</style>
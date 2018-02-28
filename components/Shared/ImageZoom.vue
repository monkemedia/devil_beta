<template lang="pug">
  .zoom
    lazy-image(
      :src="img + '-/resize/500/'"
      :small-src="img + '-/resize/70/-/crop/70x70/center/'"
      :alt="img.alt"
      :width="width")
</template>

<script>
  if (process.browser) {
    const $ = window.jQuery = require('jquery')
    require('jquery-zoom');
  }

  export default {
    props: {
      img: {
        type: String,
        required: true
      },
      width: {
        type: [String, Number],
        required: true
      },
      url: {
        type: [String, Boolean],
        default: false
      },
      on: {
        type: String,
        default: 'mouseover'
      },
      duration: {
        type: [String, Number],
        default: 120
      },
      target: {
        type: [String, Boolean],
        default: false
      },
      touch: {
        type: Boolean,
        default: true
      },
      magnify: {
        type: [String, Number],
        default: 1
      },
      callback: {
        type: [Function, Boolean],
        default: false
      },
      onZoomIn: {
        type: [Function, Boolean],
        default: false
      },
      onZoomOut: {
        type: [Function, Boolean],
        default: false
      }
    },

    mounted () {
      this.zoomMethod()
    },

    methods: {
      zoomMethod () {
        $('.zoom').trigger('zoom.destroy')
        $('.zoom').zoom({
          url: `${this.img}-/resize/1000/`,
          on: this.on,
          duration: this.duration,
          target: this.target,
          touch: this.touch,
          magnify: this.magnify,
          callback: this.callback,
          onZoomIn: this.onZoomIn,
          onZoomOut: this.onZoomOut
        })
      }
    },

    watch: {
      img () {
        this.zoomMethod()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .zoom
    display inline-block
    position relative
    cursor url('~assets/images/zoom-icon.png'), auto

  .zoom img
    display block

  .zoom img::-moz-selection
    background-color transparent

  .zoom img::selection
    background-color transparent
</style>
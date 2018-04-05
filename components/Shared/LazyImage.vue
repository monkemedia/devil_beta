<template lang="pug">
  img(:src="imageSrc")
</template>

<script>
  export default {
    name: 'LazyImage',

    props: {
      src: {
        type: String,
        required: true
      },
      smallSrc: {
        type: String,
        required: true
      }
    },

    data () {
      return {
        imageSrc: this.smallSrc
      }
    },

    mounted () {
      this.lazyImage()
    },

    methods: {
      lazyImage () {
        let img

        img = new Image()
        this.imageSrc = `${this.smallSrc}-/quality/lighter/-/blur/100/`

        img.onload = () => {
          setTimeout(() => {
            this.imageSrc = this.src
          }, 300)
        }

        img.src = this.src
      }
    },

    watch: {
      src (value) {
        this.lazyImage()
      }
    }
  }
</script>

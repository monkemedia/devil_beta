<template lang="pug">
  .form-panel
    legend.legend Images
    .dropzone(@dragenter="hovering = true" ref="dropzone" @dragleave="hovering = false" :class="{ 'hovered': hovering, 'disabled': disabled }")
      input(:disabled="disabled" type="file" id="file" ref="fileInput" class="native-input" name="file" accept="image/x-png,image/jpeg" multiple @change="onChange")
      span.icon.upload-icon
        i.fa.fa-cloud-upload
      .dz-text
        strong Choose a file
        span or drag it here

    ul.dropzone-preview
      draggable.draggable-wrap
        li.upload-images(v-for="(image, index) in images" :class="{'is-hidden': selected === image}")
          figure
            lazy-image(
              :src="image.url + '-/resize/110/-/crop/110x110/center/'"
              :small-src="image.url + '-/resize/110/-/crop/110x110/center/'"
              :alt="images.alt")
          .action-overlay
            a.remove-image(@click.prevent="deleteImageModal(index, image)")
              span.icon
                i.fa.fa-trash-o
        //- Show spinner as image is uploading
        li.upload-images.is-loading(v-for="tempImg in temp_images_")

      li.upload-images.upload-images-button(v-if="images.length +  temp_images_.length < 5" disabled)
        button(@click.prevent="addImageHandler")
          span.icon
            i.fa.fa-upload

</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    name: 'UploadImages',

    components: {
      draggable
    },

    props: {
      imagesData: {
        type: Array,
        required: false
      }
    },

    data () {
      return {
        temp_images_: [],
        images: this.imagesData || [],
        hovering: false,
        disabled: false,
        isLoading: false,
        selected: null
      }
    },

    methods: {
      onChange (event) {
        const files = event.target.files

        if (this.limitAmountOfImages(files)) {
          for (let i = 0; i < files.length; i++) {
            let filename = files[i].name

            if (filename.lastIndexOf('.') <= 0) {
              return alert('Please add a valid file!')
            }
            this.temp_images_.push(files[i])
          }

          this.isLoading = true

          this.$store.dispatch('sellersItems/saveImageToStorage', this.temp_images_)
            .then((response) => {
              response.forEach((image) => {
                this.images.push(image)
              })
              this.temp_images_ = [] // clear array
              this.$emit('passImages', this.images)
              this.isLoading = false
            })
            .catch(() => {
              this.isLoading = false
              this.temp_images_.pop() // Removes last image that was tried to be uploaded
              this.$dialog.alert({
                message: 'Your image cannot be saved',
                type: 'is-danger'
              })
            })
        } else {
          this.$dialog.alert({
            message: 'You have added too many images',
            type: 'is-danger'
          })
        }
      },

      limitAmountOfImages (files) {
        if ((files.length + this.images.length) > 5) {
          return false
        }
        return true
      },

      addImageHandler () {
        this.$refs.fileInput.click()
      },

      isDisabled () {
        if (this.images.length >= 5) {
          this.disabled = true
        } else {
          this.disabled = false
        }
      },

      deleteImageModal (index, image) {
        this.$dialog.confirm({
          title: 'Test',
          message: 'Are you sure you want to delete',
          cancelText: 'Disagree',
          confirmText: 'Agree',
          type: 'is-success',
          onConfirm: () => {
            this.removeImage(index, image)
          }
        })
      },

      removeImage (index, image) {
        this.selected = image // Hide thumbnail before it is actually deleted
        this.$store.dispatch('userItem/removeImageFromStorage', image)
          .then((res) => {
            this.images.splice(index, 1)
            this.$emit('passImages', this.images)
          })
          .catch((err) => {
            console.log(err)
            this.selected = null // Show thumbnail as it hasnt been deleted due to errors
            this.$dialog.alert({
              title: 'Error',
              message: 'Looks like something went wrong',
              type: 'is-danger'
            })
          })
      }
    },

    watch: {
      images () {
        this.isDisabled()
      }
    }
  }
</script>

<style lang="styl">
  @import '~assets/css/utilities/variables.styl'

  .dropzone
    border 2px dashed $grey-200
    display flex
    min-height 200px
    cursor pointer
    background-color $grey-lighter
    position relative
    justify-content center
    flex-direction column
    align-items center
    color $grey

    strong
      color $grey

    &:hover
      background-color $white

    .native-input
      position absolute
      cursor pointer
      top 0px
      right 0
      bottom 0
      left 0
      width 100%
      height 100%
      opacity 0

      &[disabled]
        cursor not-allowed

    .upload-icon
      margin-bottom 1.5rem
      .fa
        font-size 3.5rem

    .dz-text
      align-self center
      font-size 1.5rem

      strong
        margin-right .5rem

  .dropzone-preview
    display flex

    .draggable-wrap
      li
        margin-right 1rem
        &:nth-child(5)
          margin-right 0

    .upload-images
      width 89px
      height 89px
      border 1px solid $grey
      background transparent
      cursor pointer
      display inline-block
      margin 1rem 1rem 0 0
      position relative
      overflow hidden

      &:hover
      &:focus
        .action-overlay
          display inline-flex

      .action-overlay
        position absolute
        width 35px
        height 35px
        padding .5rem 0
        z-index 1
        display flex
        align-items center
        justify-content center
        background $secondary
        border-radius 50%
        top 50%
        left 50%
        transform translate(-50%, -50%)
        display none

        .remove-image
          display inline-flex
          .icon
            .fa
              color #f7f7f7
              font-size $size-150

      &.upload-images-button
        border 1px dashed $grey-300
        align-items center
        justify-content center
        background-color $grey-lighter
        color $grey
        display inline-block
        margin-right 0

        button
          border 0
          height 100%
          width 100%
          cursor pointer
          background transparent

          &:hover
          &:focus
            background $white

          .fa-upload
            color $grey
</style>

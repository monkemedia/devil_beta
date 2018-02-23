<template lang="pug">
  .form-panel.variants-panel
    legend Variants
    p Add variants if this product comes in multiple versions, like different sizes or colours.
    table
      thead
        tr
          th(width="35%")
            span Option name
          th(width="50%")
            span Option value
          th(width="15%")
      tbody
        tr(v-for="(variant, index) in variants")
          td(width="35%")
            span.field
              .control
                input.input(
                  v-for="(ve, veIndex) in variantExamples"
                  v-if="index === veIndex"
                  :name="variant.name_slug"
                  :id="variant.name_slug"
                  v-model="variant.name"
                  :placeholder="'e.g ' + ve.name"
                  v-validate="''"
                  @change="onVariantChange"
                  type="text")
          td(width="50%")
            span.field
              .control
                input.input(
                  v-for="(ve, veIndex) in variantExamples"
                  v-if="index === veIndex"
                  :name="variant.value_slug"
                  :id="variant.value_slug"
                  v-model="variant.value"
                  v-validate="''"
                  placeholder="Seperate options with a comma"
                  @change="onVariantChange"
                  type="text")
          td(width="15%")
            span
              a.icon.remove-variant(v-if="index > 0")
                i.fa.fa-trash(@click="removeVariant(index)")
        tr
          td
            span
              a.add-additional-link(@click="cloneVariant()", v-if="variants !== undefined && variants.length < 3") Add another option
</template>

<script>
  export default {
    name: 'Variants',

    inject: ['$validator'],

    props: {
      formData: {
        type: Object,
        required: true
      }
    },

    data () {
      return {
        variants: [
          {
            name_slug: 'option_name_0',
            value_slug: 'option_value_0',
            name: '',
            value: ''
          }
        ],

        variantExamples: [
          { name: 'Colour', value: 'Red' },
          { name: 'Size', value: 'UK 10' },
          { name: 'Days worn', value: '3' }
        ]
      }
    },

    created () {
      this.onVariantChange()
    },

    methods: {
      removeVariant (index) {
        this.variants.splice(index, 1)
      },

      onVariantChange () {
        const array = []
        this.variants.forEach((item) => {
          const data = {
            name_slug: item.name_slug,
            value_slug: item.value_slug,
            name: item.name,
            value: item.value
          }
          array.push(data)
        })
        this.$emit('passVariant', array)
      },

      cloneVariant () {
        this.variants.push({
          name_slug: `option_name_${this.variants.length}`,
          value_slug: `option_value_${this.variants.length}`,
          name: '',
          value: ''
        })
      }
    },

    watch: {
      formData () {
        this.variants = this.formData.variants || this.variants
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .remove-variant
    padding 2rem

  p
    margin-bottom 2rem

  @media only screen and (min-width $table)  
    .add-option
      width 100%
      margin-top 0
</style>
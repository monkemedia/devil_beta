<template lang="pug">
  div
    form
      .columns
        .column.is-half
          .field
            label.label Title #[sup *]
            .control
              input.input(
                name="title"
                id="title"
                v-model="formData.title"
                type="text"
                data-vv-delay="600"
                :class="{ 'is-danger': errors.has('title') }"
                v-validate="'required'")
              p(v-show="errors.has('title')" class="help is-danger" v-html="errors.first('title')")

          .field
            label.label Description
            .control
              textarea.textarea(
                name="description"
                id="description"
                v-model="formData.description"
                type="text")

          .field
            label.label Category #[sup *]
            .control.is-expanded
              .select.is-fullwidth.is-multiple
                select(
                name="category"
                id="category"
                v-model="formData.category"
                data-vv-delay="600"
                :class="{ 'is-danger': errors.has('category') }"
                v-validate="'required'")
                  option(disabled value="") Please select a category
                  option(v-for="cat in categories" :value="cat.value") {{ cat.label }}
              p(v-show="errors.has('category')" class="help is-danger" v-html="errors.first('category')")
          .columns
            .column
              .field
                label.label Stock #[sup *]
                .control
                  input.input(
                    name="stock"
                    id="stock"
                    v-model.number="formData.stock"
                    data-vv-delay="600"
                    :class="{ 'is-danger': errors.has('stock') }"
                    v-validate="'required'"
                    type="number")
                  p(v-show="errors.has('stock')" class="help is-danger" v-html="errors.first('stock')")
            .column

          .form-panel.pricing-panel.field
            legend Pricing
            .columns
              .column
                .field.price-field
                  label.label Price #[sup *]
                .field.has-addons.price-field-input
                  .control.button.is-static.is-currency £
                  .control
                    input.input(
                      name="price"
                      id="price"
                      v-model.number="formData.price"
                      data-vv-delay="600"
                      :class="{ 'is-danger': errors.has('price') }"
                      v-validate="'required'"
                      type="number")
                  p(v-show="errors.has('price')" class="help is-danger" v-html="errors.first('price')")
              .column
                .field.price-field
                  label.label Sale price
                .field.has-addons
                  .control.button.is-static.is-currency £
                  .control
                    input.input(
                      name="sale_price"
                      id="sale_price"
                      v-model.number="formData.sale_price"
                      v-validate="''"
                      type="number")
            .columns
              .column
                .field
                  b-checkbox.is-medium(v-model="formData.on_sale")
                    | On sale

          .columns
            .column
              .field
                label.label Storefront
                .control.is-expanded
                  .select.is-fullwidth.is-multiple
                    select(
                    name="storefront"
                    id="storefront"
                    @change="clearErrors(formData.storefront)"
                    v-model="formData.storefront")
                      option(v-for="store in storefront_options" :value="store.value") {{ store.label }}

          //- variants(@passVariant="updateFormDataVariants" :formData="formData")

        .column.is-half
          upload-images(@passImages="updateFormDataImages" :imagesData="formData.images")
          shipping(@passShipping="updateFormDataShipping" :shippingData="formData.shipping")

      .columns
        .column.is-one-quarter
          .field
            .control
              button.button.is-primary.is-fullwidth.is-flip(@click.prevent="onSubmitForm" :class="{ 'is-loading': loading }")
                span(data-text="Save") Save
        //- .column.is-one-quarter
        //-   .field
        //-     .control
        //-       button.button.is-secondary.is-fullwidth.is-flip.save-draft(@click.prevent="onSubmitForm('save_draft')" :class="{ 'is-loading': isDraftItemButtonLoading }")
        //-         span(data-text="Save draft") Save draft

</template>

<script>
  import Vue from 'vue'
  import VeeValidate from 'vee-validate'
  import VueScrollTo from 'vue-scrollto'
  import Variants from '@/components/Admin/AddProduct/Variants'
  import UploadImages from '@/components/Admin/AddProduct/UploadImages'
  import Shipping from '@/components/Admin/AddProduct/Shipping'

  Vue.use(VeeValidate)

  export default {
    name: 'AddProductForm',

    props: {
      itemData: {
        type: Object,
        required: false
      }
    },

    components: {
      Variants,
      UploadImages,
      Shipping
    },

    data () {
      return {
        loading: false,
        formData: this.itemData
          ? { ...this.itemData } : {
            title: '',
            description: '',
            category: '',
            stock: 0,
            price: 0,
            on_sale: false,
            sale_price: 0,
            variants: [],
            shipping: [],
            images: [],
            storefront: 'hidden'
          },
        cached_store_front: '',
        categories: [
          { label: 'My Test', value: 'test' },
          { label: 'Test 2', value: 'test_2' }
        ],
        storefront_options: [
          { label: 'Hidden - Not visible on storefront', value: 'hidden' },
          { label: 'Visible - Currently visible on storefront', value: 'visible' }
        ]
      }
    },

    computed: {
      isFormValid () {
        return Object.keys(this.fields).every(key => this.fields[key] && this.fields[key].validated)
      }
    },

    methods: {
      onSubmitForm () {
        const paramId = this.$route.params.id || null
        const vm = this
        const payload = {
          ...this.formData,
          product_id: paramId
        }

        console.log(paramId)

        function createItem () {
          vm.loading = true
          vm.$store.dispatch('sellersItems/createItem', payload)
            .then((response) => {
              vm.cached_store_front = vm.cached_store_front

              if (payload.storefront === 'visible' && payload.storefront !== vm.cached_store_front) {
                vm.cached_store_front = payload.storefront
                vm.alertToast({ message: 'Item is now visible on storefront', type: 'is-success' })
              } else if (payload.storefront === 'hidden' && payload.storefront !== vm.cached_store_front) {
                vm.cached_store_front = payload.storefront
                vm.alertToast({ message: 'Item is now hidden from storefront', type: 'is-warning' })
              }

              if (paramId === null) {
                vm.$router.push({
                  path: `/admin/add-product/${response.product_id}`
                })
              }
              vm.loading = false
            })
            .catch((error) => {
              vm.alertToast({ message: error.message, type: 'is-danger' })
              vm.loading = false
            })
        }

        // If visibility is set to VISIBLE, then validate form
        if (this.formData.storefront === 'visible') {
          this.$validator.validateAll()
            .then((result) => {
              if (result) {
                createItem()
              } else {
                VueScrollTo.scrollTo('select.is-danger, .input.is-danger')
              }
            })
        } else {
          createItem()
        }
      },

      updateFormDataVariants (data) {
        this.formData.variants = data
      },

      updateFormDataShipping (data) {
        this.formData.shipping = data
      },

      updateFormDataImages (data) {
        this.formData.images = data
        this.onSubmitForm()
      },

      clearErrors (value) {
        if (value === 'hidden') {
          this.errors.clear()
        }
      }
    },

    watch: {
      scrollToError () {
        VueScrollTo.scrollTo('.is-danger')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~assets/css/utilities/variables.styl'

  .field.price-field
    margin-bottom 6px

  .is-currency
    border 0r !important
    margin 0
    font-size $size-150
    line-height 1
    padding 0 1.2rem

  .price-field-input
    flex-flow row wrap

    @media only screen and (min-width $desktop)
      padding 0

  @media only screen and (max-width $tablet)
    .save-draft
      margin-top 0

</style>

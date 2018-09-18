<template lang="pug">
  div
    form
      .columns
        .column.is-half
          .field
            label.label Title #[sup *]
            .control
              input.input(
                name="name"
                id="name"
                v-model="formData.name"
                type="text"
                data-vv-delay="600"
                :class="{ 'is-danger': errors.has('name') }"
                v-validate="'required'")
              p(v-show="errors.has('name')" class="help is-danger" v-html="errors.first('name')")

          .field
            label.label Description #[sup *]
            .control
              textarea.textarea(
                name="description"
                id="description"
                v-model="formData.description"
                type="text"
                :class="{ 'is-danger': errors.has('description') }"
                v-validate="'required'")
              p(v-show="errors.has('description')" class="help is-danger" v-html="errors.first('description')")
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
                  option(v-for="cat in categories" :value="cat.code") {{ cat.label }}
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
                      v-model.number="formData.price.amount"
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
                    name="status"
                    id="status"
                    @change="clearErrors(formData.status)"
                    v-model="formData.store_front")
                      option(v-for="store in storefront_options" :value="store.value") {{ store.label }}

          //- variants(@passVariant="updateFormDataVariants" :formData="formData")

        .column.is-half
          upload-images(@passImages="updateFormDataImages" :imagesData="formData.images")

        //- .column.is-one-quarter
        //-   .field
        //-     .control
        //-       button.button.is-secondary.is-fullwidth.is-flip.save-draft(@click.prevent="onSubmitForm('save_draft')" :class="{ 'is-loading': isDraftItemButtonLoading }")
        //-         span(data-text="Save draft") Save draft

</template>

<script>
  import Vue from 'vue'
  import VeeValidate, { Validator } from 'vee-validate'
  // import __ from 'lodash-addons'
  import VueScrollTo from 'vue-scrollto'
  import Variants from '@/components/Admin/AddProduct/Variants'
  import UploadImages from '@/components/Admin/AddProduct/UploadImages'
  import categories from '@/utils/categories'

  Vue.use(VeeValidate)

  const dict = {
    custom: {
      name: {
        required: 'Whoops! Title is required'
      },
      description: {
        required: 'Whoops! Description is required'
      },
      category: {
        required: 'Whoops! Category is required'
      },
      stock: {
        required: 'Whoops! Stock is required'
      },
      price: {
        required: 'Whoops! Price is required'
      }
    }
  }

  Validator.localize('en', dict)

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
      UploadImages
    },

    data () {
      return {
        loading: false,
        formData: {
          name: this.itemData ? this.itemData.name : '',
          description: this.itemData ? this.itemData.description : '',
          category: this.itemData ? this.itemData.category : '',
          on_sale: this.itemData ? this.itemData.on_sale : false,
          sale_price: this.itemData ? this.itemData.sale_price : 0,
          price: {
            amount: this.itemData ? this.itemData.price.amount : 0,
            currency: 'GBP'
          },
          store_front: this.itemData ? this.itemData.store_front : false,
          stock: this.itemData ? this.itemData.stock : 0
        },
        categories: categories,
        cached_store_front: '',
        storefront_options: [
          { label: 'Draft - Not live on storefront', value: false },
          { label: 'Live - Currently live on storefront', value: true }
        ]
      }
    },

    created () {
      this.$parent.$on('saveCreateForm', this.saveCreateForm)
    },

    computed: {
      isFormValid () {
        return Object.keys(this.fields).every(key => this.fields[key] && this.fields[key].validated)
      },

      vendorName () {
        return this.$store.getters['user/username']
      }
    },

    methods: {
      saveCreateForm () {
        console.log('SAVING')
        const params = this.$route.params || null
        const pageUrl = this.$route.path
        const username = this.$store.getters['user/username']
        const vm = this
        const payload = {
          ...this.formData,
          username
        }

        function createItem () {
          vm.loading = true
          vm.$store.dispatch('products/createProduct', payload)
            .then(res => {
              vm.cached_store_front = vm.cached_store_front

              if (payload.store_front && payload.store_front !== vm.cached_store_front) {
                vm.cached_store_front = payload.store_front
                vm.alertToast({ message: 'Item is now visible on storefront', type: 'is-success' })
              } else if (payload.store_front === false && payload.store_front !== vm.cached_store_front) {
                vm.cached_store_front = payload.store_front
                vm.alertToast({ message: 'Item is now hidden from storefront', type: 'is-warning' })
              }

              if (pageUrl.split('/').pop() === 'create') {
                vm.$router.push({
                  path: `/shop/${username}/setup/listings`
                })
              }
              vm.loading = false
            })
            .catch(err => {
              console.log('ERROR', err.message)
              vm.alertToast({ message: err.message, type: 'is-danger' })
              vm.loading = false
            })
        }

        function updateItem () {
          vm.loading = true
          vm.$store.dispatch('products/updateProduct', {
            ...payload,
            productId: params.productId
          })
            .then(() => {
              vm.loading = false
              vm.cached_store_front = vm.cached_store_front

              if (payload.store_front && payload.store_front !== vm.cached_store_front) {
                vm.cached_store_front = payload.store_front
                vm.alertToast({ message: 'Item is now visible on storefront', type: 'is-success' })
              } else if (payload.store_front === false && payload.store_front !== vm.cached_store_front) {
                vm.cached_store_front = payload.store_front
                vm.alertToast({ message: 'Item is now hidden from storefront', type: 'is-warning' })
              }

              if (pageUrl.split('/').includes('create')) {
                vm.$router.push({
                  path: `/shop/${username}/setup/listings`
                })
              }
            })
            .catch((err) => {
              vm.alertToast({ message: err.message, type: 'is-danger' })
              vm.loading = false
            })
        }

        this.$validator.validateAll()
          .then((result) => {
            if (result) {
              if (params.productId) {
                updateItem()
              } else {
                createItem()
              }
            } else {
              VueScrollTo.scrollTo('select.is-danger, .input.is-danger, .textarea.is-danger')
            }
          })
      },

      updateFormDataVariants (data) {
        this.formData.variants = data
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

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
            label.label Description
            .control
              textarea.textarea(
                name="description"
                id="description"
                v-model="formData.description"
                type="text"
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
                  option(v-for="cat in categories" :value="cat.id") {{ cat.name }}
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
                      v-model.number="formData.price[0].amount"
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
                    v-model="formData.status")
                      option(v-for="store in storefront_options" :value="store.value") {{ store.label }}

          //- variants(@passVariant="updateFormDataVariants" :formData="formData")

        .column.is-half
          upload-images(@passImages="updateFormDataImages" :imagesData="formData.images")

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
  import VeeValidate, { Validator } from 'vee-validate'
  import { slug, sku } from '../../../utils/code-generators.js'
  // import __ from 'lodash-addons'
  import VueScrollTo from 'vue-scrollto'
  import Variants from '@/components/Admin/AddProduct/Variants'
  import UploadImages from '@/components/Admin/AddProduct/UploadImages'

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
      },

      categories: {
        type: Array,
        required: true
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
          category: this.itemData ? this.itemData.relationships.categories.data[0].id : '',
          on_sale: this.itemData ? this.itemData.on_sale : false,
          sale_price: this.itemData ? this.itemData.sale_price : 0,
          price: [{
            amount: this.itemData ? this.itemData.price[0].amount : 0,
            currency: 'GBP',
            includes_tax: false
          }],
          commodity_type: 'physical',
          status: this.itemData ? this.itemData.status : 'draft',
          stock: this.itemData ? this.itemData.meta.stock.level : 0
        },
        cached_store_front: '',
        storefront_options: [
          { label: 'Draft - Not live on storefront', value: 'draft' },
          { label: 'Live - Currently live on storefront', value: 'live' }
        ]
      }
    },

    computed: {
      isFormValid () {
        return Object.keys(this.fields).every(key => this.fields[key] && this.fields[key].validated)
      },

      customerId () {
        return this.$store.getters['auth/getCustomerId']
      },

      vendorName () {
        return this.$store.getters['user/username']
      }
    },

    methods: {
      onSubmitForm () {
        const paramId = this.$route.params.id || null
        const vm = this
        const payload = {
          ...this.formData,
          manage_stock: true,
          id: paramId,
          slug: slug(),
          sku: sku(),
          type: 'product',
          vender_name: this.venderName
        }

        function createItem () {
          vm.loading = true
          vm.$store.dispatch('products/createProduct', payload)
            .then(res => {
              console.log('res', res.data.data.id)
              // Filter through brands to find BRAND ID
              const customerId = vm.$store.getters['auth/getCustomerId']
              console.log('customerId', customerId)

              return Promise.all([
                vm.$store.dispatch('products/brandId', { customerId }),
                { productId: res.data.data.id }
              ])
            })
            .then(res => {
              console.log('res 2', res)
              return Promise.all([
                vm.$store.dispatch('products/brandRelationships', {
                  brandId: res[0].data.data[0].id,
                  productId: res[1].productId
                }),
                { productId: res[1].productId }
              ])
            })
            .then(res => {
              return Promise.all([
                vm.$store.dispatch('products/categoryRelationships', {
                  categoryId: vm.formData.category,
                  productId: res[1].productId
                }),
                { productId: res[1].productId }
              ])
            })
            .then(res => {
              vm.cached_store_front = vm.cached_store_front

              if (payload.status === 'live' && payload.status !== vm.cached_store_front) {
                vm.cached_store_front = payload.status
                vm.alertToast({ message: 'Item is now visible on storefront', type: 'is-success' })
              } else if (payload.status === 'draft' && payload.status !== vm.cached_store_front) {
                vm.cached_store_front = payload.status
                vm.alertToast({ message: 'Item is now hidden from storefront', type: 'is-warning' })
              }

              if (paramId === null) {
                vm.$router.push({
                  path: `/admin/add-product/${res[1].productId}`
                })
              }
              vm.loading = false
            })
            .catch(err => {
              console.log('ERROR', err)
              vm.alertToast({ message: err.message, type: 'is-danger' })
              vm.loading = false
            })
        }

        function updateItem () {
          console.log('paramId', paramId)
          vm.loading = true
          vm.$store.dispatch('products/updateProduct', {
            payload,
            productId: paramId
          })
            .then(() => {
              vm.loading = false
              vm.cached_store_front = vm.cached_store_front

              console.log('PAYLOAD', payload)

              if (payload.status === 'live' && payload.status !== vm.cached_store_front) {
                vm.cached_store_front = payload.status
                vm.alertToast({ message: 'Item is now visible on storefront', type: 'is-success' })
              } else if (payload.status === 'draft' && payload.status !== vm.cached_store_front) {
                vm.cached_store_front = payload.status
                vm.alertToast({ message: 'Item is now hidden from storefront', type: 'is-warning' })
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
              if (paramId) {
                updateItem()
              } else {
                createItem()
              }
            } else {
              VueScrollTo.scrollTo('select.is-danger, .input.is-danger')
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

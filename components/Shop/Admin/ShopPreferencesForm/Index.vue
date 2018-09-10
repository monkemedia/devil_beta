<template lang="pug">
 .columns
  .column
        header
          //- breadcrumb(:crumb="breadcrumb")
          h1.add-product-heading Shop Preferences

        form
            .columns
              .column.is-half
                .field
                  label.label Language #[sup *]
                  .control.is-expanded
                    .select.is-fullwidth.is-multiple
                      select(
                        name="language"
                        id="language"
                        v-model="formData.language")
                        option(disabled value="") Please select a language
                        option(v-for="lang in languageOptions" :value="lang.code") {{ lang.label }}
            .columns
              .column.is-half
                .field
                  label.label Country #[sup *]
                  .control.is-expanded
                    .select.is-fullwidth.is-multiple
                      select(
                        name="country"
                        id="country"
                        v-model="formData.country")
                        option(disabled value="") Please select a country
                        option(v-for="country in countryOptions" :value="country.code") {{ country.label }}
            .columns
              .column.is-half
                .field
                  label.label Currency #[sup *]
                  .control.is-expanded
                    .select.is-fullwidth.is-multiple
                      select(
                        name="currency"
                        id="currency"
                        v-model="formData.currency")
                        option(disabled value="") Please select a currency
                        option(v-for="currency in currencyOptions" :value="currency.code") {{ currency.label }}
            .columns
              .column
                .field
                  .control
                    button.button.is-primary.is-fullwidth.is-flip(@click.prevent="saveForm" :class="{ 'is-loading': loading }")
                      span(data-text="Save") Save
</template>

<script>
  export default {
    name: 'ShopPreferencesForm',

    props: {
      formData: {
        type: Object,
        required: true
      }
    },

    data () {
      return {
        loading: false,
        languageOptions: [
          {
            label: 'English',
            code: 'en'
          },
          {
            label: 'Dutch',
            code: 'nl'
          },
          {
            label: 'Test only',
            code: ''
          }
        ],
        countryOptions: [
          {
            label: 'United Kingdom',
            code: 'uk'
          },
          {
            label: 'Netherlands',
            code: 'nl'
          }
        ],
        currencyOptions: [
          {
            label: '£ British Pound',
            code: 'GBP'
          },
          {
            label: '€ Euro',
            code: 'EUR'
          }
        ]
      }
    },

    methods: {
      updateStep () {
        if (this.formData.language && this.formData.country && this.formData.currency) {
          this.$emit('updateProgress', 1)
          return 1
        } else {
          this.$emit('updateProgress', 0)
          return 0
        }
      },

      saveForm () {
        const shopId = this.$store.getters['user/shopId']

        this.loading = true
        return this.$store.dispatch('shop/updateShop', {
          shopId,
          data: {
            ...this.formData,
            step: this.updateStep()
          }
        })
          .then(() => {
            return this.$store.dispatch('shop/fetchShop', shopId)
          })
          .then(() => {
            this.loading = false
          })
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>

import api from '~/api'
import _ from 'lodash'
import uploadcare from 'uploadcare-widget'

const state = () => ({
  loadedProduct: null,
  loadedMerchantProduct: null,
  loadedMerchantProducts: null,
  categories: null
})

const mutations = {
  SET_PRODUCT (state, product) {
    state.loadedProduct = product
  },

  SET_MERCHANT_PRODUCT (state, product) {
    state.loadedMerchantProduct = product
  },

  SET_MERCHANT_PRODUCTS (state, product) {
    state.loadedMerchantProducts = product
  },

  SET_CATEGORIES (state, categories) {
    state.categories = categories
  }
}

const actions = {
  saveImageToStorage ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      const promises = []
      payload.forEach((image) => {
        const file = uploadcare.fileFrom('object', image)
        promises.push(file)
      })

      Promise.all(promises)
        .then((fileData) => {
          const newArray = []
          fileData.forEach((fd) => {
            const filename = fd.name
            const fullPath = fd.cdnUrl
            const uuid = fd.uuid
            newArray.push({
              url: fullPath,
              alt: filename.substr(0, filename.indexOf('.')),
              filename,
              uuid
            })
          })

          return resolve(newArray)
        })
        .catch((err) => {
          return reject(err)
        })
    })
  },

  removeImageFromStorage ({ commit, getters }, payload) {
    const publicKey = process.env.UPLOADCARE_PUBLIC_KEY
    const privateKey = process.env.UPLOADCARE_SECRET_KEY
    const vm = this

    return new Promise((resolve, reject) => {
      const promises = []

      function file (image) {
        const f = vm.$axios({
          url: 'https://api.uploadcare.com/files/' + image.uuid + '/storage/',
          method: 'delete',
          data: null,
          headers: {
            'Authorization': 'Uploadcare.Simple ' + publicKey + ':' + privateKey
          }
        })
        promises.push(f)
      }

      if (payload.images && payload.images.length) {
        payload.images.forEach((image) => {
          file(image)
        })
      } else {
        file(payload)
      }

      Promise.all(promises)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  categories ({ commit }) {
    return api.products.categories()
      .then(response => {
        commit('SET_CATEGORIES', response.data.data)
      })
  },

  categoryRelationships ({}, data) {
    return api.products.categoryRelationship(data)
  },

  brandId ({}, data) {
    return api.products.brandId(data)
      .then(res => {
        console.log('brandId', res)
        return res
      })
  },

  brands ({}, data) {
    return api.products.brands(data)
  },

  brandRelationships ({}, data) {
    return api.products.brandRelationship(data)
  },

  updateProduct ({ commit }, itemDetails) {
    const itemData = {
      ...itemDetails
    }

    return api.products.updateProduct(itemData)
      .then(res => {
        commit('SET_MERCHANT_PRODUCT', res)
        return res
      })
      .catch(err => {
        throw err
      })
  },

  createProduct ({ commit }, itemDetails) {
    const itemData = {
      ...itemDetails,
      type: 'product'
    }

    return api.products.createProduct(itemData)
      .then(res => {
        commit('SET_MERCHANT_PRODUCT', res.data.data)
        return res
      })
      .catch(err => {
        throw err
      })
  },

  deleteProduct ({ getters, commit }, productId) {
    const products = getters['loadedMerchantProducts']

    return api.products.deleteProduct(productId)
      .then(() => {
        const removeItem = _.pickBy(products, (key) => {
          return productId !== key.id
        })

        if (_.isEmpty(removeItem)) {
          commit('SET_MERCHANT_PRODUCTS', [])
        } else {
          commit('SET_MERCHANT_PRODUCTS', removeItem)
        }
      })
      .catch(err => {
        throw err
      })
  },

  product ({ commit }, productId) {
    console.log('productId', productId)
    return api.products.product(productId)
      .then(res => {
        commit('SET_PRODUCT', res.data.data)
        return res
      })
      .catch(err => {
        throw err
      })
  },

  merchantProducts ({ commit }, brandId) {
    return api.products.merchantProducts(brandId)
      .then(res => {
        commit('SET_MERCHANT_PRODUCTS', res.data.data)
      })
      .catch(err => {
        throw err
      })
  }
}

const getters = {
  loadedMerchantProduct (state) {
    return state.loadedMerchantProduct
  },

  loadedMerchantProducts (state) {
    return state.loadedMerchantProducts
  },

  loadedProduct (state) {
    return state.loadedProduct
  },

  loadedCategories (state) {
    return state.categories
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

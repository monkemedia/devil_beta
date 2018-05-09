import api from '~/api'
// import _ from 'lodash'
import uploadcare from 'uploadcare-widget'

const state = () => ({
  loadedMerchantProduct: null,
  loadedMerchantProducts: null,
  categories: null
})

const mutations = {
  SET_MERCHANT_PRODUCT (state, item) {
    state.loadedMerchantProduct = item
  },

  SET_MERCHANT_PRODUCTS (state, item) {
    state.loadedMerchantProducts = item
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

  // deleteItem ({ commit, getters }, data) {
  //   let items = getters['loadedMerchantProducts']

  //   return this.$axios.$delete(`${process.env.FB_URL}/categories/${data.category}/${data.productId}.json?auth=${data.token}`)
  //     .then(() => {
  //       return this.$axios.$delete(`${process.env.FB_URL}/products/${data.productId}.json?auth=${data.token}`)
  //     })
  //     .then(() => {
  //       const removeItem = _.pickBy(items, (key) => {
  //         console.log(key)
  //         return data.productId !== key.product_id
  //       })

  //       if (_.isEmpty(removeItem)) {
  //         return commit('SET_MERCHANT_PRODUCTS', null)
  //       }

  //       commit('SET_SELLERS_ITEMS', removeItem)
  //       return true
  //     })
  //     .catch(err => {
  //       throw err
  //     })
  // },

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
        commit('SET_MERCHANT_PRODUCT', res)
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
        return res
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

import api from '~/api'
import _ from 'lodash'
import uploadcare from 'uploadcare-widget'

const state = () => ({
  loadedProduct: null,
  loadedVendorProduct: null,
  loadedVendorProducts: null
})

const mutations = {
  SET_PRODUCT (state, product) {
    state.loadedProduct = product
  },

  SET_VENDOR_PRODUCT (state, product) {
    state.loadedVendorProduct = product
  },

  SET_VENDOR_PRODUCTS (state, product) {
    state.loadedVendorProducts = product
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

  updateProduct ({ commit }, itemDetails) {
    const itemData = {
      ...itemDetails
    }

    return api.products.updateProduct(itemData)
      .then(res => {
        commit('SET_VENDOR_PRODUCT', res)
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
        commit('SET_VENDOR_PRODUCT', res.data.data)
        return res
      })
      .catch(err => {
        throw err
      })
  },

  deleteProduct ({ getters, commit }, productId) {
    const products = getters['loadedVendorProducts']

    return api.products.deleteProduct(productId)
      .then(() => {
        const removeItem = _.pickBy(products, (key) => {
          return productId !== key.id
        })

        if (_.isEmpty(removeItem)) {
          commit('SET_VENDOR_PRODUCTS', [])
        } else {
          commit('SET_VENDOR_PRODUCTS', removeItem)
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

  vendorProducts ({ commit }) {
    return api.products.vendorProducts()
      .then(res => {
        commit('SET_VENDOR_PRODUCTS', res.data.products)
      })
      .catch(err => {
        throw err
      })
  }
}

const getters = {
  loadedVendorProduct (state) {
    return state.loadedVendorProduct
  },

  loadedVendorProducts (state) {
    return state.loadedVendorProducts
  },

  loadedProduct (state) {
    return state.loadedProduct
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

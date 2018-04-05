import _ from 'lodash'
import { key } from 'firebase-key'
import uploadcare from 'uploadcare-widget'

const store = {
  namespaced: true,

  state: {
    loadedSellersItem: null,
    loadedSellersItems: null
  },

  mutations: {
    SET_SELLERS_ITEM (state, item) {
      state.loadedSellersItem = item
    },

    SET_SELLERS_ITEMS (state, item) {
      state.loadedSellersItems = item
    }
  },

  actions: {
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

    deleteItem ({ commit, getters }, data) {
      let items = getters['loadedSellersItems']

      return this.$axios.$delete(`${process.env.BASE_URL}/categories/${data.category}/${data.productId}.json?auth=${data.token}`)
        .then(() => {
          return this.$axios.$delete(`${process.env.BASE_URL}/products/${data.productId}.json?auth=${data.token}`)
        })
        .then(() => {
          const removeItem = _.pickBy(items, (key) => {
            console.log(key)
            return data.productId !== key.product_id
          })

          if (_.isEmpty(removeItem)) {
            return commit('SET_SELLERS_ITEMS', null)
          }

          commit('SET_SELLERS_ITEMS', removeItem)
          return true
        })
        .catch((err) => {
          throw err
        })
    },

    createItem ({ commit, dispatch, rootGetters }, itemDetails) {
      const token = rootGetters['auth/token']
      const username = rootGetters['auth/username']
      const userId = rootGetters['auth/userId']
      const category = itemDetails.category
      let uniqueId
      let productId

      if (itemDetails.product_id !== null) {
        uniqueId = itemDetails.product_id
      } else {
        uniqueId = key()
      }

      const itemData = {
        ...itemDetails,
        username,
        product_id: uniqueId
      }

      return this.$axios.$put(`${process.env.BASE_URL}/userProducts/${userId}/${uniqueId}.json?auth=${token}`, itemData)
        .then(() => {
          if (itemDetails.storefront === 'visible') {
            return this.$axios.$patch(`${process.env.BASE_URL}/categories/${category}/${uniqueId}.json?auth=${token}`, { productId: uniqueId })
              .then(() => {
                return this.$axios.$put(`${process.env.BASE_URL}/products/${uniqueId}.json?auth=${token}`, itemData)
              })
          } else {
            productId = uniqueId
            return dispatch('deleteItem', { productId, category, token })
          }
        })
        .then(() => {
          commit('SET_SELLERS_ITEM', itemData)
          return itemData
        })
        .catch((err) => {
          throw err
        })
    }
  },

  getters: {
    loadedSellersItem (state) {
      return state.loadedSellersItem
    },

    loadedSellersItems (state) {
      return state.loadedSellersItems
    }
  }
}

export default store

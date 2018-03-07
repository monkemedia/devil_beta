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

    createItem (vuexContext, itemDetails) {
      const token = vuexContext.rootGetters['auth/token']
      const username = vuexContext.rootGetters['auth/username']
      const userId = vuexContext.rootGetters['auth/userId']
      const category = itemDetails.category
      let uniqueId

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

      return this.$axios.$put(`${process.env.BASE_URL}/usersProducts/${userId}/${uniqueId}.json?auth=${token}`, itemData)
        .then(() => {
          if (itemDetails.storefront === 'visible') {
            return this.$axios.$put(`${process.env.BASE_URL}/categories/${category}/${uniqueId}.json?auth=${token}`, itemData)
              .then(() => {
                return this.$axios.$put(`${process.env.BASE_URL}/products/${uniqueId}.json?auth=${token}`, itemData)
              })
          }
        })
        .then(() => {
          console.log(vuexContext)
          vuexContext.commit('SET_SELLERS_ITEM', itemData)
          return itemData
        })
        .catch((err) => {
          throw err
        })
    },

    removeSellersItem ({ state, commit }, payload) {
      let items = state.loadedSellersItems

      const removeItem =_.pickBy(items, (key) => {
        console.log(key)
        return payload.product_id !== key.product_id
      })

      if (_.isEmpty(removeItem)) {
        return commit('SET_SELLERS_ITEMS', null)
      }

      commit('SET_SELLERS_ITEMS', removeItem)
    }
  },

  getters: {
    loadedSellersItem (state) {
      return state.loadedSellersItem
    },

    loadedSellersItems (state) {
      return state.loadedSellersItems
    },
  }
}

export default store
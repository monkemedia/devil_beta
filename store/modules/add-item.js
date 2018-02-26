import _ from 'lodash'
import { key } from 'firebase-key'

const store = {
  namespaced: true,

  state: {
  },

  mutations: {
  },

  actions: {
    createItem (vuexContext, itemDetails) {
      console.log('vuexContext', vuexContext)
      const token = vuexContext.rootGetters['auth/token']
      const username = vuexContext.rootGetters['auth/username']
      const category = itemDetails.category
      let uniqueId

      console.log('token', token)
      console.log('itemdetails', itemDetails)

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
      return this.$axios.$put(`${process.env.BASE_URL}/categories/${category}/${uniqueId}.json?auth=${token}`, itemData)
    }
  },

  getters: {}
}

export default store